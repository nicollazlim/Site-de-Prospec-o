import React, { useState, useEffect, useMemo, useDeferredValue, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { SupplierList } from './components/SupplierList';
import { InteractiveMap } from './components/InteractiveMap';
import { FullListView } from './components/FullListView';
import { BulkImportModal } from './components/BulkImportModal';
import { SupplierDetailModal } from './components/SupplierDetailModal';
import { 
  ImportTaskStatus, 
  Supplier, 
  SupplierFilters 
} from './types/supplier';
import { getCuratedSuppliers } from './services/curatedSuppliers';
import { fetchCnpjData, processBatchCnpjs } from './services/apiService';
import { calculateDistanceKm, REGIOES_BRASIL, VERIFIED_COMPANY_COORDINATES, getCoordinatesForCity } from './services/geoCoordinates';
import { checkSupplierCnaeMatch } from './services/cnaeService';
import { fetchEmailFromCnpjJa } from './services/cnpjJaService';
import { ListFilter, Map as MapIcon, Loader2, Square, Infinity as InfinityIcon } from 'lucide-react';

export default function App() {
  // Modo de visualização: Mapa & Prospecção ou Lista Corporativa (sem mapa, estilo da imagem)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Estado principal de fornecedores (inicia sincronizando com coordenadas verificadas oficiais)
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      localStorage.removeItem('prospecfor_suppliers_v1');
      const saved = localStorage.getItem('zethus_suppliers_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: Supplier) => {
            const clean = (s.cnpj || '').replace(/\D/g, '');
            if (VERIFIED_COMPANY_COORDINATES[clean]) {
              return {
                ...s,
                endereco: {
                  ...s.endereco,
                  latitude: VERIFIED_COMPANY_COORDINATES[clean].lat,
                  longitude: VERIFIED_COMPANY_COORDINATES[clean].lng,
                }
              };
            }
            // Auto-heal de geolocalização: se o município não for Belo Horizonte,
            // recalcula e assegura as coordenadas oficiais do município (ex: Veredinha, Lagoa dos Patos)
            const normMun = (s.endereco?.municipio || '').toUpperCase().trim();
            if (normMun && !normMun.includes('BELO HORIZONTE')) {
              const exactCoords = getCoordinatesForCity(s.endereco.municipio, s.endereco.uf, s.cnpj);
              if (exactCoords) {
                return {
                  ...s,
                  endereco: {
                    ...s.endereco,
                    latitude: exactCoords.lat,
                    longitude: exactCoords.lng,
                  }
                };
              }
            }
            return s;
          });
        }
      }
    } catch {
      // Ignora erro
    }
    return getCuratedSuppliers();
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isLoadingSingle, setIsLoadingSingle] = useState(false);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');

  // Estado de geolocalização do comprador
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Status de tarefas de importação em lote
  const [taskStatus, setTaskStatus] = useState<ImportTaskStatus>({
    status: 'idle',
    total: 0,
    processed: 0,
    successCount: 0,
    errorCount: 0,
    logs: [],
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  // Filtros de busca e ordenação
  const [filters, setFilters] = useState<SupplierFilters>({
    searchQuery: '',
    regiao: '',
    uf: '',
    cidade: '',
    situacaoCadastral: '',
    nivelRisco: '',
    porte: '',
    regimeTributario: '',
    tipoEstabelecimento: '',
    cnaeSecao: '',
    cnaeDivisao: '',
    cnaeGrupo: '',
    cnaeClasse: '',
    cnaeSubclasse: '',
    cnaeCodigo: '',
    cnaeApenasPrincipal: false,
    sortBy: 'score_desc',
  });

  // Busca diferida para 60fps em digitação com grandes volumes
  const deferredSearchQuery = useDeferredValue(filters.searchQuery);

  // Carregamento On-Demand de e-mail via API CNPJ Já ao clicar no card ou abrir dossiê
  const enrichEmailOnDemand = useCallback(async (supplier: Supplier) => {
    // Se já possui e-mail registrado, não precisa reconsultar
    if (supplier.contato.email) return;

    try {
      const email = await fetchEmailFromCnpjJa(supplier.cnpj);
      if (email) {
        setSuppliers(prev => prev.map(s => s.cnpj === supplier.cnpj ? {
          ...s,
          contato: { ...s.contato, email }
        } : s));

        setSelectedSupplier(prev => prev && prev.cnpj === supplier.cnpj ? {
          ...prev,
          contato: { ...prev.contato, email }
        } : prev);

        setDetailSupplier(prev => prev && prev.cnpj === supplier.cnpj ? {
          ...prev,
          contato: { ...prev.contato, email }
        } : prev);
      }
    } catch {
      // Falha silenciosa: deixa e-mail em branco conforme regra
    }
  }, []);

  // Salva no localStorage quando a lista muda
  useEffect(() => {
    try {
      localStorage.setItem('zethus_suppliers_v2', JSON.stringify(suppliers));
    } catch {
      // Ignora erro de cota
    }
  }, [suppliers]);

  // Recalcula distâncias se a localização do comprador mudar
  const suppliersWithDistance = useMemo(() => {
    if (!userLocation) return suppliers;

    return suppliers.map(s => {
      if (s.endereco.latitude && s.endereco.longitude) {
        const dist = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          s.endereco.latitude,
          s.endereco.longitude
        );
        return { ...s, distanciaKm: dist };
      }
      return s;
    });
  }, [suppliers, userLocation]);

  // Aplicação dos Filtros e Ordenação com busca otimizada
  const filteredSuppliers = useMemo(() => {
    const rawQuery = deferredSearchQuery.trim();
    const query = rawQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const normalizeText = (text?: string) => 
      (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    return suppliersWithDistance.filter(s => {
      // 1. Busca textual global (insensível a acentuação e inclui CNAEs secundários)
      if (query) {
        const inRazao = normalizeText(s.razaoSocial).includes(query);
        const inFantasia = normalizeText(s.nomeFantasia).includes(query);
        const inCnpj = s.cnpj.includes(query) || s.formattedCnpj.includes(query);
        const inCidade = normalizeText(s.endereco.municipio).includes(query);
        const inBairro = normalizeText(s.endereco.bairro).includes(query);
        const inUf = normalizeText(s.endereco.uf).includes(query);
        const inCnaePrincipal = normalizeText(s.cnaePrincipal.descricao).includes(query) || s.cnaePrincipal.codigo.includes(query);
        const inCnaesSecundarios = (s.cnaesSecundarios || []).some(
          c => normalizeText(c.descricao).includes(query) || c.codigo.includes(query)
        );
        const inPhone = s.contato.telefonePrincipal.includes(query);
        const inQsa = s.qsa.some(socio => normalizeText(socio.nome).includes(query));

        if (!inRazao && !inFantasia && !inCnpj && !inCidade && !inBairro && !inUf && !inCnaePrincipal && !inCnaesSecundarios && !inPhone && !inQsa) {
          return false;
        }
      }

      // 2. Filtro de Região do Brasil (Sudeste, Sul, Nordeste, Centro-Oeste, Norte)
      if (filters.regiao && filters.regiao.trim()) {
        const ufs = REGIOES_BRASIL[filters.regiao] || [];
        if (!ufs.includes(s.endereco.uf.toUpperCase())) {
          return false;
        }
      }

      // 3. Filtro de UF (Estado)
      if (filters.uf && s.endereco.uf.toUpperCase() !== filters.uf.toUpperCase()) {
        return false;
      }

      // 4. Filtro de Cidade / Município (insensível a acentos: São Paulo == Sao Paulo)
      if (filters.cidade && filters.cidade.trim()) {
        const normCity = normalizeText(filters.cidade);
        const suppCity = normalizeText(s.endereco.municipio);
        if (suppCity !== normCity && !suppCity.includes(normCity)) {
          return false;
        }
      }

      // 5. Filtro de Situação Cadastral
      if (filters.situacaoCadastral && s.situacaoCadastral !== filters.situacaoCadastral) {
        return false;
      }

      // 6. Filtro de Nível de Risco
      if (filters.nivelRisco && s.analiseFinanceira.nivelRisco !== filters.nivelRisco) {
        return false;
      }

      // 7. Filtro de Porte
      if (filters.porte && s.porte !== filters.porte) {
        return false;
      }

      // 8. Filtro de Regime Tributário
      if (filters.regimeTributario && s.regimeTributario !== filters.regimeTributario) {
        return false;
      }

      // 9. Filtro de Tipo de Estabelecimento (Matriz / Filial)
      if (filters.tipoEstabelecimento && s.tipoEstabelecimento !== filters.tipoEstabelecimento) {
        return false;
      }

      // 10. Filtro CNAE Multi-nível IBGE (5 Níveis: Seção, Divisão, Grupo, Classe, Subclasse e Busca)
      if (
        filters.cnaeSecao || 
        filters.cnaeDivisao || 
        filters.cnaeGrupo || 
        filters.cnaeClasse || 
        filters.cnaeSubclasse || 
        filters.cnaeCodigo
      ) {
        if (!checkSupplierCnaeMatch(s, {
          cnaeSecao: filters.cnaeSecao,
          cnaeDivisao: filters.cnaeDivisao,
          cnaeGrupo: filters.cnaeGrupo,
          cnaeClasse: filters.cnaeClasse,
          cnaeSubclasse: filters.cnaeSubclasse,
          cnaeCodigo: filters.cnaeCodigo,
          apenasPrincipal: filters.cnaeApenasPrincipal,
        })) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'score_desc') {
        return b.analiseFinanceira.scoreGeral - a.analiseFinanceira.scoreGeral;
      }
      if (filters.sortBy === 'score_asc') {
        return a.analiseFinanceira.scoreGeral - b.analiseFinanceira.scoreGeral;
      }
      if (filters.sortBy === 'capital_desc') {
        return b.capitalSocial - a.capitalSocial;
      }
      if (filters.sortBy === 'tempo_desc') {
        return b.analiseFinanceira.tempoMercadoAnos - a.analiseFinanceira.tempoMercadoAnos;
      }
      if (filters.sortBy === 'proximidade') {
        const distA = a.distanciaKm ?? 999999;
        const distB = b.distanciaKm ?? 999999;
        return distA - distB;
      }
      if (filters.sortBy === 'nome_asc') {
        return (a.nomeFantasia || a.razaoSocial).localeCompare(b.nomeFantasia || b.razaoSocial);
      }
      return 0;
    });
  }, [suppliersWithDistance, filters]);

  // Seleção de fornecedor com carregamento on-demand de e-mail via API CNPJ Já
  const handleSelectSupplier = useCallback((supplier: Supplier | null) => {
    setSelectedSupplier(supplier);
    if (supplier) {
      enrichEmailOnDemand(supplier);
    }
  }, [enrichEmailOnDemand]);

  // Abertura de Dossiê com enriquecimento imediato de e-mail via API CNPJ Já
  const handleOpenDetails = useCallback((supplier: Supplier) => {
    enrichEmailOnDemand(supplier);
    setDetailSupplier(supplier);
    setIsDetailModalOpen(true);
  }, [enrichEmailOnDemand]);

  // Foco no mapa a partir do card
  const handleFocusOnMap = useCallback((supplier: Supplier) => {
    enrichEmailOnDemand(supplier);
    setSelectedSupplier(supplier);
    setMobileTab('map');
  }, [enrichEmailOnDemand]);

  // Adição rápida de CNPJ individual
  const handleQuickAddCnpj = async (rawCnpj: string) => {
    setIsLoadingSingle(true);
    try {
      const newSupplier = await fetchCnpjData(rawCnpj);
      setSuppliers(prev => {
        const exists = prev.some(s => s.cnpj === newSupplier.cnpj);
        if (exists) {
          return prev.map(s => s.cnpj === newSupplier.cnpj ? newSupplier : s);
        }
        return [newSupplier, ...prev];
      });
      setSelectedSupplier(newSupplier);
    } finally {
      setIsLoadingSingle(false);
    }
  };

  // Cancelar processamento em lote a qualquer momento
  const handleCancelBatchProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Processamento em lote com cancelamento e atualização progressiva em tempo real
  const handleStartBatchProcessing = async (cnpjs: string[], isUnlimited = false, turboSpeed = true) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const results = await processBatchCnpjs(cnpjs, {
      signal: controller.signal,
      isUnlimited,
      turboMode: turboSpeed,
      onProgress: (status) => {
        setTaskStatus(status);
      },
      onChunkSuccess: (chunkSuppliers) => {
        // Alimenta o mapa e a lista de fornecedores em tempo real durante a execução
        setSuppliers(prev => {
          const map = new Map(prev.map(s => [s.cnpj, s]));
          chunkSuppliers.forEach(item => map.set(item.cnpj, item));
          const updated = Array.from(map.values());
          try {
            localStorage.setItem('zethus_suppliers_v2', JSON.stringify(updated));
          } catch {
            // Ignora cota de armazenamento
          }
          return updated;
        });
      },
    });

    if (results.length > 0) {
      setSuppliers(prev => {
        const map = new Map(prev.map(s => [s.cnpj, s]));
        results.forEach(item => map.set(item.cnpj, item));
        const updated = Array.from(map.values());
        try {
          localStorage.setItem('zethus_suppliers_v2', JSON.stringify(updated));
        } catch {
          // Ignora cota
        }
        return updated;
      });
    }
  };

  // Adiciona fornecedores diretamente já extraídos de CSV sem necessidade de fila
  const handleImportDirectSuppliers = (newSuppliers: Supplier[]) => {
    setSuppliers(prev => {
      const map = new Map(prev.map(s => [s.cnpj, s]));
      newSuppliers.forEach(item => {
        let supplier = item;
        const normMun = (item.endereco?.municipio || '').toUpperCase().trim();
        if (normMun && !normMun.includes('BELO HORIZONTE')) {
          const exact = getCoordinatesForCity(item.endereco.municipio, item.endereco.uf, item.cnpj);
          if (exact) {
            supplier = {
              ...item,
              endereco: {
                ...item.endereco,
                latitude: exact.lat,
                longitude: exact.lng,
              }
            };
          }
        }
        map.set(supplier.cnpj, supplier);
      });
      const updated = Array.from(map.values());
      try {
        localStorage.setItem('zethus_suppliers_v2', JSON.stringify(updated));
      } catch {
        // Ignora cota de armazenamento
      }
      return updated;
    });
  };

  // Restaurar Base Curada de Demonstração
  const handleResetToDemo = () => {
    const demo = getCuratedSuppliers();
    setSuppliers(demo);
    setSelectedSupplier(null);
  };

  // Limpar todos os dados de empresas carregadas
  const handleClearAll = () => {
    setSuppliers([]);
    setSelectedSupplier(null);
    setDetailSupplier(null);
    try {
      localStorage.removeItem('zethus_suppliers_v2');
      localStorage.removeItem('prospecfor_suppliers_v1');
    } catch {
      // Ignora
    }
  };

  // Obter localização do comprador para cálculo de frete e proximidade
  const handleGetBuyerLocation = () => {
    if (userLocation) {
      // Toggle off
      setUserLocation(null);
      return;
    }

    if (!navigator.geolocation) {
      alert('Geolocalização não suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        // Fallback para o centro de São Paulo / Polo da Faria Lima caso permissão negada
        setUserLocation({
          lat: -23.5874,
          lng: -46.6817,
        });
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  // Exportação CSV
  const handleExportCsv = () => {
    const headers = [
      'CNPJ',
      'Razão Social',
      'Nome Fantasia',
      'Situação Cadastral',
      'Regime Tributário',
      'Tipo Estabelecimento',
      'Score Financeiro',
      'Nível de Risco',
      'Porte',
      'Capital Social',
      'CNAE Principal',
      'Município',
      'UF',
      'Telefone',
      'E-mail',
    ];

    const rows = filteredSuppliers.map(s => [
      `"${s.formattedCnpj}"`,
      `"${s.razaoSocial.replace(/"/g, '""')}"`,
      `"${s.nomeFantasia.replace(/"/g, '""')}"`,
      `"${s.situacaoCadastral}"`,
      `"${s.regimeTributario}"`,
      `"${s.tipoEstabelecimento}"`,
      s.analiseFinanceira.scoreGeral,
      `"${s.analiseFinanceira.nivelRisco}"`,
      `"${s.porte}"`,
      s.capitalSocial,
      `"${s.cnaePrincipal.codigo} - ${s.cnaePrincipal.descricao.replace(/"/g, '""')}"`,
      `"${s.endereco.municipio}"`,
      `"${s.endereco.uf}"`,
      `"${s.contato.telefonePrincipal}"`,
      `"${s.contato.email || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fornecedores_prospect_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Exportação JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredSuppliers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fornecedores_prospect_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        suppliers={suppliers}
        filteredSuppliers={filteredSuppliers}
        onOpenBulkModal={() => {
          setTaskStatus({
            status: 'idle',
            total: 0,
            processed: 0,
            successCount: 0,
            errorCount: 0,
            logs: [],
          });
          setIsBulkModalOpen(true);
        }}
        onResetToDemo={handleResetToDemo}
        onClearAll={handleClearAll}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        onGetBuyerLocation={handleGetBuyerLocation}
        userLocation={userLocation}
        isLocating={isLocating}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Conditional View Rendering: Full Corporate List (sem mapa) vs Mapa & Prospecção */}
      {viewMode === 'list' ? (
        <div className="flex-1 flex overflow-hidden">
          <FullListView
            suppliers={filteredSuppliers}
            allSuppliers={suppliers}
            filters={filters}
            onFilterChange={setFilters}
            onOpenDetails={handleOpenDetails}
            onSwitchToMapWithSupplier={(supplier) => {
              handleSelectSupplier(supplier);
              setViewMode('map');
              setMobileTab('map');
            }}
            onEnrichEmail={enrichEmailOnDemand}
            onOpenBulkModal={() => setIsBulkModalOpen(true)}
            onResetToDemo={handleResetToDemo}
          />
        </div>
      ) : (
        <>
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden flex border-b border-slate-800 bg-slate-900 shrink-0">
            <button
              onClick={() => setMobileTab('list')}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                mobileTab === 'list' 
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-850' 
                  : 'text-slate-400'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>Lista ({filteredSuppliers.length})</span>
            </button>

            <button
              onClick={() => setMobileTab('map')}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                mobileTab === 'map' 
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-850' 
                  : 'text-slate-400'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Mapa Interativo</span>
            </button>
          </div>

          {/* Main Dual-Column Content */}
          <main className="flex-1 flex overflow-hidden relative">
            {/* Left Column: Supplier List Sidebar */}
            <div className={`h-full ${mobileTab === 'list' ? 'flex w-full lg:w-auto' : 'hidden lg:flex'}`}>
              <SupplierList
                suppliers={filteredSuppliers}
                allSuppliers={suppliers}
                selectedSupplier={selectedSupplier}
                filters={filters}
                onFilterChange={setFilters}
                onSelectSupplier={handleSelectSupplier}
                onOpenDetails={handleOpenDetails}
                onFocusOnMap={handleFocusOnMap}
                onQuickAddCnpj={handleQuickAddCnpj}
                onOpenBulkModal={() => setIsBulkModalOpen(true)}
                isLoadingSingle={isLoadingSingle}
              />
            </div>

            {/* Right Column: Interactive Leaflet Map */}
            <div className={`h-full flex-1 min-h-[420px] ${mobileTab === 'map' ? 'flex w-full' : 'hidden lg:flex'}`}>
              <InteractiveMap
                suppliers={filteredSuppliers}
                selectedSupplier={selectedSupplier}
                onSelectSupplier={handleSelectSupplier}
                onOpenDetails={handleOpenDetails}
                userLocation={userLocation}
                isVisible={viewMode === 'map' && (mobileTab === 'map' || (typeof window !== 'undefined' && window.innerWidth >= 1024))}
              />
            </div>
          </main>
        </>
      )}

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onStartProcessing={handleStartBatchProcessing}
        onCancelProcessing={handleCancelBatchProcessing}
        onImportDirectSuppliers={handleImportDirectSuppliers}
        taskStatus={taskStatus}
      />

      {/* Full Supplier Details Dossier Modal */}
      <SupplierDetailModal
        supplier={detailSupplier}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailSupplier(null);
        }}
      />

      {/* Floating Status & Stop Bar when processing in background */}
      {taskStatus.status === 'processing' && !isBulkModalOpen && (
        <aside
          aria-label="Progresso de Carregamento de CNPJs"
          className="fixed bottom-5 right-5 z-50 bg-slate-900/95 border-2 border-blue-500 rounded-2xl shadow-2xl p-3 backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom duration-200 max-w-md"
        >
          <Loader2 className={`w-5 h-5 animate-spin shrink-0 ${taskStatus.isUnlimited ? 'text-emerald-400' : 'text-blue-400'}`} />
          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
              {taskStatus.isUnlimited ? (
                <span>Quantidade Total Carregada: <strong className="text-emerald-400 font-mono text-sm">{taskStatus.processed}</strong> CNPJs</span>
              ) : (
                <span>Carregando: <strong className="text-blue-400 font-mono">{taskStatus.processed}</strong> de {taskStatus.total} ({taskStatus.total > 0 ? Math.round((taskStatus.processed / taskStatus.total) * 100) : 0}%)</span>
              )}
            </div>
            <div className="text-[11px] text-emerald-300 font-medium truncate">
              {taskStatus.successCount} empresas adicionadas ao mapa em tempo real
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              Ver
            </button>
            <button
              onClick={handleCancelBatchProcessing}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-rose-900/30"
              title="Parar carregamento imediatamente"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Parar</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
