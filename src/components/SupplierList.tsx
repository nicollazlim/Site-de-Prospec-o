import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Plus, 
  X, 
  RotateCcw, 
  ChevronDown,
  Building,
  AlertCircle,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react';
import { SortOption, Supplier, SupplierFilters } from '../types/supplier';
import { SupplierCard } from './SupplierCard';
import { cleanCnpj, formatCnpj, isValidCnpj } from '../services/cnpjValidator';
import { 
  CNAE_SECTIONS, 
  getDivisionsForSection,
  getGroupsForDivision,
  getClassesForGroup,
  getSubclassesForClass
} from '../services/cnaeService';
import { 
  REGIOES_BRASIL, 
  LISTA_REGIOES, 
  getRegiaoFromUf 
} from '../services/geoCoordinates';
import { CnaeCatalogModal } from './CnaeCatalogModal';
import { CnaeCascadeFilter } from './CnaeCascadeFilter';

interface SupplierListProps {
  suppliers: Supplier[];
  allSuppliers?: Supplier[];
  selectedSupplier: Supplier | null;
  filters: SupplierFilters;
  onFilterChange: (newFilters: SupplierFilters) => void;
  onSelectSupplier: (supplier: Supplier) => void;
  onOpenDetails: (supplier: Supplier) => void;
  onFocusOnMap: (supplier: Supplier) => void;
  onQuickAddCnpj: (cnpj: string) => Promise<void>;
  onOpenBulkModal?: () => void;
  isLoadingSingle: boolean;
}

