import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Phone, 
  MessageSquare, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  FileText,
  DollarSign,
  Compass,
  Mail,
  Tag
} from 'lucide-react';
import { Supplier, SupplierFilters } from '../types/supplier';
import { formatCurrencyBRL, formatPhoneNumber } from '../services/cnpjValidator';
import { getMatchingCnae } from '../services/cnaeService';

interface SupplierCardProps {
  supplier: Supplier;
  isSelected: boolean;
  onSelect: (supplier: Supplier) => void;
  onOpenDetails: (supplier: Supplier) => void;
  onFocusOnMap: (supplier: Supplier) => void;
  activeFilters?: SupplierFilters;
}

const SupplierCardComponent: React.FC<SupplierCardProps> = ({
  supplier,
  isSelected,
  onSelect,
  onOpenDetails,
  onFocusOnMap,
  activeFilters,
}) => {
  const [copied, setCopied] = useState(false);

  // Identifica se a correspondência do filtro foi por atividade secundária
  const matchedSecondaryCnae = useMemo(() => {
    if (!activeFilters) return null;
    const match = getMatchingCnae(supplier, {
      cnaeSecao: activeFilters.cnaeSecao,
      cnaeDivisao: activeFilters.cnaeDivisao,
      cnaeGrupo: activeFilters.cnaeGrupo,
      cnaeClasse: activeFilters.cnaeClasse,
      cnaeSubclasse: activeFilters.cnaeSubclasse,
      cnaeCodigo: activeFilters.cnaeCodigo,
      apenasPrincipal: activeFilters.cnaeApenasPrincipal,
    });
    return match && !match.isPrincipal ? match.cnae : null;
  }, [supplier, activeFilters]);

  const handleCopyCnpj = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(supplier.cnpj);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = supplier.contato.telefonePrincipal.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá! Sou do departamento de Compras e Suprimentos. Localizamos a ${supplier.nomeFantasia} (CNPJ: ${supplier.formattedCnpj}) e gostaríamos de solicitar uma cotação e catálogo de fornecimento.`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${supplier.contato.telefonePrincipal}`;
  };

  // Status visual mapping
  const statusColorMap = {
    ATIVA: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    BAIXADA: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    SUSPENSA: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    INATIVA: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  const dotColorMap = {
    ATIVA: 'bg-emerald-500',
    BAIXADA: 'bg-rose-500',
    SUSPENSA: 'bg-amber-500',
    INATIVA: 'bg-slate-500',
  };

  // Risk visual mapping
  const riskColorMap = {
    BAIXO: 'text-emerald-400',
    MEDIO: 'text-amber-400',
    ALTO: 'text-rose-400',
    CRITICO: 'text-purple-400',
  };

  return (
    <article
      onClick={() => onSelect(supplier)}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-slate-800/90 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
          : 'bg-slate-900/70 hover:bg-slate-850 hover:border-slate-700/80 border-slate-800/80'
      }`}
    >
      {/* Top row: Status & Score */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {/* Status */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${dotColorMap[supplier.situacaoCadastral]}`} />
          <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
            {supplier.situacaoCadastral}
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-mono">
            {supplier.porte}
          </span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-blue-300">
            {supplier.regimeTributario}
          </span>
          {supplier.analiseFinanceira.tempoMercadoAnos > 0 && (
            <>
              <span className="text-xs text-slate-600 hidden sm:inline">·</span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {supplier.analiseFinanceira.tempoMercadoAnos}a
              </span>
            </>
          )}
        </div>

        {/* Score & Risk */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
            <span className={`text-xs font-bold font-mono ${riskColorMap[supplier.analiseFinanceira.nivelRisco]}`}>
              {supplier.analiseFinanceira.scoreGeral}
            </span>
          </div>
          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all rounded-full ${
                supplier.analiseFinanceira.scoreGeral >= 80 
                  ? 'bg-emerald-500' 
                  : supplier.analiseFinanceira.scoreGeral >= 55 
                  ? 'bg-amber-500' 
                  : 'bg-rose-500'
              }`}
              style={{ width: `${supplier.analiseFinanceira.scoreGeral}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Titles */}
      <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
        {supplier.nomeFantasia || supplier.razaoSocial}
      </h3>
      <p className="text-xs text-slate-400 font-normal line-clamp-1 mb-2.5">
        {supplier.razaoSocial}
      </p>

      {/* CNPJ with 1-click copy */}
      <div className="flex items-center justify-between mb-3 bg-slate-950/60 rounded-lg px-2.5 py-1.5 border border-slate-800/80">
        <span className="font-mono text-xs text-blue-300/90 font-medium">
          {supplier.formattedCnpj}
        </span>
        <button
          onClick={handleCopyCnpj}
          title="Copiar CNPJ (apenas números ou formatado)"
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-[10px]">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px]">Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Activity / CNAE Principal */}
      <p className="text-xs text-slate-300 line-clamp-1 mb-1.5 flex items-center gap-1.5">
        <span className="text-slate-500 font-mono text-[11px] shrink-0">
          [{supplier.cnaePrincipal.codigo}]
        </span>
        <span className="truncate">{supplier.cnaePrincipal.descricao}</span>
      </p>

      {/* Destaque quando a correspondência do filtro foi por CNAE Secundário */}
      {matchedSecondaryCnae && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-md px-2 py-1 mb-2">
          <Tag className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="font-semibold text-amber-400 shrink-0">Filtro atendeu Secundário:</span>
          <span className="font-mono font-bold text-amber-200 shrink-0">[{matchedSecondaryCnae.codigo}]</span>
          <span className="truncate text-slate-200">{matchedSecondaryCnae.descricao}</span>
        </div>
      )}

      {/* E-mail oficial carregado on-demand (deixa em branco se não houver) */}
      {supplier.contato.email && (
        <div className="flex items-center gap-1.5 text-[11px] text-blue-300 font-mono mb-2 px-2 py-1 rounded-md bg-blue-950/40 border border-blue-900/40 truncate">
          <Mail className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="truncate">{supplier.contato.email}</span>
        </div>
      )}

      {/* Location & Capital */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-1 truncate max-w-[65%]">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">
            {supplier.endereco.municipio} - {supplier.endereco.uf} · CEP {supplier.endereco.cep || 'N/I'}
          </span>
          {supplier.distanciaKm !== undefined && (
            <span className="text-blue-400 font-mono text-[11px] shrink-0 ml-1">
              ({supplier.distanciaKm} km)
            </span>
          )}
        </div>

        <div className="text-right shrink-0">
          <span className="text-slate-300 font-medium font-mono text-[11px]">
            {formatCurrencyBRL(supplier.capitalSocial)}
          </span>
        </div>
      </div>

      {/* Quick Action Footer Buttons */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
        <button
          onClick={handleWhatsApp}
          title="Iniciar conversa no WhatsApp"
          className="flex-1 py-1.5 px-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3 h-3 text-emerald-400" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={handleCall}
          title={`Ligar para ${formatPhoneNumber(supplier.contato.telefonePrincipal)}`}
          className="py-1.5 px-2.5 bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <Phone className="w-3 h-3 text-slate-400" />
          <span className="sr-only">Ligar</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFocusOnMap(supplier);
          }}
          title="Localizar no mapa"
          className="py-1.5 px-2.5 bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <Compass className="w-3 h-3 text-blue-400" />
          <span className="sr-only">Ver no Mapa</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(supplier);
          }}
          className="flex-1 py-1.5 px-2 bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/50 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <FileText className="w-3 h-3 text-blue-400" />
          <span>Dossiê</span>
        </button>
      </div>
    </article>
  );
};

export const SupplierCard = React.memo(SupplierCardComponent, (prev, next) => {
  return (
    prev.isSelected === next.isSelected &&
    prev.supplier.id === next.supplier.id &&
    prev.supplier.contato.email === next.supplier.contato.email &&
    prev.supplier.distanciaKm === next.supplier.distanciaKm
  );
});
