import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X, RotateCcw } from 'lucide-react';
import { SupplierFilters } from '../types/supplier';
import { 
  getConclaSections, 
  getConclaDivisions, 
  getConclaGroups, 
  getConclaClasses, 
  getConclaSubclasses,
  formatCnaeCode,
  cleanCnaeDigits,
  getSectionFromDivision,
  ConclaItem 
} from '../services/cnaeService';

interface CnaeCascadeFilterProps {
  filters: SupplierFilters;
  onFilterChange: (newFilters: SupplierFilters) => void;
  className?: string;
  showClearButton?: boolean;
  layout?: 'vertical' | 'grid';
}

interface CustomSelectProps {
  label: string;
  placeholderWhenDisabled: string;
  allOptionLabel: string;
  selectedValue: string;
  disabled: boolean;
  options: ConclaItem[];
  onSelect: (value: string) => void;
  isVerticalLayout?: boolean;
}

const CustomDropdownField: React.FC<CustomSelectProps> = ({
  label,
  placeholderWhenDisabled,
  allOptionLabel,
  selectedValue,
  disabled,
  options,
  onSelect,
  isVerticalLayout = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<'down' | 'up'>('down');
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Determina se abre para cima ou para baixo com base no espaço da tela
  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 270 && rect.top > 260) {
        setOpenDirection('up');
      } else {
        setOpenDirection('down');
      }
    }
    setIsOpen(!isOpen);
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reseta busca quando abre ou fecha
  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  // Item atualmente selecionado
  const selectedItem = useMemo(() => {
    if (!selectedValue) return null;
    return options.find(o => o.id === selectedValue);
  }, [selectedValue, options]);

  // Texto exibido no botão
  const displayText = useMemo(() => {
    if (disabled) return placeholderWhenDisabled;
    if (!selectedValue) return allOptionLabel;
    if (selectedItem) {
      const formattedCode = selectedItem.id.length > 2 ? formatCnaeCode(selectedItem.id) : selectedItem.id;
      return `${formattedCode} - ${selectedItem.descricao}`;
    }
    return selectedValue.length > 2 ? formatCnaeCode(selectedValue) : selectedValue;
  }, [disabled, selectedValue, selectedItem, placeholderWhenDisabled, allOptionLabel]);

  // Filtragem interna para facilitar a escolha rápida
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase().trim();
    const cleanQ = cleanCnaeDigits(q);
    return options.filter(o => 
      o.id.toLowerCase().includes(q) || 
      (cleanQ && cleanCnaeDigits(o.id).includes(cleanQ)) ||
      o.descricao.toLowerCase().includes(q)
    );
  }, [options, searchTerm]);

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Label em ALL CAPS exatamente como na imagem */}
      <label className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase block mb-1">
        {label}
      </label>

      {/* Caixa do Select */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full h-9 px-3 flex items-center justify-between text-left rounded-lg text-xs font-medium transition-all ${
          disabled
            ? 'bg-[#080d1a]/60 border border-slate-800 text-slate-500 cursor-not-allowed'
            : isOpen || selectedValue
            ? 'bg-[#080e1c] border-2 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/30'
            : 'bg-[#080e1c] border border-slate-700/90 hover:border-blue-600 text-slate-200'
        }`}
      >
        <span className="truncate pr-2">{displayText}</span>
        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {selectedValue && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelect('');
              }}
              className="p-0.5 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Limpar seleção"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown 
            className={`w-4 h-4 shrink-0 transition-transform ${
              disabled ? 'text-slate-600' : 'text-slate-300'
            } ${isOpen ? 'rotate-180 text-blue-400' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown Menu (No layout vertical ele se expande fluidamente sem risco de corte por overflow; no horizontal usa popover flutuante) */}
      {isOpen && !disabled && (
        <div 
          className={`${
            isVerticalLayout
              ? 'mt-1.5 w-full bg-[#070c18] border-2 border-blue-500 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in duration-100 z-30'
              : `absolute left-0 right-0 z-[120] bg-[#070c18] border-2 border-blue-500 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in duration-100 ${
                  openDirection === 'up' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                }`
          }`}
          style={{ minWidth: '100%' }}
        >
          {/* Campo de busca se houver mais de 5 itens */}
          {options.length > 5 && (
            <div className="p-1.5 border-b border-slate-800 bg-[#060a14]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrar por código ou descrição..."
                  className="w-full bg-[#0b1224] border border-slate-700 rounded px-2.5 pl-8 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Lista de Opções Rolável com Scrollbar Visível e Isolamento de Rolagem */}
          <div 
            className="max-h-56 overflow-y-scroll cnae-scrollbar divide-y divide-slate-800/40 py-1"
            style={{
              overscrollBehavior: 'contain',
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 #070c18'
            }}
            onWheel={(e) => {
              // Garante que o scroll do mouse ou trackpad role a lista sem travar ou mover o painel pai
              e.stopPropagation();
            }}
          >
            {/* Primeira opção: "Todos..." */}
            <div
              onClick={() => {
                onSelect('');
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                !selectedValue
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-[#15233e] hover:text-white'
              }`}
            >
              {allOptionLabel}
            </div>

            {/* Itens carregados */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selectedValue === opt.id;
                const formattedId = opt.id.length > 2 ? formatCnaeCode(opt.id) : opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onSelect(opt.id);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 text-xs cursor-pointer transition-colors leading-relaxed ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-200 hover:bg-[#15233e] hover:text-white'
                    }`}
                  >
                    <span className="font-mono font-medium text-blue-400 mr-1.5">
                      {formattedId}
                    </span>
                    <span>- {opt.descricao}</span>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-3 text-[11px] text-slate-500 text-center">
                Nenhum item correspondente
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const CnaeCascadeFilter: React.FC<CnaeCascadeFilterProps> = ({
  filters,
  onFilterChange,
  className = '',
  showClearButton = true,
  layout = 'vertical',
}) => {
  // 1. Seções Oficiais IBGE Concla
  const sections = useMemo(() => {
    return getConclaSections();
  }, []);

  // 2. Divisões da Seção Selecionada
  const divisions = useMemo(() => {
    return getConclaDivisions(filters.cnaeSecao);
  }, [filters.cnaeSecao]);

  // 3. Grupos da Divisão Selecionada
  const groups = useMemo(() => {
    return getConclaGroups(filters.cnaeDivisao, filters.cnaeSecao);
  }, [filters.cnaeDivisao, filters.cnaeSecao]);

  // 4. Classes do Grupo Selecionado
  const classes = useMemo(() => {
    return getConclaClasses(filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao);
  }, [filters.cnaeGrupo, filters.cnaeDivisao, filters.cnaeSecao]);

  // 5. Subclasses da Classe Selecionada
  const subclasses = useMemo(() => {
    return getConclaSubclasses(filters.cnaeClasse, filters.cnaeGrupo, filters.cnaeDivisao);
  }, [filters.cnaeClasse, filters.cnaeGrupo, filters.cnaeDivisao]);

  // Handlers para cascata conforme regras oficiais IBGE Concla
  const handleSectionChange = (secaoId: string) => {
    onFilterChange({
      ...filters,
      cnaeSecao: secaoId,
      cnaeDivisao: '',
      cnaeGrupo: '',
      cnaeClasse: '',
      cnaeSubclasse: '',
    });
  };

  const handleDivisionChange = (divisaoId: string) => {
    if (!divisaoId) {
      onFilterChange({
        ...filters,
        cnaeDivisao: '',
        cnaeGrupo: '',
        cnaeClasse: '',
        cnaeSubclasse: '',
      });
      return;
    }
    const divNum = parseInt(divisaoId, 10);
    const sec = getSectionFromDivision(divNum);
    onFilterChange({
      ...filters,
      cnaeSecao: sec ? sec.letra : filters.cnaeSecao,
      cnaeDivisao: divisaoId,
      cnaeGrupo: '',
      cnaeClasse: '',
      cnaeSubclasse: '',
    });
  };

  const handleGroupChange = (grupoId: string) => {
    if (!grupoId) {
      onFilterChange({
        ...filters,
        cnaeGrupo: '',
        cnaeClasse: '',
        cnaeSubclasse: '',
      });
      return;
    }
    const cleanDigits = cleanCnaeDigits(grupoId);
    const divId = cleanDigits.slice(0, 2);
    const divNum = parseInt(divId, 10);
    const sec = getSectionFromDivision(divNum);
    onFilterChange({
      ...filters,
      cnaeSecao: sec ? sec.letra : filters.cnaeSecao,
      cnaeDivisao: divId || filters.cnaeDivisao,
      cnaeGrupo: grupoId,
      cnaeClasse: '',
      cnaeSubclasse: '',
    });
  };

  const handleClassChange = (classeId: string) => {
    if (!classeId) {
      onFilterChange({
        ...filters,
        cnaeClasse: '',
        cnaeSubclasse: '',
      });
      return;
    }
    const cleanDigits = cleanCnaeDigits(classeId);
    const grpId = cleanDigits.slice(0, 3);
    const divId = cleanDigits.slice(0, 2);
    const divNum = parseInt(divId, 10);
    const sec = getSectionFromDivision(divNum);
    onFilterChange({
      ...filters,
      cnaeSecao: sec ? sec.letra : filters.cnaeSecao,
      cnaeDivisao: divId || filters.cnaeDivisao,
      cnaeGrupo: grpId || filters.cnaeGrupo,
      cnaeClasse: classeId,
      cnaeSubclasse: '',
    });
  };

  const handleSubclassChange = (subclasseId: string) => {
    if (!subclasseId) {
      onFilterChange({
        ...filters,
        cnaeSubclasse: '',
      });
      return;
    }
    const cleanDigits = cleanCnaeDigits(subclasseId);
    const clsId = cleanDigits.slice(0, 5);
    const grpId = cleanDigits.slice(0, 3);
    const divId = cleanDigits.slice(0, 2);
    const divNum = parseInt(divId, 10);
    const sec = getSectionFromDivision(divNum);
    onFilterChange({
      ...filters,
      cnaeSecao: sec ? sec.letra : filters.cnaeSecao,
      cnaeDivisao: divId || filters.cnaeDivisao,
      cnaeGrupo: grpId || filters.cnaeGrupo,
      cnaeClasse: clsId || filters.cnaeClasse,
      cnaeSubclasse: subclasseId,
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      ...filters,
      cnaeSecao: '',
      cnaeDivisao: '',
      cnaeGrupo: '',
      cnaeClasse: '',
      cnaeSubclasse: '',
      cnaeCodigo: '',
    });
  };

  const hasAnySelection = Boolean(
    filters.cnaeSecao || 
    filters.cnaeDivisao || 
    filters.cnaeGrupo || 
    filters.cnaeClasse || 
    filters.cnaeSubclasse
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barra de Controle: Modo Apenas Principal (Core Business) + Botão de Limpar */}
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
        <label 
          className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-300 hover:text-white transition-colors"
          title="Se marcado, filtra apenas empresas onde a atividade selecionada é o Core Business (CNAE Principal). Se desmarcado, aceita também atividades secundárias do CNPJ."
        >
          <input
            type="checkbox"
            checked={Boolean(filters.cnaeApenasPrincipal)}
            onChange={(e) => onFilterChange({ ...filters, cnaeApenasPrincipal: e.target.checked })}
            className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span className="font-semibold text-slate-200">
            Apenas Atividade Principal (Core Business)
          </span>
        </label>

        {showClearButton && hasAnySelection && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-white transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar CNAE</span>
          </button>
        )}
      </div>

      {/* Container com os 5 campos (Empilhado verticalmente ou Grade de 5 colunas) */}
      <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5' : 'space-y-3'}>
        {/* 1. SEÇÃO */}
        <CustomDropdownField
          label="SEÇÃO"
          placeholderWhenDisabled="Todos os Setores (A a U)"
          allOptionLabel="Todos os Setores (A a U)"
          selectedValue={filters.cnaeSecao || ''}
          disabled={false}
          options={sections}
          onSelect={handleSectionChange}
          isVerticalLayout={layout === 'vertical'}
        />

        {/* 2. DIVISÃO */}
        <CustomDropdownField
          label="DIVISÃO"
          placeholderWhenDisabled="Selecione a Seção"
          allOptionLabel="Todas as Divisões"
          selectedValue={filters.cnaeDivisao || ''}
          disabled={!filters.cnaeSecao}
          options={divisions}
          onSelect={handleDivisionChange}
          isVerticalLayout={layout === 'vertical'}
        />

        {/* 3. GRUPO */}
        <CustomDropdownField
          label="GRUPO"
          placeholderWhenDisabled="Selecione a Divisão"
          allOptionLabel="Todos os Grupos"
          selectedValue={filters.cnaeGrupo || ''}
          disabled={!filters.cnaeDivisao}
          options={groups}
          onSelect={handleGroupChange}
          isVerticalLayout={layout === 'vertical'}
        />

        {/* 4. CLASSE */}
        <CustomDropdownField
          label="CLASSE"
          placeholderWhenDisabled="Selecione o Grupo"
          allOptionLabel="Todas as Classes"
          selectedValue={filters.cnaeClasse || ''}
          disabled={!filters.cnaeGrupo}
          options={classes}
          onSelect={handleClassChange}
          isVerticalLayout={layout === 'vertical'}
        />

        {/* 5. SUBCLASSE */}
        <CustomDropdownField
          label="SUBCLASSE"
          placeholderWhenDisabled="Selecione a Classe"
          allOptionLabel="Todas as Subclasses"
          selectedValue={filters.cnaeSubclasse || ''}
          disabled={!filters.cnaeClasse}
          options={subclasses}
          onSelect={handleSubclassChange}
          isVerticalLayout={layout === 'vertical'}
        />
      </div>
    </div>
  );
};