export const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  allSuppliers = [],
  selectedSupplier,
  filters,
  onFilterChange,
  onSelectSupplier,
  onOpenDetails,
  onFocusOnMap,
  onQuickAddCnpj,
  onOpenBulkModal,
  isLoadingSingle,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [quickError, setQuickError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(30);
  const [isCnaeModalOpen, setIsCnaeModalOpen] = useState(false);

  const suppliersSource = allSuppliers.length > 0 ? allSuppliers : suppliers;

  // Reseta limite quando os filtros mudam
  React.useEffect(() => {
    setDisplayLimit(30);
  }, [filters, suppliers.length]);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = cleanCnpj(quickInput);
    if (digits.length !== 14) {
      setQuickError('O CNPJ deve conter exatamente 14 dígitos numéricos.');
      return;
    }
    if (!isValidCnpj(digits)) {
      setQuickError('Dígito verificador inválido para este CNPJ.');
      return;
    }

    setQuickError(null);
    try {
      await onQuickAddCnpj(digits);
      setQuickInput('');
    } catch (err) {
      setQuickError(err instanceof Error ? err.message : 'Erro ao consultar CNPJ');
    }
  };

  const handleResetFilters = () => {
    onFilterChange({
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
  };

  // Opções Geográficas calculadas da base de fornecedores
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

  // Opções CNAE multi-nível IBGE calculadas da base master para garantir consistência
  const availableGroups = useMemo(() => {
    return getGroupsForDivision(filters.cnaeDivisao, filters.cnaeSecao, suppliersSource);
  }, [filters.cnaeDivisao, filters.cnaeSecao, suppliersSource]);

  const availableClasses = useMemo(() => {
    return getClassesForGroup(filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao, suppliersSource);
  }, [filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao, suppliersSource]);

  const availableSubclasses = useMemo(() => {
    return getSubclassesForClass(filters.cnaeClasse, filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao, suppliersSource);
  }, [filters.cnaeClasse, filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao, suppliersSource]);

  const hasActiveFilters = Boolean(
    filters.searchQuery || 
    filters.regiao || 
    filters.uf || 
    filters.cidade || 
    filters.situacaoCadastral || 
    filters.nivelRisco || 
    filters.porte ||
    filters.regimeTributario ||
    filters.tipoEstabelecimento ||
    filters.cnaeSecao ||
    filters.cnaeDivisao ||
    filters.cnaeGrupo ||
    filters.cnaeClasse ||
    filters.cnaeSubclasse ||
    filters.cnaeCodigo
  );

  return (
    <aside className="w-full lg:w-[460px] xl:w-[490px] h-full flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 overflow-hidden">
      {/* Search & Quick Action Header with Dedicated Scrollbar */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/95 space-y-2.5 shrink-0 max-h-[85vh] overflow-y-auto cnae-scrollbar">
        {/* Global Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Buscar por Razão, CNPJ, Sócio, Telefone, Cidade..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors font-medium"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Add CNPJ Form */}
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => {
                setQuickInput(e.target.value);
                if (quickError) setQuickError(null);
              }}
              placeholder="Consultar CNPJ único (ex: 00.000.000/0001-00)"
              className="w-full px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoadingSingle || !quickInput}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isLoadingSingle ? 'Buscando...' : 'Adicionar'}</span>
          </button>
        </form>

        {quickError && (
          <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{quickError}</span>
          </div>
        )}

        {/* Geographic & Fast Filters (Região, Estado, Cidade) */}
        <div className="space-y-1.5 pt-1">
          {/* Row 1: Região, Estado (UF), Cidade */}
          <div className="grid grid-cols-3 gap-1.5">
            {/* Região */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Região</label>
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
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 truncate"
              >
                <option value="">Região: Todas</option>
                {availableRegioes.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* UF */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Estado (UF)</label>
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
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 truncate"
              >
                <option value="">UF: Todos</option>
                {availableUfs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Cidade</label>
              <select
                value={filters.cidade}
                onChange={(e) => onFilterChange({ ...filters, cidade: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 truncate"
              >
                <option value="">Cidades: Todas</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Status, Ordenação, Toggle Avançado */}
          <div className="flex items-center justify-between gap-1.5">
            {/* Quick Status Filter */}
            <select
              value={filters.situacaoCadastral}
              onChange={(e) => onFilterChange({ ...filters, situacaoCadastral: e.target.value })}
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">Status: Todos</option>
              <option value="ATIVA">Ativa</option>
              <option value="BAIXADA">Baixada</option>
              <option value="SUSPENSA">Suspensa</option>
              <option value="INATIVA">Inativa</option>
            </select>

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as SortOption })}
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="score_desc">Maior Score</option>
              <option value="capital_desc">Maior Capital</option>
              <option value="tempo_desc">Maturidade</option>
              <option value="proximidade">Proximidade (KM)</option>
              <option value="nome_asc">Nome (A-Z)</option>
            </select>

            {/* Toggle Advanced */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              title="Mais filtros (CNAE 5 níveis, Risco, Porte, Tributário)"
              className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer shrink-0 text-xs ${
                showAdvancedFilters || filters.nivelRisco || filters.porte || filters.cnaeSecao || filters.cnaeDivisao
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold' 
                  : 'bg-slate-950 border-slate-700/80 text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        {showAdvancedFilters && (
          <div className="pt-2.5 border-t border-slate-800/80 space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Nível de Risco</label>
                <select
                  value={filters.nivelRisco}
                  onChange={(e) => onFilterChange({ ...filters, nivelRisco: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                >
                  <option value="">Todos os Riscos</option>
                  <option value="BAIXO">Baixo Risco (Verde)</option>
                  <option value="MEDIO">Médio Risco (Âmbar)</option>
                  <option value="ALTO">Alto Risco (Vermelho)</option>
                  <option value="CRITICO">Risco Crítico (Roxo)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Porte Corporativo</label>
                <select
                  value={filters.porte}
                  onChange={(e) => onFilterChange({ ...filters, porte: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                >
                  <option value="">Todos Portes</option>
                  <option value="DEMAIS">Médio / Grande Porte</option>
                  <option value="EPP">EPP (Pequeno Porte)</option>
                  <option value="ME">ME (Microempresa)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Regime Tributário</label>
                <select
                  value={filters.regimeTributario}
                  onChange={(e) => onFilterChange({ ...filters, regimeTributario: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                >
                  <option value="">Regime: Todos</option>
                  <option value="Lucro Real">Lucro Real</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Simples Nacional">Simples Nacional</option>
                  <option value="MEI">MEI</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Estabelecimento</label>
                <select
                  value={filters.tipoEstabelecimento}
                  onChange={(e) => onFilterChange({ ...filters, tipoEstabelecimento: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                >
                  <option value="">Tipo: Todos</option>
                  <option value="MATRIZ">Matriz</option>
                  <option value="FILIAL">Filial</option>
                </select>
              </div>
            </div>

            {/* CNAE Multi-nível Concla / IBGE (5 Níveis - Idêntico às Imagens de Referência) */}
            <div className="pt-2.5 border-t border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Filtro CNAE IBGE (5 Níveis Oficiais)
                </span>
                <button
                  type="button"
                  onClick={() => setIsCnaeModalOpen(true)}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded font-medium transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Árvore Visual</span>
                </button>
              </div>

              {/* Componente fiel aos 5 dropdowns da imagem */}
              <CnaeCascadeFilter
                filters={filters}
                onFilterChange={onFilterChange}
                layout="vertical"
                showClearButton={true}
              />
            </div>
          </div>
        )}
      </div>

      {/* Subheader: Filter Summary & Bulk Import Quick Action */}
      <div className="px-3.5 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 font-mono">
            {suppliers.length}
          </span>
          <span>{suppliers.length === 1 ? 'fornecedor' : 'fornecedores'}</span>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar</span>
            </button>
          )}

          {onOpenBulkModal && (
            <button
              onClick={onOpenBulkModal}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
              title="Carregar base de CNPJs em CSV, link local ou lotes pré-configurados"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Base CSV / Link Local</span>
            </button>
          )}
        </div>
      </div>

      {/* Suppliers Cards Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {suppliers.length > 0 ? (
          <>
            {suppliers.slice(0, displayLimit).map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                isSelected={selectedSupplier?.id === supplier.id}
                onSelect={onSelectSupplier}
                onOpenDetails={onOpenDetails}
                onFocusOnMap={onFocusOnMap}
                activeFilters={filters}
              />
            ))}

            {suppliers.length > displayLimit && (
              <button
                onClick={() => setDisplayLimit(prev => prev + 30)}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Carregar Mais Fornecedores (+{Math.min(30, suppliers.length - displayLimit)})
              </button>
            )}
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-xl border border-slate-800/80">
            <Building className="w-10 h-10 text-slate-600 mb-2" />
            <h4 className="text-sm font-semibold text-slate-300 mb-1">
              {hasActiveFilters ? 'Nenhum fornecedor encontrado' : 'Nenhuma empresa cadastrada'}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              {hasActiveFilters
                ? 'Nenhum resultado corresponde aos filtros aplicados. Tente alterar os critérios de busca.'
                : 'Consulte um CNPJ no campo acima ou utilize o botão Carga Massiva para importar uma planilha de CNPJs.'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors cursor-pointer"
              >
                Redefinir Filtros
              </button>
            ) : (
              onOpenBulkModal && (
                <button
                  onClick={onOpenBulkModal}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                >
                  + Carregar Lista de CNPJs
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Modal de Catálogo Completo CNAE / Árvore Concla IBGE */}
      <CnaeCatalogModal
        isOpen={isCnaeModalOpen}
        onClose={() => setIsCnaeModalOpen(false)}
        filters={filters}
        onFilterChange={onFilterChange}
        allSuppliers={suppliersSource}
      />
    </aside>
  );
};
