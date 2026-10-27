import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Filter, 
  Layers, 
  Building2, 
  Sparkles, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { 
  CNAE_SECTIONS,
  getDivisionsForSection,
  getGroupsForDivision,
  getClassesForGroup,
  getSubclassesForClass,
  cleanCnaeDigits,
  CnaeSectionInfo
} from '../services/cnaeService';
import cnaeConclaData from '../data/cnaeConcla.json';
import { Supplier, SupplierFilters } from '../types/supplier';

interface CnaeCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SupplierFilters;
  onFilterChange: (filters: SupplierFilters) => void;
  allSuppliers?: Supplier[];
}

export const CnaeCatalogModal: React.FC<CnaeCatalogModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  allSuppliers = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'presets'>('hierarchy');

  // Seleções locais na árvore para navegação profunda
  const [navSection, setNavSection] = useState<string>(filters.cnaeSecao || 'C');
  const [navDivision, setNavDivision] = useState<string>(filters.cnaeDivisao || '');
  const [navGroup, setNavGroup] = useState<string>(filters.cnaeGrupo || '');
  const [navClass, setNavClass] = useState<string>(filters.cnaeClasse || '');

  // Atualiza estados locais se filtros mudarem externamente
  React.useEffect(() => {
    if (filters.cnaeSecao) setNavSection(filters.cnaeSecao);
    if (filters.cnaeDivisao) setNavDivision(filters.cnaeDivisao);
    if (filters.cnaeGrupo) setNavGroup(filters.cnaeGrupo);
    if (filters.cnaeClasse) setNavClass(filters.cnaeClasse);
  }, [filters, isOpen]);

  // Seções
  const sections = CNAE_SECTIONS;

  // Divisões da seção selecionada
  const divisions = useMemo(() => {
    return getDivisionsForSection(navSection);
  }, [navSection]);

  // Grupos da divisão selecionada
  const groups = useMemo(() => {
    return getGroupsForDivision(navDivision, navSection, allSuppliers);
  }, [navDivision, navSection, allSuppliers]);

  // Classes do grupo selecionado
  const classes = useMemo(() => {
    return getClassesForGroup(navGroup, navDivision, navSection, allSuppliers);
  }, [navGroup, navDivision, navSection, allSuppliers]);

  // Subclasses da classe selecionada
  const subclasses = useMemo(() => {
    return getSubclassesForClass(navClass, navGroup, navDivision, navSection, allSuppliers);
  }, [navClass, navGroup, navDivision, navSection, allSuppliers]);

  // Busca rápida transversal por texto ou código
  const searchResults = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q || q.length < 2) return null;

    const results: Array<{
      nivel: 'Seção' | 'Divisão' | 'Grupo' | 'Classe' | 'Subclasse';
      codigo: string;
      nome: string;
      secao: string;
      divisao?: string;
      grupo?: string;
      classe?: string;
      subclasse?: string;
      supplierCount?: number;
    }> = [];

    // Busca nas Seções
    sections.forEach((s: CnaeSectionInfo) => {
      if (s.nome.toLowerCase().includes(q) || s.letra.toLowerCase() === q) {
        results.push({
          nivel: 'Seção',
          codigo: s.letra,
          nome: s.nome,
          secao: s.letra,
        });
      }
    });

    // Busca nas Divisões
    divisions.forEach((d: { codigo: string; nome: string }) => {
      if (d.nome.toLowerCase().includes(q) || d.codigo.includes(q)) {
        results.push({
          nivel: 'Divisão',
          codigo: d.codigo,
          nome: d.nome,
          secao: navSection,
          divisao: d.codigo,
        });
      }
    });

    // Busca nos Grupos
    groups.forEach((g: { codigo: string; nome: string; divisao: string; supplierCount?: number }) => {
      if (g.nome.toLowerCase().includes(q) || g.codigo.includes(q)) {
        results.push({
          nivel: 'Grupo',
          codigo: g.codigo,
          nome: g.nome,
          secao: navSection,
          divisao: g.divisao,
          grupo: g.codigo,
          supplierCount: g.supplierCount,
        });
      }
    });

    // Busca nas Classes
    classes.forEach((c: { codigo: string; nome: string; grupo: string; supplierCount?: number }) => {
      if (c.nome.toLowerCase().includes(q) || c.codigo.includes(q) || cleanCnaeDigits(c.codigo).includes(cleanCnaeDigits(q))) {
        results.push({
          nivel: 'Classe',
          codigo: c.codigo,
          nome: c.nome,
          secao: navSection,
          divisao: navDivision,
          grupo: c.grupo,
          classe: c.codigo,
          supplierCount: c.supplierCount,
        });
      }
    });

    // Busca nas Subclasses
    subclasses.forEach((sub: { codigo: string; nome: string; classe: string; supplierCount?: number }) => {
      if (sub.nome.toLowerCase().includes(q) || sub.codigo.includes(q) || cleanCnaeDigits(sub.codigo).includes(cleanCnaeDigits(q))) {
        results.push({
          nivel: 'Subclasse',
          codigo: sub.codigo,
          nome: sub.nome,
          secao: navSection,
          divisao: navDivision,
          grupo: navGroup,
          classe: sub.classe,
          subclasse: sub.codigo,
          supplierCount: sub.supplierCount,
        });
      }
    });

    return results.slice(0, 50);
  }, [searchTerm, sections, divisions, groups, classes, subclasses, navSection, navDivision, navGroup]);

  // Presets rápidos corporativos para compradores
  const PRESET_CATEGORIES = [
    {
      title: 'Usinagem, Torneamento & Caldeiraria Pesada',
      badge: 'Divisão 25',
      desc: 'Peças sob medida, corte laser, usinagem CNC, soldas especiais e caldeiraria',
      secao: 'C',
      divisao: '25',
      grupo: '25.3',
      classe: '25.39-0',
      subclasse: '25.39-0/01',
    },
    {
      title: 'Máquinas, Compressores & Bombas Industriais',
      badge: 'Divisão 28',
      desc: 'Motores industriais, bombas de alta pressão, compressores e maquinário',
      secao: 'C',
      divisao: '28',
      grupo: '28.1',
      classe: '28.14-3',
      subclasse: '',
    },
    {
      title: 'Painéis Elétricos, Cabos & Automação',
      badge: 'Divisão 27',
      desc: 'Quadros de distribuição, cabos e chicotes elétricos de potência',
      secao: 'C',
      divisao: '27',
      grupo: '27.3',
      classe: '27.31-7',
      subclasse: '',
    },
    {
      title: 'Siderurgia, Aços & Metais Primários',
      badge: 'Divisão 24',
      desc: 'Perfis de aço, tubos sem costura, laminação e fundição de ligas metálicas',
      secao: 'C',
      divisao: '24',
      grupo: '24.2',
      classe: '24.21-1',
      subclasse: '',
    },
    {
      title: 'Transporte Rodoviário & Cargas Pesadas',
      badge: 'Divisão 49',
      desc: 'Frete intermunicipal, carretas, transporte de insumos e cargas perigosas',
      secao: 'H',
      divisao: '49',
      grupo: '49.3',
      classe: '49.30-2',
      subclasse: '49.30-2/02',
    },
    {
      title: 'Armazenagem, Centros de Distribuição & Galpões',
      badge: 'Divisão 52',
      desc: 'Armazéns gerais, emissão de warrant e cross-docking logístico',
      secao: 'H',
      divisao: '52',
      grupo: '52.1',
      classe: '52.11-7',
      subclasse: '',
    },
    {
      title: 'Engenharia Consultiva & Ensaios Técnicos',
      badge: 'Divisão 71',
      desc: 'Supervisão de obras industriais, ensaios não-destrutivos e calibração',
      secao: 'M',
      divisao: '71',
      grupo: '71.1',
      classe: '71.12-0',
      subclasse: '',
    },
    {
      title: 'Desenvolvimento de Software & Cloud Corporativa',
      badge: 'Divisão 62',
      desc: 'SaaS corporativo, sustentação de sistemas, cibersegurança e ERPs',
      secao: 'J',
      divisao: '62',
      grupo: '62.0',
      classe: '62.01-5',
      subclasse: '62.01-5/01',
    },
    {
      title: 'Facilities, Limpeza Técnica & Asseio Predial',
      badge: 'Divisão 81',
      desc: 'Limpeza industrial, higienização fabril, desinfecção e conservação',
      secao: 'N',
      divisao: '81',
      grupo: '81.2',
      classe: '81.21-4',
      subclasse: '',
    },
  ];

  const handleApplyPreset = (p: typeof PRESET_CATEGORIES[0]) => {
    onFilterChange({
      ...filters,
      cnaeSecao: p.secao,
      cnaeDivisao: p.divisao,
      cnaeGrupo: p.grupo,
      cnaeClasse: p.classe,
      cnaeSubclasse: p.subclasse,
    });
    onClose();
  };

  const handleApplySelection = (level: 1 | 2 | 3 | 4 | 5, code: string) => {
    const updated = { ...filters };
    if (level === 1) {
      updated.cnaeSecao = code;
      updated.cnaeDivisao = '';
      updated.cnaeGrupo = '';
      updated.cnaeClasse = '';
      updated.cnaeSubclasse = '';
    } else if (level === 2) {
      updated.cnaeSecao = navSection;
      updated.cnaeDivisao = code;
      updated.cnaeGrupo = '';
      updated.cnaeClasse = '';
      updated.cnaeSubclasse = '';
    } else if (level === 3) {
      updated.cnaeSecao = navSection;
      updated.cnaeDivisao = navDivision;
      updated.cnaeGrupo = code;
      updated.cnaeClasse = '';
      updated.cnaeSubclasse = '';
    } else if (level === 4) {
      updated.cnaeSecao = navSection;
      updated.cnaeDivisao = navDivision;
      updated.cnaeGrupo = navGroup;
      updated.cnaeClasse = code;
      updated.cnaeSubclasse = '';
    } else if (level === 5) {
      updated.cnaeSecao = navSection;
      updated.cnaeDivisao = navDivision;
      updated.cnaeGrupo = navGroup;
      updated.cnaeClasse = navClass;
      updated.cnaeSubclasse = code;
    }
    onFilterChange(updated);
    onClose();
  };

  const handleClearCnae = () => {
    onFilterChange({
      ...filters,
      cnaeSecao: '',
      cnaeDivisao: '',
      cnaeGrupo: '',
      cnaeClasse: '',
      cnaeSubclasse: '',
      cnaeCodigo: '',
    });
    setNavDivision('');
    setNavGroup('');
    setNavClass('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Catálogo Oficial CNAE Concla / IBGE</span>
                <span className="text-[10px] uppercase px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-mono">
                  5 Níveis Oficiais
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Selecione atividades econômicas de fornecedores por Seção, Divisão, Grupo, Classe ou Subclasse
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(filters.cnaeSecao || filters.cnaeDivisao || filters.cnaeGrupo || filters.cnaeClasse || filters.cnaeSubclasse) && (
              <button
                type="button"
                onClick={handleClearCnae}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Filtro</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código ou atividade (ex: 25.39, usinagem, software, transporte)..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setActiveTab('hierarchy'); setSearchTerm(''); }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'hierarchy' && !searchTerm
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Navegador 5 Níveis</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('presets'); setSearchTerm(''); }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'presets' && !searchTerm
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Categorias Rápidas</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950/40">
          {/* Se houver termo de busca, exibe resultados da busca rápida */}
          {searchResults ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Resultados da busca por "{searchTerm}": <strong>{searchResults.length}</strong> encontrados</span>
                <span className="text-[11px] text-slate-500">Clique para aplicar diretamente</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Nenhum código ou atividade correspondente encontrado no catálogo.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {searchResults.map((item, idx) => (
                    <div 
                      key={`${item.codigo}-${idx}`}
                      onClick={() => {
                        onFilterChange({
                          ...filters,
                          cnaeSecao: item.secao || '',
                          cnaeDivisao: item.divisao || '',
                          cnaeGrupo: item.grupo || '',
                          cnaeClasse: item.classe || '',
                          cnaeSubclasse: item.subclasse || '',
                        });
                        onClose();
                      }}
                      className="p-3 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-all cursor-pointer flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-mono text-[10px] font-bold">
                            {item.nivel}: {item.codigo}
                          </span>
                          {item.supplierCount !== undefined && item.supplierCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded font-medium">
                              {item.supplierCount} {item.supplierCount === 1 ? 'fornecedor' : 'fornecedores'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-2">
                          {item.nome}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'presets' ? (
            /* Presets Corporativos */
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Selecione rapidamente os principais segmentos de suprimentos e serviços industriais:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRESET_CATEGORIES.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyPreset(cat)}
                    className="p-3.5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 rounded-2xl transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md hover:shadow-blue-500/5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-mono">
                          {cat.badge}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-blue-300 mb-1">
                        {cat.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>CNAE: {cat.divisao}.*</span>
                      <span className="text-blue-400 font-sans font-semibold group-hover:underline">Aplicar Filtro</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Navegador Cascata 5 Níveis Oficiais (Concla / IBGE) */
            <div className="space-y-4">
              {/* Breadcrumb ativo */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">Hierarquia:</span>
                
                <span className="font-semibold text-blue-400">Seção {navSection}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

                <span className={navDivision ? 'font-semibold text-blue-400' : 'text-slate-500'}>
                  {navDivision ? `Divisão ${navDivision}` : 'Qualquer Divisão'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

                <span className={navGroup ? 'font-semibold text-blue-400' : 'text-slate-500'}>
                  {navGroup ? `Grupo ${navGroup}` : 'Qualquer Grupo'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

                <span className={navClass ? 'font-semibold text-blue-400' : 'text-slate-500'}>
                  {navClass ? `Classe ${navClass}` : 'Qualquer Classe'}
                </span>
              </div>

              {/* 5 Colunas ou Cascata Horizontal */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-h-[420px]">
                {/* 1. Seções */}
                <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 font-semibold text-[11px] text-blue-400 uppercase tracking-wider flex items-center justify-between">
                    <span>1. Seção ({sections.length})</span>
                  </div>
                  <div 
                    className="flex-1 overflow-y-scroll cnae-scrollbar max-h-[360px] p-1.5 space-y-1"
                    style={{ overscrollBehavior: 'contain' }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {sections.map((s: CnaeSectionInfo) => {
                      const isSelected = navSection === s.letra;
                      return (
                        <div
                          key={s.letra}
                          onClick={() => {
                            setNavSection(s.letra);
                            setNavDivision('');
                            setNavGroup('');
                            setNavClass('');
                          }}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors flex items-start gap-1.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-slate-850 text-slate-300'
                          }`}
                        >
                          <span className="font-mono shrink-0">{s.letra}</span>
                          <span className="truncate text-[11px]">{s.nome.replace(/^[A-Z] - /, '')}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-2 border-t border-slate-800 bg-slate-950/60">
                    <button
                      type="button"
                      onClick={() => handleApplySelection(1, navSection)}
                      className="w-full py-1 text-center bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded text-[11px] font-semibold transition-colors"
                    >
                      Filtrar Seção {navSection}
                    </button>
                  </div>
                </div>

                {/* 2. Divisões */}
                <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 font-semibold text-[11px] text-blue-400 uppercase tracking-wider flex items-center justify-between">
                    <span>2. Divisão ({divisions.length})</span>
                  </div>
                  <div 
                    className="flex-1 overflow-y-scroll cnae-scrollbar max-h-[360px] p-1.5 space-y-1"
                    style={{ overscrollBehavior: 'contain' }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {divisions.map((d: { codigo: string; nome: string }) => {
                      const isSelected = navDivision === d.codigo;
                      return (
                        <div
                          key={d.codigo}
                          onClick={() => {
                            setNavDivision(d.codigo);
                            setNavGroup('');
                            setNavClass('');
                          }}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors flex items-start gap-1.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-slate-850 text-slate-300'
                          }`}
                        >
                          <span className="font-mono shrink-0 font-bold">{d.codigo}</span>
                          <span className="truncate text-[11px]">{d.nome.replace(/^\d+ - /, '')}</span>
                        </div>
                      );
                    })}
                  </div>
                  {navDivision && (
                    <div className="p-2 border-t border-slate-800 bg-slate-950/60">
                      <button
                        type="button"
                        onClick={() => handleApplySelection(2, navDivision)}
                        className="w-full py-1 text-center bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Filtrar Divisão {navDivision}
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Grupos */}
                <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 font-semibold text-[11px] text-blue-400 uppercase tracking-wider flex items-center justify-between">
                    <span>3. Grupo ({groups.length})</span>
                  </div>
                  <div 
                    className="flex-1 overflow-y-scroll cnae-scrollbar max-h-[360px] p-1.5 space-y-1"
                    style={{ overscrollBehavior: 'contain' }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {groups.map((g: { codigo: string; nome: string; divisao: string; supplierCount?: number }) => {
                      const isSelected = navGroup === g.codigo;
                      return (
                        <div
                          key={g.codigo}
                          onClick={() => {
                            setNavGroup(g.codigo);
                            setNavClass('');
                          }}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors flex flex-col gap-0.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-slate-850 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold">{g.codigo}</span>
                            {g.supplierCount ? (
                              <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded">
                                {g.supplierCount}
                              </span>
                            ) : null}
                          </div>
                          <span className="truncate text-[10px] leading-tight">{g.nome.replace(/^[\d.]+ - /, '')}</span>
                        </div>
                      );
                    })}
                  </div>
                  {navGroup && (
                    <div className="p-2 border-t border-slate-800 bg-slate-950/60">
                      <button
                        type="button"
                        onClick={() => handleApplySelection(3, navGroup)}
                        className="w-full py-1 text-center bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Filtrar Grupo {navGroup}
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Classes */}
                <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 font-semibold text-[11px] text-blue-400 uppercase tracking-wider flex items-center justify-between">
                    <span>4. Classe ({classes.length})</span>
                  </div>
                  <div 
                    className="flex-1 overflow-y-scroll cnae-scrollbar max-h-[360px] p-1.5 space-y-1"
                    style={{ overscrollBehavior: 'contain' }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {classes.map((c: { codigo: string; nome: string; grupo: string; supplierCount?: number }) => {
                      const isSelected = navClass === c.codigo;
                      return (
                        <div
                          key={c.codigo}
                          onClick={() => setNavClass(c.codigo)}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors flex flex-col gap-0.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-slate-850 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold">{c.codigo}</span>
                            {c.supplierCount ? (
                              <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded">
                                {c.supplierCount}
                              </span>
                            ) : null}
                          </div>
                          <span className="truncate text-[10px] leading-tight">{c.nome.replace(/^[\d.-]+ - /, '')}</span>
                        </div>
                      );
                    })}
                  </div>
                  {navClass && (
                    <div className="p-2 border-t border-slate-800 bg-slate-950/60">
                      <button
                        type="button"
                        onClick={() => handleApplySelection(4, navClass)}
                        className="w-full py-1 text-center bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Filtrar Classe {navClass}
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Subclasses */}
                <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 font-semibold text-[11px] text-blue-400 uppercase tracking-wider flex items-center justify-between">
                    <span>5. Subclasse ({subclasses.length})</span>
                  </div>
                  <div 
                    className="flex-1 overflow-y-scroll cnae-scrollbar max-h-[360px] p-1.5 space-y-1"
                    style={{ overscrollBehavior: 'contain' }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {subclasses.map((sub: { codigo: string; nome: string; classe: string; supplierCount?: number }) => {
                      const isSelected = filters.cnaeSubclasse === sub.codigo;
                      return (
                        <div
                          key={sub.codigo}
                          onClick={() => handleApplySelection(5, sub.codigo)}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors flex flex-col gap-0.5 group ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-slate-850 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-blue-400 group-hover:text-white">
                              {sub.codigo}
                            </span>
                            {sub.supplierCount ? (
                              <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded">
                                {sub.supplierCount}
                              </span>
                            ) : null}
                          </div>
                          <span className="line-clamp-2 text-[10px] leading-tight">
                            {sub.nome.replace(/^[\d.\/-]+ - /, '')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Compatível com CNAE 2.0 / 2.3 oficial IBGE e Receita Federal</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Fechar Catálogo
          </button>
        </div>
      </div>
    </div>
  );
};
