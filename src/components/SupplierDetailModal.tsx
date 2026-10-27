import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  DollarSign, 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  MessageSquare, 
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
  Briefcase,
  Calendar,
  Share2
} from 'lucide-react';
import { Supplier } from '../types/supplier';
import { formatCurrencyBRL, formatPhoneNumber } from '../services/cnpjValidator';

interface SupplierDetailModalProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'cadastrais' | 'financeiro' | 'qsa' | 'prospeccao' | 'exportar';

export const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
  supplier,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('cadastrais');
  const [copiedCnpj, setCopiedCnpj] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [cnaeSearch, setCnaeSearch] = useState('');

  if (!isOpen || !supplier) return null;

  const handleCopyCnpj = () => {
    navigator.clipboard.writeText(supplier.cnpj);
    setCopiedCnpj(true);
    setTimeout(() => setCopiedCnpj(false), 2000);
  };

  const statusColorMap = {
    ATIVA: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    BAIXADA: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    SUSPENSA: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    INATIVA: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  const riskBadgeMap = {
    BAIXO: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    MEDIO: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    ALTO: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    CRITICO: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  // Script de abordagem comercial B2B dinâmico
  const approachScript = 
`Prezados Senhores da ${supplier.nomeFantasia || supplier.razaoSocial},

Meu nome é [Seu Nome], responsável pela área de Compras e Suprimentos da [Nome da Sua Empresa].

Identificamos a sua empresa (CNPJ: ${supplier.formattedCnpj}) através da nossa inteligência cadastral de fornecedores como uma referência nas atividades de:
"${supplier.cnaePrincipal.descricao}".

Gostaríamos de estabelecer contato comercial para:
1. Cadastrar sua empresa em nossa base de fornecedores qualificados.
2. Receber o catálogo técnico e a lista de produtos/serviços disponíveis.
3. Convidá-los para participar das nossas próximas cotações de fornecimento.

Poderiam nos confirmar o contato direto da equipe de Contratos e Vendas Corporativas?

Atenciosamente,
[Seu Nome / Departamento de Suprimentos]
[Seu Telefone / E-mail]`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(approachScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleWhatsAppSend = () => {
    const phone = supplier.contato.telefonePrincipal.replace(/\D/g, '');
    const encoded = encodeURIComponent(approachScript);
    window.open(`https://wa.me/55${phone}?text=${encoded}`, '_blank');
  };

  const handleEmailSend = () => {
    if (!supplier.contato.email) return;
    const subject = encodeURIComponent(`Solicitação de Cotação e Cadastro de Fornecedor - ${supplier.nomeFantasia}`);
    const body = encodeURIComponent(approachScript);
    window.location.href = `mailto:${supplier.contato.email}?subject=${subject}&body=${body}`;
  };

  const filteredCnaes = supplier.cnaesSecundarios.filter(c => 
    c.codigo.toLowerCase().includes(cnaeSearch.toLowerCase()) || 
    c.descricao.toLowerCase().includes(cnaeSearch.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      style={{ zIndex: 99999 }}
    >
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header com Dados Primários da Empresa */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col gap-3 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColorMap[supplier.situacaoCadastral]}`}>
                  {supplier.situacaoCadastral}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${riskBadgeMap[supplier.analiseFinanceira.nivelRisco]}`}>
                  Risco {supplier.analiseFinanceira.nivelRisco}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Porte: {supplier.porte}
                </span>
                <span className="text-xs text-slate-600">·</span>
                <span className="text-xs text-slate-400">
                  {supplier.analiseFinanceira.tempoMercadoAnos} anos de fundação
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                {supplier.nomeFantasia || supplier.razaoSocial}
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {supplier.razaoSocial}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CNPJ Bar & Key Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-blue-300 font-semibold">
                CNPJ: {supplier.formattedCnpj}
              </span>
              <button
                onClick={handleCopyCnpj}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copiar CNPJ"
              >
                {copiedCnpj ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-slate-400">
                Capital Social: <span className="text-slate-200 font-bold">{formatCurrencyBRL(supplier.capitalSocial)}</span>
              </div>
              <div className="text-slate-400">
                Score: <span className="text-amber-400 font-bold">{supplier.analiseFinanceira.scoreGeral}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 bg-slate-950/70 border-b border-slate-800 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('cadastrais')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'cadastrais' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Dados Cadastrais</span>
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'financeiro' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Saúde Financeira & Risco</span>
          </button>

          <button
            onClick={() => setActiveTab('qsa')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'qsa' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Quadro Societário (QSA)</span>
          </button>

          <button
            onClick={() => setActiveTab('prospeccao')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'prospeccao' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contatos & Abordagem B2B</span>
          </button>

          <button
            onClick={() => setActiveTab('exportar')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'exportar' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Exportar Dossiê</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: DADOS CADASTRAIS */}
          {activeTab === 'cadastrais' && (
            <div className="space-y-4">
              {/* Grid de Informações Cadastrais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Regime Tributário & Enquadramento</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-blue-300 font-semibold">{supplier.regimeTributario}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                      {supplier.tipoEstabelecimento}
                    </span>
                    {supplier.simplesNacional?.optante && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Optante Simples Nacional
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Natureza Jurídica</span>
                  <span className="text-slate-200 font-medium">{supplier.naturezaJuridica}</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Data de Abertura / Início das Atividades</span>
                  <span className="text-slate-200 font-medium">
                    {supplier.dataAbertura.split('-').reverse().join('/')} ({supplier.analiseFinanceira.tempoMercadoAnos} anos)
                  </span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Situação Cadastral na Receita</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 font-medium font-mono">{supplier.situacaoCadastral}</span>
                    <span className="text-slate-400">em {supplier.dataSituacao.split('-').reverse().join('/')}</span>
                  </div>
                  {supplier.motivoSituacao && (
                    <span className="text-rose-400 text-[11px] block mt-1">
                      Motivo: {supplier.motivoSituacao}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500 block">Origem da Consulta</span>
                  <span className="text-blue-300 font-mono font-medium">
                    {supplier.origemDados} (Última sincronização: {new Date(supplier.dataConsulta).toLocaleString('pt-BR')})
                  </span>
                </div>
              </div>

              {/* CNAE Principal */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider block">
                  CNAE Principal (Atividade Econômica Primária)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-amber-400 font-bold text-xs shrink-0">
                    [{supplier.cnaePrincipal.codigo}]
                  </span>
                  <span className="text-slate-200 text-xs font-medium">
                    {supplier.cnaePrincipal.descricao}
                  </span>
                </div>
              </div>

              {/* CNAEs Secundários */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">
                    CNAEs Secundários ({supplier.cnaesSecundarios.length} atividades registradas)
                  </span>
                  {supplier.cnaesSecundarios.length > 3 && (
                    <div className="relative w-44">
                      <input
                        type="text"
                        value={cnaeSearch}
                        onChange={(e) => setCnaeSearch(e.target.value)}
                        placeholder="Filtrar CNAE..."
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {filteredCnaes.length > 0 ? (
                    filteredCnaes.map((c, i) => (
                      <div key={i} className="text-xs flex items-start gap-2 p-1.5 rounded bg-slate-900/60">
                        <span className="font-mono text-slate-400 text-[11px] shrink-0 font-medium">
                          {c.codigo}
                        </span>
                        <span className="text-slate-300 text-[11px]">
                          {c.descricao}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Nenhum CNAE secundário encontrado.</span>
                  )}
                </div>
              </div>

              {/* Localização Oficial */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <span className="text-slate-400 font-semibold block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Localização Oficial</span>
                </span>
                <p className="text-slate-200 font-medium text-sm">
                  {supplier.endereco.municipio} - {supplier.endereco.uf}
                </p>
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>CEP: {supplier.endereco.cep || 'Não informado'}</span>
                  {supplier.endereco.latitude && supplier.endereco.longitude && (
                    <>
                      <span>·</span>
                      <span>Lat: {supplier.endereco.latitude} | Lng: {supplier.endereco.longitude}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAÚDE FINANCEIRA & RISCO */}
          {activeTab === 'financeiro' && (
            <div className="space-y-4">
              {/* Score & Recomendação Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-bold font-mono text-amber-400">
                      {supplier.analiseFinanceira.scoreGeral}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Score / 100</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">
                      Classificação de Risco: {supplier.analiseFinanceira.nivelRisco}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                      {supplier.analiseFinanceira.recomendacaoCompra}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4 shrink-0">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Limite de Crédito Sugerido</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {formatCurrencyBRL(supplier.analiseFinanceira.limiteCreditoSugerido)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Capacidade: {supplier.analiseFinanceira.capacidadeFornecimento}</span>
                </div>
              </div>

              {/* Indicadores de Regularidade Fiscal Simulados */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Certidões e Regularidade Fiscal (Simulação Estruturada)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Consulta: {supplier.analiseFinanceira.regularidadeFiscal.dataUltimaConsulta}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">CND Federal</span>
                      <span className="font-semibold text-slate-200">Receita & PGFN</span>
                    </div>
                    {supplier.analiseFinanceira.regularidadeFiscal.cndFederal ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">CRF / FGTS</span>
                      <span className="font-semibold text-slate-200">Caixa Econômica</span>
                    </div>
                    {supplier.analiseFinanceira.regularidadeFiscal.fgts ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">CNDT</span>
                      <span className="font-semibold text-slate-200">Justiça do Trabalho</span>
                    </div>
                    {supplier.analiseFinanceira.regularidadeFiscal.cndtTrabalhista ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Sintegra / ICMS</span>
                      <span className="font-semibold text-slate-200">SEFAZ Estadual</span>
                    </div>
                    {supplier.analiseFinanceira.regularidadeFiscal.sintegraEstadual ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Dívida Ativa</span>
                      <span className="font-semibold text-slate-200">PGFN União</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {supplier.analiseFinanceira.regularidadeFiscal.dividaAtivaPgfn}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">CEIS (Inidôneas)</span>
                      <span className="font-semibold text-slate-200">CGU Federal</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {supplier.analiseFinanceira.regularidadeFiscal.ceisSanction || 'Nada Consta'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">CNEP (Anticorrupção)</span>
                      <span className="font-semibold text-slate-200">CGU Federal</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {supplier.analiseFinanceira.regularidadeFiscal.cnepSanction || 'Nada Consta'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Trabalho Escravo</span>
                      <span className="font-semibold text-slate-200">MTE Lista Suja</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Nada Consta
                    </span>
                  </div>
                </div>
              </div>

              {/* Pontos Fortes e Pontos de Atenção */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Positivos */}
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/30 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fatores Positivos Identificados</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {supplier.analiseFinanceira.pontosPositivos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Atenção */}
                <div className="p-3.5 bg-amber-950/20 border border-amber-800/30 rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pontos de Atenção & Diligência</span>
                  </h4>
                  {supplier.analiseFinanceira.pontosAtencao.length > 0 ? (
                    <ul className="space-y-1.5 text-slate-300">
                      {supplier.analiseFinanceira.pontosAtencao.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400">Nenhum apontamento negativo cadastral detectado.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUADRO SOCIETÁRIO (QSA) */}
          {activeTab === 'qsa' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Sócios e Administradores Cadastrados ({supplier.qsa.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Composição societária oficial registrada na Junta Comercial e Receita Federal
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {supplier.qsa.map((socio, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold font-mono">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">
                          {socio.nome}
                        </h4>
                        <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                          <span className="text-blue-300 font-medium">{socio.qualificacao}</span>
                          {socio.paisOrigem && (
                            <>
                              <span>·</span>
                              <span>Origem: {socio.paisOrigem}</span>
                            </>
                          )}
                          {socio.dataEntrada && (
                            <>
                              <span>·</span>
                              <span>Ingresso: {socio.dataEntrada.split('-').reverse().join('/')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTATOS & ABORDAGEM B2B */}
          {activeTab === 'prospeccao' && (
            <div className="space-y-4">
              {/* Canais de Contato Oficiais */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <a
                  href={`tel:${supplier.contato.telefonePrincipal}`}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-2.5"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-500 block">Telefone Principal</span>
                    <span className="text-slate-200 font-mono font-medium truncate">
                      {formatPhoneNumber(supplier.contato.telefonePrincipal)}
                    </span>
                  </div>
                </a>

                {supplier.contato.email ? (
                  <a
                    href={`mailto:${supplier.contato.email}`}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-2.5"
                  >
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-slate-500 block">E-mail Corporativo</span>
                      <span className="text-slate-200 font-mono font-medium truncate">
                        {supplier.contato.email}
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 opacity-60">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">E-mail Corporativo</span>
                      <span className="text-slate-400"></span>
                    </div>
                  </div>
                )}

                {supplier.contato.site ? (
                  <a
                    href={supplier.contato.site}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-2.5"
                  >
                    <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-slate-500 block">Website Oficial</span>
                      <span className="text-slate-200 font-medium truncate">
                        {supplier.contato.site.replace(/^https?:\/\//, '')}
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 opacity-60">
                    <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block">Website</span>
                      <span className="text-slate-400">Não informado</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Gerador de Abordagem Comercial */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Gerador de Mensagem de Abordagem para Cotação (RFP / RFI)
                    </h4>
                  </div>
                  <button
                    onClick={handleCopyScript}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={8}
                  value={approachScript}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 leading-relaxed resize-none focus:outline-none"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleWhatsAppSend}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Disparar pelo WhatsApp</span>
                  </button>

                  {supplier.contato.email && (
                    <button
                      onClick={handleEmailSend}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Enviar por E-mail</span>
                    </button>
                  )}

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${supplier.razaoSocial} ${supplier.endereco.municipio} ${supplier.endereco.uf} ${supplier.endereco.cep}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ver no Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORTAR */}
          {activeTab === 'exportar' && (
            <div className="space-y-4">
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-4">
                <FileText className="w-12 h-12 text-blue-400 mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Exportação Completa do Dossiê Cadastral
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Gere o relatório em formato de impressão (PDF) ou baixe a estrutura completa em JSON para importação em seu ERP/SRM.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Dossiê / Salvar PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(supplier, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', dataStr);
                      downloadAnchor.setAttribute('download', `dossie_${supplier.cnpj}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Baixar JSON Estruturado</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="font-mono text-[11px]">
            ID Sistema: {supplier.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
          >
            Fechar Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};
