import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  FileText, 
  Bookmark, 
  Share2, 
  FileCode, 
  CheckCircle2, 
  CheckCircle,
  Sparkles,
  Users,
  Search,
  Filter,
  Layers,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UploadCloud,
  BookOpen,
  Tag
} from 'lucide-react';
import { Supplier, SupplierFilters } from '../types/supplier';
import { formatCurrencyBRL, formatPhoneNumber } from '../services/cnpjValidator';
import { 
  CNAE_SECTIONS, 
  getDivisionsForSection,
  getGroupsForDivision,
  getClassesForGroup,
  getSubclassesForClass,
  getMatchingCnae
} from '../services/cnaeService';
import { 
  REGIOES_BRASIL, 
  LISTA_REGIOES, 
  getRegiaoFromUf 
} from '../services/geoCoordinates';
import { CnaeCatalogModal } from './CnaeCatalogModal';
import { CnaeCascadeFilter } from './CnaeCascadeFilter';

interface FullListViewProps {
  suppliers: Supplier[];
  allSuppliers?: Supplier[];
  filters: SupplierFilters;
  onFilterChange: (newFilters: SupplierFilters) => void;
  onOpenDetails: (supplier: Supplier) => void;
  onSwitchToMapWithSupplier: (supplier: Supplier) => void;
  onEnrichEmail?: (supplier: Supplier) => void;
  onOpenBulkModal?: () => void;
  onResetToDemo?: () => void;
}

