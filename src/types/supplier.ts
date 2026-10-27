/**
 * Definições de Tipos para o Sistema de Prospecção Inteligente de Fornecedores
 */

export type SituacaoCadastral = 'ATIVA' | 'BAIXADA' | 'SUSPENSA' | 'INATIVA';

export type NivelRisco = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export type PorteEmpresa = 'ME' | 'EPP' | 'DEMAIS' | 'MEI';

export type RegimeTributario = 'Lucro Real' | 'Lucro Presumido' | 'Simples Nacional' | 'MEI';

export type TipoEstabelecimento = 'MATRIZ' | 'FILIAL';

export interface CnaeItem {
  codigo: string;
  descricao: string;
}

export interface CnaeLevelInfo {
  codigo: string;
  descricao: string;
}

export interface CnaeHierarchyInfo {
  secao: CnaeLevelInfo;
  divisao: CnaeLevelInfo;
  grupo: CnaeLevelInfo;
  classe: CnaeLevelInfo;
  subclasse: CnaeLevelInfo;
}

export interface SocioQSA {
  nome: string;
  qualificacao: string;
  paisOrigem?: string;
  faixaEtaria?: string;
  dataEntrada?: string;
  cpfCnpjRepresentante?: string;
}

export interface EnderecoCompleto {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  codigoIbge?: string;
  latitude: number;
  longitude: number;
}

export interface ContatoOficial {
  telefonePrincipal: string;
  telefoneSecundario?: string;
  email?: string; // Vazio ou sem e-mail quando a fonte pública não possuir
  site?: string;
}

export interface CertidaoItem {
  nome: string;
  orgao: string;
  status: 'Regular' | 'Irregular' | 'Nada Consta';
  validade?: string;
  detalhes?: string;
}

export interface RegularidadeFiscal {
  cndFederal: boolean;
  cndFederalValidade?: string;
  fgts: boolean;
  cndtTrabalhista: boolean;
  sintegraEstadual: boolean;
  dividaAtivaPgfn: 'Nada Consta' | 'Débito Inscrito';
  dataUltimaConsulta: string;
  ceisSanction?: 'Nada Consta' | 'Inidônea / Suspensa';
  cnepSanction?: 'Nada Consta' | 'Punida';
  trabalhoEscravo?: 'Nada Consta' | 'Consta na Lista';
  pepIdentificado?: boolean;
  riscoInsolvencia?: 'BAIXO' | 'MEDIO' | 'ALTO';
}

export interface AnaliseFinanceira {
  scoreGeral: number; // 0 a 100
  nivelRisco: NivelRisco;
  atratividadeScore: number; // 0 a 100
  capacidadeFornecimento: 'ALTA' | 'MEDIA' | 'EM_DESENVOLVIMENTO' | 'LIMITADA';
  limiteCreditoSugerido: number;
  regularidadeFiscal: RegularidadeFiscal;
  tempoMercadoAnos: number;
  pontosPositivos: string[];
  pontosAtencao: string[];
  recomendacaoCompra: string;
  faturamentoEstimado: string;
  faixaFuncionarios: string;
}

export interface Supplier {
  id: string;
  cnpj: string; // 14 dígitos numéricos
  formattedCnpj: string; // XX.XXX.XXX/0001-XX
  razaoSocial: string;
  nomeFantasia: string;
  tipoEstabelecimento: TipoEstabelecimento; // MATRIZ | FILIAL
  regimeTributario: RegimeTributario;
  dataAbertura: string;
  naturezaJuridica: string;
  porte: PorteEmpresa;
  capitalSocial: number;
  situacaoCadastral: SituacaoCadastral;
  dataSituacao: string;
  motivoSituacao?: string;
  cnaePrincipal: CnaeItem;
  cnaeHierarchy: CnaeHierarchyInfo;
  cnaesSecundarios: CnaeItem[];
  qsa: SocioQSA[];
  simplesNacional?: { optante: boolean; dataOpcao?: string; dataExclusao?: string };
  simei?: { optante: boolean; dataOpcao?: string; dataExclusao?: string };
  endereco: EnderecoCompleto;
  contato: ContatoOficial;
  analiseFinanceira: AnaliseFinanceira;
  distanciaKm?: number;
  origemDados: 'BRASIL_API' | 'RECEITA_FEDERAL' | 'MINHA_RECEITA' | 'PUBLICA_CNPJ_WS' | 'BASE_CURADA';
  dataConsulta: string;
}

export type SortOption = 
  | 'score_desc' 
  | 'score_asc' 
  | 'capital_desc' 
  | 'tempo_desc' 
  | 'proximidade' 
  | 'nome_asc';

export interface SupplierFilters {
  searchQuery: string;
  regiao: string;
  uf: string;
  cidade: string;
  situacaoCadastral: string;
  nivelRisco: string;
  porte: string;
  regimeTributario: string;
  tipoEstabelecimento: string;
  cnaeSecao: string;
  cnaeDivisao: string;
  cnaeGrupo: string;
  cnaeClasse: string;
  cnaeSubclasse: string;
  cnaeCodigo: string;
  cnaeApenasPrincipal?: boolean;
  sortBy: SortOption;
}

export interface ImportTaskStatus {
  status: 'idle' | 'processing' | 'completed' | 'error';
  total: number;
  processed: number;
  isUnlimited?: boolean;
  currentCnpj?: string;
  successCount: number;
  errorCount: number;
  logs: Array<{
    cnpj: string;
    razaoSocial?: string;
    success: boolean;
    message: string;
    timestamp: string;
  }>;
}
