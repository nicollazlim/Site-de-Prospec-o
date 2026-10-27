import React from 'react';
import { 
  Building2, 
  UploadCloud, 
  MapPin, 
  Download, 
  ShieldCheck, 
  TrendingUp, 
  RotateCcw,
  Sparkles,
  ListFilter,
  Map as MapIcon,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { Supplier } from '../types/supplier';
import { formatCurrencyBRL } from '../services/cnpjValidator';

interface HeaderProps {
  suppliers: Supplier[];
  filteredSuppliers: Supplier[];
  onOpenBulkModal: () => void;
  onResetToDemo: () => void;
  onClearAll?: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onGetBuyerLocation: () => void;
  userLocation: { lat: number; lng: number } | null;
  isLocating: boolean;
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
}

export const Header: React.FC<HeaderProps> = ({
  suppliers,
  filteredSuppliers,
  onOpenBulkModal,
  onResetToDemo,
  onClearAll,
  onExportCsv,
  onExportJson,
  onGetBuyerLocation,
  userLocation,
  isLocating,
  viewMode,
  onViewModeChange,
}) => {
  const activeCount = suppliers.filter(s => s.situacaoCadastral === 'ATIVA').length;
  
  const avgScore = suppliers.length > 0 
    ? Math.round(suppliers.reduce((acc, s) => acc + s.analiseFinanceira.scoreGeral, 0) / suppliers.length)
    : 0;

  const totalCapital = suppliers.reduce((acc, s) => acc + s.capitalSocial, 0);

  const [exportOpen, setExportOpen] = React.useState(false);

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between z-20 backdrop-blur-md shrink-0">
      {/* Brand & Title: Apenas o nome "ZethusProspec" */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg sm:text-xl font-black tracking-tight text-white font-sans bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent">
          ZethusProspec
        </h1>
      </div>

      {/* View Mode Switcher Tabs (Mapa & Prospecção vs Lista Corporativa sem Mapa) */}
      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
        <button
          onClick={() => onViewModeChange('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'map'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Mapa & Prospecção</span>
        </button>

        <button
          onClick={() => onViewModeChange('list')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Lista Corporativa</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-blue-950/80 text-blue-300 rounded-full border border-blue-800/80 font-mono">
            {filteredSuppliers.length}
          </span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="hidden lg:flex items-center gap-5 border-x border-slate-800/80 px-6 py-1">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Fornecedores</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-white font-mono">{filteredSuppliers.length}</span>
            <span className="text-[11px] text-slate-500">/ {suppliers.length}</span>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-slate-800" />

        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Empresas Ativas</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base font-bold text-emerald-400 font-mono">{activeCount}</span>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-slate-800" />

        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Score Médio</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-base font-bold text-amber-400 font-mono">{avgScore}</span>
            <span className="text-[10px] text-slate-500">/100</span>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-slate-800" />

        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Capital Total Mapeado</span>
          <div className="flex items-center gap-1 text-slate-200">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold font-mono">
              {formatCurrencyBRL(totalCapital)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Geolocation Button */}
        <button
          onClick={onGetBuyerLocation}
          title={userLocation ? 'Localização ativa (calculando distâncias)' : 'Obter minha localização para calcular distâncias'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            userLocation 
              ? 'bg-blue-950/60 border-blue-600 text-blue-300 shadow-sm shadow-blue-500/20' 
              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
          }`}
        >
          <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : userLocation ? 'text-blue-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">
            {isLocating ? 'Localizando...' : userLocation ? 'GPS Ativo' : 'Minha Posição'}
          </span>
        </button>

        {/* Restore Curated Demo or Clear List */}
        {suppliers.length > 0 ? (
          onClearAll && (
            <button
              onClick={onClearAll}
              title="Limpar todos os dados de fornecedores"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Limpar Base</span>
            </button>
          )
        ) : (
          <button
            onClick={onResetToDemo}
            title="Carregar empresas modelo do Brasil"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Carregar Modelo</span>
          </button>
        )}

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          {exportOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1 text-xs">
              <button
                onClick={() => {
                  onExportCsv();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <span>Exportar Planilha (CSV)</span>
              </button>
              <button
                onClick={() => {
                  onExportJson();
                  setExportOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <span>Exportar Dados (JSON)</span>
              </button>
            </div>
          )}
        </div>

        {/* Base CSV Quick Access */}
        <button
          onClick={onOpenBulkModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
          title="Importar base de CNPJs em planilha CSV local ou por link"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Base CSV</span>
        </button>

        {/* Primary CTA: Bulk Import */}
        <button
          onClick={onOpenBulkModal}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>+ Carregar CNPJs</span>
        </button>
      </div>
    </header>
  );
};
