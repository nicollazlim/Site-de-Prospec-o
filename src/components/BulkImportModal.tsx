import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ClipboardList,
  Layers,
  Database,
  Building,
  Square,
  Infinity as InfinityIcon,
  Download,
  Link as LinkIcon,
  FileSpreadsheet,
  Zap,
  HelpCircle,
  HardDrive,
  Activity,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import { extractCnpjsFromText, formatCnpj } from '../services/cnpjValidator';
import { ImportTaskStatus, Supplier } from '../types/supplier';
import { 
  PRESET_INDUSTRY_20, 
  PRESET_MULTI_50, 
  generateLargeBatch 
} from '../services/cnpjBatchPresets';
import { parseLocalCsv, downloadSampleCsv, CsvParseResult } from '../services/csvParserService';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProcessing: (cnpjs: string[], isUnlimited?: boolean, turboSpeed?: boolean) => Promise<void>;
  onCancelProcessing?: () => void;
  onImportDirectSuppliers?: (suppliers: Supplier[]) => void;
  taskStatus: ImportTaskStatus;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onStartProcessing,
  onCancelProcessing,
  onImportDirectSuppliers,
  taskStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'presets'>('csv');
  const [inputText, setInputText] = useState('');
  const [isUnlimitedMode, setIsUnlimitedMode] = useState(false);
  const [turboSpeed, setTurboSpeed] = useState(true); // Modo Turbo ultrarrápido ativado por padrão
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedCsv, setParsedCsv] = useState<CsvParseResult | null>(null);
  
  // Link direto de CSV
  const [csvLinkUrl, setCsvLinkUrl] = useState('');
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const extractedCnpjs = extractCnpjsFromText(inputText);
  const isProcessing = taskStatus.status === 'processing';
  const isCompleted = taskStatus.status === 'completed';

  // Processa o arquivo CSV selecionado
  const handleProcessFileContent = (content: string, name: string) => {
    setFileName(name);
    const parsed = parseLocalCsv(content);
    setParsedCsv(parsed);

    // Se o CSV tiver CNPJs, preenche também o inputText para visualização
    if (parsed.cnpjs.length > 0) {
      setInputText(parsed.cnpjs.map(formatCnpj).join('\n'));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleProcessFileContent(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleProcessFileContent(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  // Carrega CSV a partir de um Link / URL
  const handleFetchCsvFromUrl = async (urlToFetch: string) => {
    if (!urlToFetch.trim()) return;
    setIsLoadingLink(true);
    setLinkError(null);

    try {
      const response = await fetch(urlToFetch.trim());
      if (!response.ok) {
        throw new Error(`Falha ao obter arquivo (HTTP ${response.status})`);
      }
      const text = await response.text();
      const extractedName = urlToFetch.split('/').pop() || 'dados_remotos.csv';
      handleProcessFileContent(text, extractedName);
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'Não foi possível carregar a URL');
    } finally {
      setIsLoadingLink(false);
    }
  };

  // Carrega o CSV local estático da pasta public do projeto
  const handleLoadLocalProjectCsv = async () => {
    setCsvLinkUrl('/dados_cnpjs.csv');
    await handleFetchCsvFromUrl('/dados_cnpjs.csv');
  };

  const handleLoadPreset = (count: 20 | 50 | 100 | 250 | 500 | 1000 | 'unlimited') => {
    if (count === 'unlimited') {
      setIsUnlimitedMode(true);
      const list = generateLargeBatch(100);
      setInputText(list.map(formatCnpj).join('\n'));
      setFileName(null);
      setParsedCsv(null);
      return;
    }

    setIsUnlimitedMode(false);
    let list: string[] = [];
    if (count === 20) list = PRESET_INDUSTRY_20;
    else if (count === 50) list = PRESET_MULTI_50;
    else if (count === 100) list = generateLargeBatch(100);
    else if (count === 250) list = generateLargeBatch(250);
    else if (count === 500) list = generateLargeBatch(500);
    else list = generateLargeBatch(1000);

    setInputText(list.map(formatCnpj).join('\n'));
    setFileName(null);
    setParsedCsv(null);
  };

  // Inicia processamento de CNPJs ou importação direta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se estiver na aba CSV, o arquivo foi carregado e o usuário deseja carregar diretamente
    if (activeTab === 'csv' && parsedCsv && parsedCsv.hasEnrichedData && onImportDirectSuppliers) {
      onImportDirectSuppliers(parsedCsv.fullSuppliers);
      onClose();
      return;
    }

    if (extractedCnpjs.length === 0 && !isUnlimitedMode) return;
    await onStartProcessing(extractedCnpjs, isUnlimitedMode, turboSpeed);
  };

  const handleDirectImportFromCsv = () => {
    if (parsedCsv && parsedCsv.fullSuppliers.length > 0 && onImportDirectSuppliers) {
      onImportDirectSuppliers(parsedCsv.fullSuppliers);
      onClose();
    }
  };

  const progressPercent = taskStatus.total > 0
    ? Math.round((taskStatus.processed / taskStatus.total) * 100)
    : 0;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      style={{ zIndex: 99999 }}
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Carga Massiva de CNPJs
              </h2>
              <p className="text-xs text-slate-400">
                Importe planilhas CSV locais, carregue via link direto ou consulte listas de CNPJs
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isProcessing) {
                onCancelProcessing?.();
              } else {
                onClose();
              }
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title={isProcessing ? 'Cancelar e fechar' : 'Fechar'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (quando não estiver processando) */}
        {!isProcessing && !isCompleted && (
          <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-4 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('csv')}
              className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'csv'
                  ? 'border-blue-500 text-white bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Base CSV / Link Local</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-normal">
                Recomendado
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('presets');
                setParsedCsv(null);
              }}
              className={`flex items-center gap-2 py-2.5 px-3 border-b-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'presets'
                  ? 'border-blue-500 text-white bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-blue-400" />
              <span>Colar CNPJs / Lotes Pré-configurados</span>
            </button>

            {/* Indicador de Base 100% Oficial */}
            <div className="ml-auto flex items-center gap-1.5 py-1">
              <span className="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Base Oficial da Receita Federal</span>
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 cnae-scrollbar">
          {!isProcessing && !isCompleted ? (
            <>
              {/* TAB 1: BASE CSV LOCAL E LINK */}
              {activeTab === 'csv' && (
                <div className="space-y-4">
                  {/* Card 1: Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-blue-400 bg-blue-500/15 scale-[1.01]'
                        : fileName
                        ? 'border-emerald-500/60 bg-emerald-500/5'
                        : 'border-slate-700 hover:border-blue-500/70 bg-slate-950/60 hover:bg-slate-950/90'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv,.txt"
                      className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-3 bg-slate-800 rounded-full border border-slate-700 text-blue-400 shadow-inner">
                        <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                      </div>

                      {fileName ? (
                        <div>
                          <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Arquivo selecionado: {fileName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {parsedCsv?.totalRows || 0} linhas identificadas · {extractedCnpjs.length} CNPJs válidos
                          </p>
                          <span className="text-[10px] text-blue-400 underline mt-1 inline-block">
                            Clique para trocar de arquivo
                          </span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-semibold text-slate-200">
                            Arraste e solte sua base de CNPJs em <strong className="text-emerald-400">CSV</strong> ou <strong className="text-blue-400">TXT</strong> aqui
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Ou clique para escolher do seu computador (identifica automaticamente colunas de CNPJ, Razão Social, Cidade e UF)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detalhes do CSV processado */}
                  {parsedCsv && (
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Estrutura do CSV Detectada:</span>
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {parsedCsv.cnpjs.length} CNPJs prontos
                        </span>
                      </div>

                      {parsedCsv.detectedColumns.length > 0 && (
                        <div className="text-[11px] text-slate-400">
                          Colunas: <span className="font-mono text-slate-300">{parsedCsv.detectedColumns.slice(0, 6).join(', ')}</span>
                          {parsedCsv.detectedColumns.length > 6 && '...'}
                        </div>
                      )}

                      {parsedCsv.hasEnrichedData && (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-emerald-300">
                            ✓ Este CSV contém Razão Social e Cidades prontas para inserção imediata.
                          </span>
                          <button
                            type="button"
                            onClick={handleDirectImportFromCsv}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
                          >
                            Inserir {parsedCsv.fullSuppliers.length} no Mapa Imediatamente
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card 2: Link / URL Direto de CSV */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>Carregar por Link / URL Direto de CSV:</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('/dados_cnpjs.csv');
                            setCopiedLink(true);
                            setTimeout(() => setCopiedLink(false), 2000);
                          }}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copiar link /dados_cnpjs.csv para a área de transferência"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar Link</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleLoadLocalProjectCsv}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 shadow-sm"
                          title="Carrega o arquivo dados_cnpjs.csv da pasta public do projeto"
                        >
                          <HardDrive className="w-3 h-3 text-amber-400" />
                          <span>Usar /dados_cnpjs.csv Agora</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={csvLinkUrl}
                          onChange={(e) => {
                            setCsvLinkUrl(e.target.value);
                            if (linkError) setLinkError(null);
                          }}
                          placeholder="Ex: /dados_cnpjs.csv ou https://meu-servidor.com/fornecedores.csv"
                          className="w-full pl-3 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFetchCsvFromUrl(csvLinkUrl)}
                        disabled={isLoadingLink || !csvLinkUrl.trim()}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                      >
                        {isLoadingLink ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Buscando...</span>
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Carregar via Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    {linkError && (
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{linkError}</span>
                      </div>
                    )}
                  </div>

                  {/* Card 3: Download de Modelo CSV e Guia de Uso */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs">
                    <div className="text-slate-400">
                      Precisa de um modelo pronto com colunas de CNPJ, Razão Social e Cidade?
                    </div>
                    <button
                      type="button"
                      onClick={downloadSampleCsv}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Baixar Modelo CSV</span>
                    </button>
                  </div>

                  {/* Card Informativo: Como vincular seus arquivos CSV locais */}
                  <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-xl text-xs text-slate-300 space-y-1.5">
                    <span className="font-bold text-blue-300 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                      <span>Como utilizar seus arquivos CSV locais no site:</span>
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                      <li>
                        <strong className="text-slate-200">Arrastar & Soltar:</strong> Selecione o arquivo CSV diretamente do seu computador na caixa acima.
                      </li>
                      <li>
                        <strong className="text-slate-200">Pasta do Projeto:</strong> Você pode salvar seu arquivo CSV com o nome <code className="text-blue-300 font-mono">dados_cnpjs.csv</code> na pasta <code className="text-blue-300 font-mono">public/</code> e usar o link <code className="text-emerald-400 font-mono">/dados_cnpjs.csv</code>.
                      </li>
                      <li>
                        <strong className="text-slate-200">Links Externos ou Locais:</strong> Também aceita URLs do Google Sheets (exportar CSV), servidores locais ou intranets corporativas.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: COLAR CNPJS / PRESETS DE VOLUME */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  {/* Presets Rápidos para Carga de Grandes Volumes */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Opções de Volume & Lotes Rápidos:</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Clique para preencher a fila</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadPreset(20)}
                        className={`p-2 border rounded-lg text-left transition-all cursor-pointer group ${
                          !isUnlimitedMode && extractedCnpjs.length === 20
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-800/80 hover:bg-slate-750 hover:border-blue-500/50 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400">
                          20 CNPJs
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Indústria
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadPreset(50)}
                        className={`p-2 border rounded-lg text-left transition-all cursor-pointer group ${
                          !isUnlimitedMode && extractedCnpjs.length === 50
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-800/80 hover:bg-slate-750 hover:border-blue-500/50 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400">
                          50 CNPJs
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Multi Brasil
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadPreset(100)}
                        className={`p-2 border rounded-lg text-left transition-all cursor-pointer group ${
                          !isUnlimitedMode && extractedCnpjs.length === 100
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-800/80 hover:bg-slate-750 hover:border-blue-500/50 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-blue-300 flex items-center gap-1">
                          <span>100 CNPJs</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Nacional
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadPreset(250)}
                        className={`p-2 border rounded-lg text-left transition-all cursor-pointer group ${
                          !isUnlimitedMode && extractedCnpjs.length === 250
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-800/80 hover:bg-slate-750 hover:border-indigo-500/50 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                          <span>250 CNPJs</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Corporativo
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadPreset(500)}
                        className={`p-2 border rounded-lg text-left transition-all cursor-pointer group ${
                          !isUnlimitedMode && extractedCnpjs.length === 500
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-800/80 hover:bg-slate-750 hover:border-indigo-500/50 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
                          <span>500 CNPJs</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Grande Porte
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadPreset(1000)}
                        className={`p-2 border rounded-lg text-left transition-all cursor-pointer group ${
                          !isUnlimitedMode && extractedCnpjs.length === 1000
                            ? 'bg-purple-600/20 border-purple-500 text-white'
                            : 'bg-slate-800/80 hover:bg-slate-750 hover:border-purple-500/50 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-pink-300 flex items-center gap-1">
                          <span>1.000</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Massivo
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadPreset('unlimited')}
                        className={`p-2 border rounded-lg text-left transition-all cursor-pointer group shadow-sm ${
                          isUnlimitedMode
                            ? 'bg-gradient-to-r from-emerald-600/30 to-blue-600/30 border-emerald-400 text-white shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-blue-900/60 to-purple-900/60 hover:from-blue-900/80 hover:to-purple-900/80 border-blue-500/60 text-slate-200'
                        }`}
                        title="Carregamento contínuo em tempo real com indicador dinâmico de total"
                      >
                        <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Carga Dinâmica</span>
                        </div>
                        <div className="text-[10px] text-emerald-200/80 font-medium">
                          Tempo Real
                        </div>
                      </button>
                    </div>
                  </div>

                  {isUnlimitedMode && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                      <Zap className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>
                        <strong>Carga Dinâmica em Tempo Real:</strong> O sistema carrega empresas continuamente em alta velocidade exibindo a <strong>quantidade total carregada em tempo real</strong> até você clicar em <strong>Parar</strong>.
                      </span>
                    </div>
                  )}

                  {/* Text Area for Pasting */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                        <span>Cole a lista de CNPJs (um por linha, vírgulas ou colunas):</span>
                      </label>
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {extractedCnpjs.length} {extractedCnpjs.length === 1 ? 'CNPJ válido' : 'CNPJs válidos detectados'}
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        setParsedCsv(null);
                      }}
                      placeholder="Cole múltiplos CNPJs aqui (dezenas, centenas ou milhares). Exemplo:&#10;33.000.167/0001-01&#10;84.429.695/0001-11&#10;33.611.500/0001-19&#10;33.592.510/0001-54&#10;05.462.987/0001-80"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* PROGRESS & RESULTS VIEW - MOSTRA A QUANTIDADE TOTAL EXATA SEM A PALAVRA "ILIMITADO" */
            <div className="space-y-4 py-2">
              {/* Progress Bar */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-2">
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span>Carregando: <strong className="text-white font-mono text-sm">{taskStatus.processed}</strong> empresas analisadas no total</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Varredura concluída! Quantidade total: <strong className="text-emerald-400 font-mono text-sm">{taskStatus.successCount}</strong> empresas adicionadas ao mapa.</span>
                      </>
                    )}
                  </span>
                  
                  <div className="flex items-center gap-2.5">
                    {isProcessing && onCancelProcessing && (
                      <button
                        type="button"
                        onClick={onCancelProcessing}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-rose-900/30"
                        title="Interromper carregamento e manter os fornecedores obtidos até o momento"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Parar</span>
                      </button>
                    )}
                    {taskStatus.isUnlimited ? (
                      <span className="font-mono font-bold text-emerald-400 text-xs bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Total Carregado: {taskStatus.processed}</span>
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-blue-400 text-xs bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {taskStatus.processed} de {taskStatus.total} ({progressPercent}%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  {taskStatus.isUnlimited && isProcessing ? (
                    <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 animate-pulse w-full rounded-full" />
                  ) : (
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-200 rounded-full"
                      style={{ width: `${taskStatus.isUnlimited ? 100 : progressPercent}%` }}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Adicionadas com Sucesso: <strong className="text-emerald-400">{taskStatus.successCount}</strong></span>
                  <span>Erros/Inaptos: <strong className="text-amber-400">{taskStatus.errorCount}</strong></span>
                  <span>Quantidade Total do Carregamento: <strong className="text-white text-xs font-mono">{taskStatus.processed}</strong></span>
                </div>
              </div>

              {/* Activity Log List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 cnae-scrollbar">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Relatório de Varredura em Tempo Real
                </span>
                {taskStatus.logs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {log.success ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="font-mono font-semibold text-slate-200">
                          {log.cnpj}
                        </span>
                        {log.razaoSocial && (
                          <span className="text-slate-400 ml-2 truncate inline-block align-bottom max-w-[280px]">
                            · {log.razaoSocial}
                          </span>
                        )}
                        {log.message && !log.razaoSocial && (
                          <span className="text-slate-400 ml-2 truncate inline-block align-bottom max-w-[280px]">
                            · {log.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          {isProcessing ? (
            <button
              type="button"
              onClick={onCancelProcessing}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-900/30"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Parar / Cancelar Varredura</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              {isCompleted ? 'Fechar' : 'Cancelar'}
            </button>
          )}

          {!isProcessing && !isCompleted ? (
            <div className="flex items-center gap-2">
              {parsedCsv && parsedCsv.hasEnrichedData && (
                <button
                  type="button"
                  onClick={handleDirectImportFromCsv}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Carregar {parsedCsv.fullSuppliers.length} Fornecedores do CSV</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={extractedCnpjs.length === 0 && !isUnlimitedMode}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>
                  {isUnlimitedMode 
                    ? `Iniciar Carga Dinâmica Oficial` 
                    : `Consultar ${extractedCnpjs.length} CNPJs (Base Oficial)`}
                </span>
              </button>
            </div>
          ) : isCompleted ? (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Visualizar {taskStatus.successCount} Fornecedores no Mapa & Painel
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