export const FullListView: React.FC<FullListViewProps> = ({
  suppliers,
  allSuppliers = [],
  filters,
  onFilterChange,
  onOpenDetails,
  onSwitchToMapWithSupplier,
  onEnrichEmail,
  onOpenBulkModal,
  onResetToDemo,
}) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCnaes, setExpandedCnaes] = useState<Record<string, boolean>>({});
  const [savedRfps, setSavedRfps] = useState<Record<string, boolean>>({});
  const [selectedForComparison, setSelectedForComparison] = useState<Record<string, boolean>>({});
  const [isCnaeModalOpen, setIsCnaeModalOpen] = useState(false);

  const suppliersSource = allSuppliers && allSuppliers.length > 0 ? allSuppliers : suppliers;
  
  // Estado de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Retorna para a página 1 sempre que os filtros ou a lista mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, suppliers.length]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (listContainerRef.current) {
      listContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleExpand = (supplier: Supplier) => {
    const nextState = !expandedCards[supplier.id];
    setExpandedCards(prev => ({ ...prev, [supplier.id]: nextState }));
    if (nextState && !supplier.contato.email && onEnrichEmail) {
      onEnrichEmail(supplier);
    }
  };

  const toggleCnaes = (id: string) => {
    setExpandedCnaes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCnpj = (cnpj: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cnpj);
    setCopiedId(cnpj);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSaveRfp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedRfps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForComparison(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Opções Geográficas
  const availableRegioes = LISTA_REGIOES;

  const availableUfs = useMemo(() => {
    let list = Array.from(new Set(suppliersSource.map(s => s.endereco.uf))).filter(Boolean).sort();
    if (filters.regiao) {
      const regionUfs = REGIOES_BRASIL[filters.regiao] || [];
      list = list.filter(uf => regionUfs.includes(uf.toUpperCase()));
    }
    return list;
  }, [suppliersSource, filters.regiao]);

  const availableCities = useMemo(() => {
    let list = suppliersSource;
    if (filters.regiao) {
      const regionUfs = REGIOES_BRASIL[filters.regiao] || [];
      list = list.filter(s => regionUfs.includes(s.endereco.uf.toUpperCase()));
    }
    if (filters.uf) {
      list = list.filter(s => s.endereco.uf.toUpperCase() === filters.uf.toUpperCase());
    }
    return Array.from(new Set(list.map(s => s.endereco.municipio))).filter(Boolean).sort();
  }, [suppliersSource, filters.regiao, filters.uf]);

  // Opções CNAE baseadas em suppliersSource
  const availableGroups = useMemo(() => {
    return getGroupsForDivision(filters.cnaeDivisao, filters.cnaeSecao, suppliersSource);
  }, [filters.cnaeDivisao, filters.cnaeSecao, suppliersSource]);

  const availableClasses = useMemo(() => {
    return getClassesForGroup(filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao, suppliersSource);
  }, [filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao, suppliersSource]);

  const availableSubclasses = useMemo(() => {
    return getSubclassesForClass(filters.cnaeClasse, filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao, suppliersSource);
  }, [filters.cnaeClasse, filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao, suppliersSource]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Filter Bar para a visão de lista completa */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 shrink-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Lista Corporativa de Fornecedores</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                {suppliers.length} {suppliers.length === 1 ? 'empresa' : 'empresas'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Visão detalhada com dados de compliance, quadro societário, regime tributário e CNDs
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const allExpanded: Record<string, boolean> = {};
                suppliers.forEach(s => { allExpanded[s.id] = true; });
                setExpandedCards(allExpanded);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Expandir Todos
            </button>
            <button
              onClick={() => setExpandedCards({})}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Recolher Todos
            </button>
          </div>
        </div>

        {/* Row 1: General & Geographic Filters (Search, Região, UF, Cidade, Status, Regime, Matriz/Filial) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
          {/* Search */}
          <div className="col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              placeholder="Buscar razão social, CNPJ, sócio, cidade..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Região do Brasil */}
          <select
            value={filters.regiao}
            onChange={(e) => {
              const newReg = e.target.value;
              const validUfs = newReg ? (REGIOES_BRASIL[newReg] || []) : [];
              const shouldResetUf = filters.uf && newReg && !validUfs.includes(filters.uf.toUpperCase());
              onFilterChange({
                ...filters,
                regiao: newReg,
                uf: shouldResetUf ? '' : filters.uf,
                cidade: shouldResetUf ? '' : filters.cidade,
              });
            }}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 truncate"
          >
            <option value="">Região: Todas</option>
            {availableRegioes.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Estado UF */}
          <select
            value={filters.uf}
            onChange={(e) => {
              const newUf = e.target.value;
              const autoRegiao = newUf ? getRegiaoFromUf(newUf) : filters.regiao;
              onFilterChange({
                ...filters,
                uf: newUf,
                regiao: autoRegiao || filters.regiao,
                cidade: '',
              });
            }}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 truncate"
          >
            <option value="">UF: Todos</option>
            {availableUfs.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>

          {/* Cidade */}
          <select
            value={filters.cidade}
            onChange={(e) => onFilterChange({ ...filters, cidade: e.target.value })}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 truncate"
          >
            <option value="">Cidades: Todas</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Status Cadastral */}
          <select
            value={filters.situacaoCadastral}
            onChange={(e) => onFilterChange({ ...filters, situacaoCadastral: e.target.value })}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">Status: Todos</option>
            <option value="ATIVA">Ativa</option>
            <option value="BAIXADA">Baixada</option>
            <option value="SUSPENSA">Suspensa</option>
            <option value="INATIVA">Inativa</option>
          </select>

          {/* Tipo Estabelecimento */}
          <select
            value={filters.tipoEstabelecimento}
            onChange={(e) => onFilterChange({ ...filters, tipoEstabelecimento: e.target.value })}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">Tipo: Todos</option>
            <option value="MATRIZ">Matriz</option>
            <option value="FILIAL">Filial</option>
          </select>
        </div>

        {/* Row 2: 5 Níveis Oficiais de CNAE do IBGE (Concla / IBGE) */}
        <div className="pt-2 border-t border-slate-800/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Classificação CNAE IBGE (5 Níveis Oficiais)</span>
            </span>
            <button
              type="button"
              onClick={() => setIsCnaeModalOpen(true)}
              className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded font-medium transition-colors cursor-pointer"
            >
              <BookOpen className="w-3 h-3" />
              <span>Árvore Visual Completa</span>
            </button>
          </div>

          <CnaeCascadeFilter
            filters={filters}
            onFilterChange={onFilterChange}
            layout="grid"
            showClearButton={true}
          />
        </div>
      </div>

      {/* Main List Scroll Area com Paginação */}
      {(() => {
        const totalItems = suppliers.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
        const startIndex = (safeCurrentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        const paginatedSuppliers = suppliers.slice(startIndex, endIndex);

        return (
          <div ref={listContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {paginatedSuppliers.length > 0 ? (
              <>
                {paginatedSuppliers.map((supplier) => {
              const isExpanded = Boolean(expandedCards[supplier.id]);
              const isCnaesOpen = Boolean(expandedCnaes[supplier.id]);
              const isSaved = Boolean(savedRfps[supplier.id]);
              const isComparing = Boolean(selectedForComparison[supplier.id]);

              const cnaeMatch = getMatchingCnae(supplier, {
                cnaeSecao: filters.cnaeSecao,
                cnaeDivisao: filters.cnaeDivisao,
                cnaeGrupo: filters.cnaeGrupo,
                cnaeClasse: filters.cnaeClasse,
                cnaeSubclasse: filters.cnaeSubclasse,
                cnaeCodigo: filters.cnaeCodigo,
                apenasPrincipal: filters.cnaeApenasPrincipal,
              });
              const matchedSecondary = cnaeMatch && !cnaeMatch.isPrincipal ? cnaeMatch.cnae : null;

              return (
                <div
                  key={supplier.id}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all overflow-hidden shadow-xl"
                >
                {/* Header Bar do Card (Estilo exato da Imagem 1) */}
                <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900">
                  {/* Left Side: CNPJ Badge + Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* CNPJ Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-lg border border-slate-700 font-mono text-xs font-semibold text-blue-300">
                      <span>CNPJ</span>
                      <span>{supplier.formattedCnpj}</span>
                      <button
                        onClick={(e) => handleCopyCnpj(supplier.cnpj, e)}
                        title="Copiar CNPJ"
                        className="text-slate-400 hover:text-white ml-1 transition-colors cursor-pointer"
                      >
                        {copiedId === supplier.cnpj ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Badge Situação */}
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {supplier.situacaoCadastral}
                    </span>

                    {/* Badge Matriz / Filial */}
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-blue-950 text-blue-300 border border-blue-800">
                      {supplier.tipoEstabelecimento}
                    </span>

                    {/* Badge Regime Tributário */}
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium text-slate-300 border border-slate-700 bg-slate-950/60">
                      {supplier.regimeTributario}
                    </span>

                    {/* Badge Porte */}
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 border border-slate-800 bg-slate-950/40">
                      {supplier.porte}
                    </span>

                    {/* Badge Oficial RFB */}
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Oficial RFB</span>
                    </span>

                    {/* Badge Atendeu Atividade Secundária se aplicável */}
                    {matchedSecondary && (
                      <span 
                        className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-800 flex items-center gap-1"
                        title={`Filtro correspondeu à atividade secundária: [${matchedSecondary.codigo}] ${matchedSecondary.descricao}`}
                      >
                        <Tag className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Filtro CNAE Secundário: [{matchedSecondary.codigo}]</span>
                      </span>
                    )}
                  </div>

                  {/* Right Side: Titles, Location, Capital, Score & Expand Button */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 ml-auto">
                    {/* Nome & CNAE / Cidade */}
                    <div className="text-right sm:text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white truncate max-w-[220px] sm:max-w-xs">
                          {supplier.razaoSocial}
                        </span>
                        {supplier.nomeFantasia && supplier.nomeFantasia !== supplier.razaoSocial && (
                          <span className="text-xs text-blue-400 font-medium hidden md:inline truncate max-w-[140px]">
                            ({supplier.nomeFantasia})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="font-mono text-slate-500">[{supplier.cnaePrincipal.codigo}]</span>
                        <span className="truncate max-w-[160px] sm:max-w-xs">{supplier.cnaePrincipal.descricao}</span>
                        <span>·</span>
                        <span className="flex items-center text-slate-300 shrink-0">
                          <MapPin className="w-3 h-3 text-blue-400 mr-0.5" />
                          {supplier.endereco.municipio} - {supplier.endereco.uf}
                        </span>
                      </div>
                    </div>

                    {/* Capital Social */}
                    <div className="hidden lg:flex flex-col text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                        Capital Social
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {formatCurrencyBRL(supplier.capitalSocial)}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                        Score
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {supplier.analiseFinanceira.scoreGeral}/100
                      </span>
                    </div>

                    {/* Expand / Collapse Button */}
                    <button
                      onClick={() => toggleExpand(supplier)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Recolher' : 'Detalhes'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Painel Expandido com as 3 Colunas + QSA + CNAEs + Ações (Exatamente da Imagem 1) */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                    {/* 3 Colunas Principais: Endereço Sede, Contatos Fiscais, Compliance & Certidões */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Coluna 1: LOCALIZAÇÃO OFICIAL */}
                      <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span>Localização Oficial</span>
                        </div>
                        <p className="text-white font-medium text-sm">
                          {supplier.endereco.municipio} - {supplier.endereco.uf}
                        </p>
                        <p className="text-slate-400 font-mono">
                          CEP: <span className="text-slate-200">{supplier.endereco.cep || 'Não informado'}</span>
                        </p>
                      </div>

                      {/* Coluna 2: CONTATOS FISCAIS OFICIAIS (RFB) */}
                      <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <Phone className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Contatos Fiscais Oficiais (RFB)</span>
                        </div>
                        <p className="text-slate-300">
                          Telefone: <strong className="text-blue-400 font-mono">{formatPhoneNumber(supplier.contato.telefonePrincipal)}</strong>
                        </p>
                        <p className="text-slate-400">
                          E-mail: {supplier.contato.email ? (
                            <span className="text-slate-200 font-mono">{supplier.contato.email}</span>
                          ) : (
                            <span className="text-slate-400"></span>
                          )}
                        </p>
                        <p className="text-slate-400 truncate">
                          Natureza: <span className="text-slate-300">{supplier.naturezaJuridica}</span>
                        </p>
                        <p className="text-slate-400">
                          Regime: <strong className="text-blue-300 font-medium">{supplier.regimeTributario}</strong>
                          {supplier.simplesNacional?.optante && (
                            <span className="ml-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                              Simples Nacional
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Coluna 3: COMPLIANCE & CERTIDÕES */}
                      <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Compliance & Certidões</span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-400 font-normal">
                            Score {supplier.analiseFinanceira.scoreGeral}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>CND Federal / PGFN:</span>
                          <span className={`font-semibold ${supplier.analiseFinanceira.regularidadeFiscal.cndFederal ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {supplier.analiseFinanceira.regularidadeFiscal.cndFederal ? 'Regular' : 'Pendente'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>CRF Caixa FGTS:</span>
                          <span className={`font-semibold ${supplier.analiseFinanceira.regularidadeFiscal.fgts ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {supplier.analiseFinanceira.regularidadeFiscal.fgts ? 'Regular' : 'Irregular'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>CNDT Trabalhista:</span>
                          <span className={`font-semibold ${supplier.analiseFinanceira.regularidadeFiscal.cndtTrabalhista ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {supplier.analiseFinanceira.regularidadeFiscal.cndtTrabalhista ? 'Regular' : 'Apontamento'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Dívida Ativa União:</span>
                          <span className="font-semibold text-cyan-400 font-mono">
                            {supplier.analiseFinanceira.regularidadeFiscal.dividaAtivaPgfn}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>CEIS / Sanções CGU:</span>
                          <span className="font-semibold text-emerald-400 font-mono text-[11px]">
                            {supplier.analiseFinanceira.regularidadeFiscal.ceisSanction || 'Nada Consta'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 pt-0.5 border-t border-slate-800">
                          <span>Risco de Insolvência:</span>
                          <span className="text-emerald-400 font-semibold font-mono text-[11px]">
                            {supplier.analiseFinanceira.regularidadeFiscal.riscoInsolvencia || 'BAIXO'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* QUADRO DE SÓCIOS E ADMINISTRADORES REGISTRADOS NA RECEITA */}
                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>Quadro de Sócios e Administradores Registrados na Receita ({supplier.qsa.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {supplier.qsa.map((socio, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center gap-1.5"
                          >
                            <span className="font-bold text-white">{socio.nome}</span>
                            <span className="text-blue-400 font-medium">({socio.qualificacao})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Atividades Econômicas Secundárias (Accordion expansível) */}
                    <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                      <button
                        onClick={() => toggleCnaes(supplier.id)}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>
                          {supplier.cnaesSecundarios.length} Atividade(s) Econômica(s) Secundária(s) Cadastrada(s)
                        </span>
                        {isCnaesOpen ? (
                          <ChevronUp className="w-4 h-4 text-blue-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-blue-400" />
                        )}
                      </button>

                      {isCnaesOpen && (
                        <div className="p-3 border-t border-slate-800/80 space-y-1.5 bg-slate-950/60 max-h-48 overflow-y-auto">
                          {supplier.cnaesSecundarios.map((c, i) => (
                            <div key={i} className="text-xs flex items-start gap-2 text-slate-300 p-1.5 rounded bg-slate-900/60">
                              <span className="font-mono text-amber-400 shrink-0 font-medium">
                                [{c.codigo}]
                              </span>
                              <span>{c.descricao}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Cruzamento de Dados por CNPJ Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] font-semibold">Cruzamento de Dados por CNPJ:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-950 border border-slate-800 text-slate-300">
                          RFB Cadastral & QSA
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-950 border border-slate-800 text-blue-300">
                          IBGE Georreferenciado
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-950 border border-slate-800 text-emerald-300">
                          Concla CNAE 5 Níveis
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-950 border border-slate-800 text-cyan-300">
                          PGFN CND & Dívida Ativa
                        </span>
                      </div>
                    </div>

                    {/* Barra de Ações (Rodapé do Card, igual Imagem 1) */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                      {/* Left Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSwitchToMapWithSupplier(supplier)}
                          className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span>Ver no Mapa</span>
                        </button>

                        <button
                          onClick={(e) => toggleCompare(supplier.id, e)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer ${
                            isComparing 
                              ? 'bg-blue-600/30 text-blue-300 border-blue-500' 
                              : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isComparing ? 'Comparando' : 'Comparar'}</span>
                        </button>

                        <button
                          onClick={(e) => toggleSaveRfp(supplier.id, e)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer ${
                            isSaved 
                              ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500' 
                              : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isSaved ? 'Salvo em RFP' : 'Salvar RFP'}</span>
                        </button>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(supplier, null, 2));
                            const anchor = document.createElement('a');
                            anchor.href = dataStr;
                            anchor.download = `enriquecimento_${supplier.cnpj}.json`;
                            anchor.click();
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                        >
                          <span>&gt;_ Enriquecer Oficial (JSON)</span>
                        </button>

                        <button
                          onClick={() => onOpenDetails(supplier)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Dossiê Completo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

            {/* Barra de Paginação da Lista Corporativa */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl text-xs mt-4">
              <div className="flex flex-wrap items-center gap-3 text-slate-400">
                <span>
                  Exibindo <strong className="text-white font-mono">{startIndex + 1}</strong> a <strong className="text-white font-mono">{endIndex}</strong> de <strong className="text-white font-mono">{totalItems}</strong> empresas
                </span>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5">
                  <span>Itens por página:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value={5}>5 por página</option>
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                    <option value={50}>50 por página</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={safeCurrentPage === 1}
                    title="Primeira Página"
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage === 1}
                    title="Página Anterior"
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 2)
                      .reduce<(number | string)[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                          acc.push('...');
                        }
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) => typeof p === 'string' ? (
                        <span key={`dots-${idx}`} className="px-2 text-slate-600 font-mono">...</span>
                      ) : (
                        <button
                          key={`page-${p}`}
                          onClick={() => handlePageChange(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                            safeCurrentPage === p
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage === totalPages}
                    title="Próxima Página"
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={safeCurrentPage === totalPages}
                    title="Última Página"
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4 max-w-lg mx-auto mt-8">
            <Building className="w-14 h-14 text-slate-600 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {suppliers.length === 0 ? 'Nenhuma empresa cadastrada no momento' : 'Nenhum fornecedor encontrado'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {suppliers.length === 0
                  ? 'Consulte um CNPJ individual ou realize uma importação em lote para carregar dados oficiais da Receita Federal.'
                  : 'Nenhuma empresa corresponde aos filtros selecionados. Tente limpar os filtros para visualizar a lista.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {suppliers.length === 0 && onOpenBulkModal && (
                <button
                  onClick={onOpenBulkModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Carregar Lista de CNPJs</span>
                </button>
              )}

              {suppliers.length === 0 && onResetToDemo && (
                <button
                  onClick={onResetToDemo}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>Carregar Base Modelo (Demonstração)</span>
                </button>
              )}

              {suppliers.length > 0 && (
                <button
                  onClick={() => onFilterChange({
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
                  })}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  Redefinir Filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  })()}

  {/* Modal de Catálogo Completo CNAE / Árvore Concla IBGE */}
  <CnaeCatalogModal
    isOpen={isCnaeModalOpen}
    onClose={() => setIsCnaeModalOpen(false)}
    filters={filters}
    onFilterChange={onFilterChange}
    allSuppliers={suppliersSource}
  />
</div>
  );
};
