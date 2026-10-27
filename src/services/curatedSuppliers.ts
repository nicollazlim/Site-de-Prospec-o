import { Supplier, RegimeTributario, TipoEstabelecimento } from '../types/supplier';
import { computeFinancialHealth } from './financialAnalysis';
import { formatCnpj } from './cnpjValidator';
import { getCoordinatesForCity } from './geoCoordinates';
import { resolveCnaeHierarchy } from './cnaeService';

interface RawCuratedSupplier {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  tipoEstabelecimento?: TipoEstabelecimento;
  regimeTributario?: RegimeTributario;
  dataAbertura: string;
  naturezaJuridica: string;
  porte: 'ME' | 'EPP' | 'DEMAIS' | 'MEI';
  capitalSocial: number;
  situacaoCadastral: 'ATIVA' | 'BAIXADA' | 'SUSPENSA' | 'INATIVA';
  dataSituacao: string;
  motivoSituacao?: string;
  cnaePrincipal: { codigo: string; descricao: string };
  cnaesSecundarios: Array<{ codigo: string; descricao: string }>;
  qsa: Array<{ nome: string; qualificacao: string; dataEntrada?: string }>;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
    codigoIbge?: string;
  };
  contato: {
    telefonePrincipal: string;
    telefoneSecundario?: string;
    email?: string;
    site?: string;
  };
}

const RAW_SUPPLIERS: RawCuratedSupplier[] = [
  // 1. Thathom Agroflorestal (Exatamente conforme Imagem 1 e Imagem 2 do usuário)
  {
    cnpj: '05462987000180',
    razaoSocial: 'THATHOM AGROFLORESTAL E TRANSPORTES LTDA',
    nomeFantasia: 'THATHOM',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Lucro Real',
    dataAbertura: '2014-06-18',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    porte: 'EPP',
    capitalSocial: 1000000,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '2014-06-18',
    cnaePrincipal: {
      codigo: '02.10-1-08',
      descricao: 'Produção de florestas plantadas e mudas de espécies florestais',
    },
    cnaesSecundarios: [
      { codigo: '49.30-2-02', descricao: 'Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal' },
      { codigo: '01.61-0-03', descricao: 'Serviço de preparação de terreno, cultivo e colheita' },
      { codigo: '02.20-9-01', descricao: 'Extração de madeira em florestas plantadas' },
      { codigo: '02.30-6-00', descricao: 'Atividades de apoio à produção florestal' },
      { codigo: '46.71-6-00', descricao: 'Comércio atacadista de madeira e produtos derivados' },
      { codigo: '46.83-4-00', descricao: 'Comércio atacadista de defensivos agrícolas, adubos e fertilizantes' },
      { codigo: '77.31-4-00', descricao: 'Aluguel de máquinas e equipamentos agrícolas sem operador' },
      { codigo: '77.39-0-99', descricao: 'Aluguel de outras máquinas e equipamentos comerciais e industriais' },
      { codigo: '43.13-4-00', descricao: 'Obras de terraplenagem' },
      { codigo: '49.30-2-01', descricao: 'Transporte rodoviário de carga municipal' },
      { codigo: '52.11-7-99', descricao: 'Depósitos de mercadorias para terceiros' },
      { codigo: '52.50-8-04', descricao: 'Organização logística do transporte de carga' },
      { codigo: '01.19-9-99', descricao: 'Cultivo de outras plantas de lavoura temporária' },
      { codigo: '46.11-7-00', descricao: 'Representantes comerciais e agentes do comércio de matérias-primas agrícolas' },
      { codigo: '33.14-7-11', descricao: 'Manutenção e reparação de máquinas e equipamentos para agricultura e pecuária' },
    ],
    qsa: [
      { nome: 'JORGINA MENDES FERRAZ', qualificacao: 'Sócio-Administrador', dataEntrada: '2014-06-18' },
      { nome: 'SEBASTIAO GOMES SOBRINHO', qualificacao: 'Sócio-Administrador', dataEntrada: '2014-06-18' },
    ],
    endereco: {
      logradouro: 'RUA PAULO ADRIAO DA ROCHA',
      numero: '319',
      bairro: 'CENTRO',
      municipio: 'SAO JOAO DO PARAISO',
      uf: 'MG',
      cep: '39540-000',
      codigoIbge: '3162553',
    },
    contato: {
      telefonePrincipal: '3838321942',
      email: '', // Vazio conforme solicitado
      site: 'https://thathom.com.br',
    },
  },
  // 2. MRV Engenharia (Imagem 1)
  {
    cnpj: '08343492000120',
    razaoSocial: 'MRV ENGENHARIA E PARTICIPACOES S.A.',
    nomeFantasia: 'MRV ENGENHARIA',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Lucro Real',
    dataAbertura: '1979-07-03',
    naturezaJuridica: '204-6 - Sociedade Anônima Aberta',
    porte: 'DEMAIS',
    capitalSocial: 4524000000,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '2005-11-03',
    cnaePrincipal: {
      codigo: '41.20-4-00',
      descricao: 'Construção de edifícios residenciais e comerciais',
    },
    cnaesSecundarios: [
      { codigo: '41.10-7-00', descricao: 'Incorporação de empreendimentos imobiliários' },
      { codigo: '68.10-2-01', descricao: 'Compra e venda de imóveis próprios' },
      { codigo: '71.12-0-00', descricao: 'Serviços de engenharia e consultoria técnica' },
    ],
    qsa: [
      { nome: 'EDUARDO FISCHER TEIXEIRA DE SOUZA', qualificacao: 'Diretor Presidente', dataEntrada: '2014-01-01' },
      { nome: 'RAFAEL MENIN TEIXEIRA DE SOUZA', qualificacao: 'Diretor Presidente', dataEntrada: '2014-01-01' },
      { nome: 'RICARDO PACHECO DE OLIVEIRA', qualificacao: 'Diretor Financeiro', dataEntrada: '2020-05-12' },
    ],
    endereco: {
      logradouro: 'Avenida Professor Mário Werneck',
      numero: '621',
      bairro: 'Buritis',
      municipio: 'BELO HORIZONTE',
      uf: 'MG',
      cep: '30455-610',
      codigoIbge: '3106200',
    },
    contato: {
      telefonePrincipal: '3136157100',
      email: '', // Vazio conforme solicitado
      site: 'https://www.mrv.com.br',
    },
  },
  // 3. Moto Honda da Amazônia (Imagem 1)
  {
    cnpj: '04337168000148',
    razaoSocial: 'MOTO HONDA DA AMAZONIA LTDA',
    nomeFantasia: 'HONDA MOTOS',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Lucro Real',
    dataAbertura: '1975-07-25',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    porte: 'DEMAIS',
    capitalSocial: 1845000000,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '2005-11-03',
    cnaePrincipal: {
      codigo: '30.91-1-01',
      descricao: 'Fabricação de motocicletas, ciclomotores e triciclos',
    },
    cnaesSecundarios: [
      { codigo: '30.91-1-02', descricao: 'Fabricação de peças e acessórios para motocicletas' },
      { codigo: '46.69-9-99', descricao: 'Comércio atacadista de outras máquinas e equipamentos' },
    ],
    qsa: [
      { nome: 'ARATA ICHINOSE', qualificacao: 'Administrador', dataEntrada: '2022-04-01' },
      { nome: 'PAULO TAKESHI MATSUMOTO', qualificacao: 'Diretor Executivo', dataEntrada: '2019-11-15' },
    ],
    endereco: {
      logradouro: 'Rua José de Anchieta',
      numero: '1205',
      bairro: 'Distrito Industrial I',
      municipio: 'MANAUS',
      uf: 'AM',
      cep: '69075-010',
      codigoIbge: '1302603',
    },
    contato: {
      telefonePrincipal: '9221234000',
      email: '', // Vazio conforme regra pública
      site: 'https://www.honda.com.br',
    },
  },
  // 4. WEG S.A.
  {
    cnpj: '84429695000111',
    razaoSocial: 'WEG S.A.',
    nomeFantasia: 'WEG',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Lucro Real',
    dataAbertura: '1961-09-16',
    naturezaJuridica: '204-6 - Sociedade Anônima Aberta',
    porte: 'DEMAIS',
    capitalSocial: 6504512000,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '2005-11-03',
    cnaePrincipal: {
      codigo: '27.10-4-01',
      descricao: 'Fabricação de geradores de corrente contínua e alternada, peças e acessórios',
    },
    cnaesSecundarios: [
      { codigo: '27.10-4-02', descricao: 'Fabricação de transformadores, indutores e conversores' },
      { codigo: '27.31-7-00', descricao: 'Fabricação de aparelhos de controle de energia elétrica' },
    ],
    qsa: [
      { nome: 'HARRY SCHMELZER JUNIOR', qualificacao: 'Diretor Presidente', dataEntrada: '2008-01-02' },
      { nome: 'ANDRE LUIS RODRIGUES', qualificacao: 'Diretor Financeiro', dataEntrada: '2016-04-15' },
    ],
    endereco: {
      logradouro: 'Avenida Prefeito Waldemar Grubba',
      numero: '3300',
      bairro: 'Vila Lalau',
      municipio: 'JARAGUA DO SUL',
      uf: 'SC',
      cep: '89256-900',
      codigoIbge: '4208906',
    },
    contato: {
      telefonePrincipal: '4732764000',
      email: '', // Carregado on-demand ao clicar no card via API CNPJ Já
      site: 'https://www.weg.net',
    },
  },
  // 5. Petrobras
  {
    cnpj: '33000167000101',
    razaoSocial: 'PETROLEO BRASILEIRO S.A. - PETROBRAS',
    nomeFantasia: 'PETROBRAS',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Lucro Real',
    dataAbertura: '1953-10-03',
    naturezaJuridica: '203-8 - Sociedade de Economia Mista',
    porte: 'DEMAIS',
    capitalSocial: 205431960000,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '2005-11-03',
    cnaePrincipal: {
      codigo: '19.21-7-00',
      descricao: 'Fabricação de produtos do refino de petróleo',
    },
    cnaesSecundarios: [
      { codigo: '46.81-8-01', descricao: 'Comércio atacadista de álcool carburante e combustíveis' },
    ],
    qsa: [
      { nome: 'MAGDA CHAMBRIARD', qualificacao: 'Presidente Executiva', dataEntrada: '2024-05-24' },
    ],
    endereco: {
      logradouro: 'Avenida República do Chile',
      numero: '65',
      bairro: 'Centro',
      municipio: 'RIO DE JANEIRO',
      uf: 'RJ',
      cep: '20031-912',
      codigoIbge: '3304557',
    },
    contato: {
      telefonePrincipal: '2132244477',
      email: '', // Vazio
      site: 'https://petrobras.com.br',
    },
  },
  // 6. Gerdau S.A.
  {
    cnpj: '33611500000119',
    razaoSocial: 'GERDAU S.A.',
    nomeFantasia: 'GERDAU SIDERURGIA',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Lucro Real',
    dataAbertura: '1961-07-15',
    naturezaJuridica: '204-6 - Sociedade Anônima Aberta',
    porte: 'DEMAIS',
    capitalSocial: 19248000000,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '2005-11-03',
    cnaePrincipal: {
      codigo: '24.21-1-00',
      descricao: 'Produção de laminados longos de aço',
    },
    cnaesSecundarios: [
      { codigo: '24.11-6-00', descricao: 'Produção de laminados planos de aço ao carbono' },
    ],
    qsa: [
      { nome: 'GUSTAVO WERNECK DA SILVA', qualificacao: 'Diretor Presidente', dataEntrada: '2018-01-01' },
    ],
    endereco: {
      logradouro: 'Avenida Farrapos',
      numero: '1811',
      bairro: 'Floresta',
      municipio: 'PORTO ALEGRE',
      uf: 'RS',
      cep: '90220-005',
      codigoIbge: '4314902',
    },
    contato: {
      telefonePrincipal: '5133232000',
      email: '', // Carregado on-demand ao clicar no card via API CNPJ Já
      site: 'https://www.gerdau.com.br',
    },
  },
  // 7. Solaris Tech (Simples Nacional / EPP)
  {
    cnpj: '18236120000158',
    razaoSocial: 'SOLARIS ENERGIA RENOVAVEL & MONTAGENS LTDA',
    nomeFantasia: 'SOLARIS TECH',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Simples Nacional',
    dataAbertura: '2018-05-14',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    porte: 'EPP',
    capitalSocial: 850000,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '2018-05-14',
    cnaePrincipal: {
      codigo: '43.21-5-00',
      descricao: 'Instalação e manutenção elétrica e sistemas fotovoltaicos',
    },
    cnaesSecundarios: [
      { codigo: '46.69-9-99', descricao: 'Comércio atacadista de painéis solares' },
    ],
    qsa: [
      { nome: 'MARCOS VINICIUS ALBUQUERQUE', qualificacao: 'Sócio-Administrador', dataEntrada: '2018-05-14' },
    ],
    endereco: {
      logradouro: 'Avenida Rondon Pacheco',
      numero: '2150',
      bairro: 'Tibery',
      municipio: 'UBERLANDIA',
      uf: 'MG',
      cep: '38405-142',
      codigoIbge: '3170206',
    },
    contato: {
      telefonePrincipal: '3432398900',
      email: '', // Vazio
      site: 'https://solaristech.ind.br',
    },
  },
  // 8. Precisão Usinagem (Lucro Presumido / EPP)
  {
    cnpj: '28492041000109',
    razaoSocial: 'PRECISAO USINAGEM DE PECAS E PROTOTIPAGEM LTDA',
    nomeFantasia: 'PRECISAO CNC USINAGEM',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Lucro Presumido',
    dataAbertura: '2015-09-01',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    porte: 'EPP',
    capitalSocial: 450000,
    situacaoCadastral: 'ATIVA',
    dataSituacao: '2015-09-01',
    cnaePrincipal: {
      codigo: '25.39-0-01',
      descricao: 'Serviços de usinagem, torneamento, fresamento e CNC',
    },
    cnaesSecundarios: [
      { codigo: '25.39-0-02', descricao: 'Serviços de solda e caldeiraria pesada' },
    ],
    qsa: [
      { nome: 'CLEBER SILVA MENDONCA', qualificacao: 'Sócio-Administrador', dataEntrada: '2015-09-01' },
    ],
    endereco: {
      logradouro: 'Rua das Indústrias Metalúrgicas',
      numero: '820',
      bairro: 'Parque São Camilo',
      municipio: 'CAMPINAS',
      uf: 'SP',
      cep: '13088-750',
      codigoIbge: '3509502',
    },
    contato: {
      telefonePrincipal: '1938479200',
      email: '', // Vazio
    },
  },
  // 9. Indústria Metalúrgica Triângulo (Baixada)
  {
    cnpj: '05948372000188',
    razaoSocial: 'INDUSTRIA METALURGICA TRIANGULO LTDA - EM LIQUIDACAO',
    nomeFantasia: 'METALURGICA TRIANGULO',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Lucro Presumido',
    dataAbertura: '2003-05-10',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    porte: 'ME',
    capitalSocial: 50000,
    situacaoCadastral: 'BAIXADA',
    dataSituacao: '2023-08-14',
    motivoSituacao: 'EXTINCAO POR ENCERRAMENTO LIQUIDACAO VOLUNTARIA',
    cnaePrincipal: {
      codigo: '25.11-0-00',
      descricao: 'Fabricação de estruturas metálicas',
    },
    cnaesSecundarios: [
      { codigo: '25.39-0-01', descricao: 'Serviços de usinagem, tornearia e solda' },
    ],
    qsa: [
      { nome: 'ANTONIO SERGIO BATISTA', qualificacao: 'Sócio-Liquidante', dataEntrada: '2003-05-10' },
    ],
    endereco: {
      logradouro: 'Rua das Bandeiras',
      numero: '310',
      bairro: 'Distrito Industrial',
      municipio: 'UBERABA',
      uf: 'MG',
      cep: '38044-755',
      codigoIbge: '3170107',
    },
    contato: {
      telefonePrincipal: '3433191122',
      email: '',
    },
  },
  // 10. Distribuidora Norte Pack (Suspensa)
  {
    cnpj: '14892019000173',
    razaoSocial: 'DISTRIBUIDORA NORTE PACK EMBALAGENS PLASTICAS LTDA',
    nomeFantasia: 'NORTE PACK',
    tipoEstabelecimento: 'MATRIZ',
    regimeTributario: 'Simples Nacional',
    dataAbertura: '2012-07-19',
    naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
    porte: 'EPP',
    capitalSocial: 120000,
    situacaoCadastral: 'SUSPENSA',
    dataSituacao: '2024-02-01',
    motivoSituacao: 'IRREGULARIDADE FISCAL DE OFICIO NA SEFAZ',
    cnaePrincipal: {
      codigo: '46.86-9-02',
      descricao: 'Comércio atacadista de embalagens',
    },
    cnaesSecundarios: [
      { codigo: '22.29-3-99', descricao: 'Fabricação de artefatos de material plástico' },
    ],
    qsa: [
      { nome: 'LUIZ PAULO TAVARES', qualificacao: 'Sócio-Administrador', dataEntrada: '2012-07-19' },
    ],
    endereco: {
      logradouro: 'Avenida Autaz Mirim',
      numero: '4500',
      bairro: 'Armando Mendes',
      municipio: 'MANAUS',
      uf: 'AM',
      cep: '69089-000',
      codigoIbge: '1302603',
    },
    contato: {
      telefonePrincipal: '9236152200',
      email: '',
    },
  },
];

const VERIFIED_CURATED_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '05462987000180': { lat: -15.31361, lng: -42.01444 }, // Thathom: Rua Paulo Adrião da Rocha, 319, Centro, São João do Paraíso, MG (Norte de Minas)
  '08343492000120': { lat: -19.96784, lng: -43.95850 }, // MRV: Av Prof Mário Werneck, 621, Estoril, Belo Horizonte, MG
  '04337168000148': { lat: -3.12550, lng: -59.97230 }, // Moto Honda: Rua José de Anchieta, 1205, Distrito Industrial I, Manaus, AM
  '84429695000111': { lat: -26.47852, lng: -49.04976 }, // WEG: Av Pref Waldemar Grubba, 3300, Jaraguá do Sul, SC
  '33000167000101': { lat: -22.90960, lng: -43.17935 }, // Petrobras: Av República do Chile, 65, Rio de Janeiro, RJ
  '33611500000119': { lat: -30.01639, lng: -51.20528 }, // Gerdau: Av Farrapos, 1811, Porto Alegre, RS
  '18236120000158': { lat: -18.91980, lng: -48.26120 }, // Solaris: Av Rondon Pacheco, 2150, Uberlândia, MG (Triângulo Mineiro)
  '28492041000109': { lat: -22.88350, lng: -47.04280 }, // Precisão: Campinas, SP
  '05948372000188': { lat: -19.74830, lng: -47.93190 }, // Metalúrgica Triângulo: Uberaba, MG (Triângulo Mineiro)
  '14892019000173': { lat: -3.08510, lng: -59.94820 }, // Distribuidora Norte Pack: Manaus, AM
};

/**
 * Converte a lista em objetos completos com hierarquia Concla de 5 níveis e análise financeira
 */
export function getCuratedSuppliers(): Supplier[] {
  return RAW_SUPPLIERS.map((raw) => {
    const coords = VERIFIED_CURATED_COORDINATES[raw.cnpj] || getCoordinatesForCity(raw.endereco.municipio, raw.endereco.uf, raw.cnpj);
    const analise = computeFinancialHealth({
      dataAbertura: raw.dataAbertura,
      situacaoCadastral: raw.situacaoCadastral,
      capitalSocial: raw.capitalSocial,
      porte: raw.porte,
      qsa: raw.qsa,
      cnaesCount: raw.cnaesSecundarios.length + 1,
      cnpj: raw.cnpj,
    });

    const cnaeHierarchy = resolveCnaeHierarchy(raw.cnaePrincipal.codigo, raw.cnaePrincipal.descricao);

    const tipoEstabelecimento: TipoEstabelecimento = raw.tipoEstabelecimento || 
      (raw.cnpj.endsWith('0001') ? 'MATRIZ' : 'FILIAL');

    let regimeTributario: RegimeTributario = raw.regimeTributario || 'Lucro Real';
    if (!raw.regimeTributario) {
      if (raw.porte === 'MEI') regimeTributario = 'MEI';
      else if (raw.porte === 'ME') regimeTributario = 'Simples Nacional';
      else if (raw.porte === 'EPP') regimeTributario = 'Lucro Presumido';
      else regimeTributario = 'Lucro Real';
    }

    return {
      id: raw.cnpj,
      cnpj: raw.cnpj,
      formattedCnpj: formatCnpj(raw.cnpj),
      razaoSocial: raw.razaoSocial,
      nomeFantasia: raw.nomeFantasia || raw.razaoSocial,
      tipoEstabelecimento,
      regimeTributario,
      dataAbertura: raw.dataAbertura,
      naturezaJuridica: raw.naturezaJuridica,
      porte: raw.porte,
      capitalSocial: raw.capitalSocial,
      situacaoCadastral: raw.situacaoCadastral,
      dataSituacao: raw.dataSituacao,
      motivoSituacao: raw.motivoSituacao,
      cnaePrincipal: raw.cnaePrincipal,
      cnaeHierarchy,
      cnaesSecundarios: raw.cnaesSecundarios,
      qsa: raw.qsa,
      simplesNacional: {
        optante: regimeTributario === 'Simples Nacional' || regimeTributario === 'MEI',
        dataOpcao: raw.dataAbertura,
      },
      simei: {
        optante: regimeTributario === 'MEI',
        dataOpcao: regimeTributario === 'MEI' ? raw.dataAbertura : undefined,
      },
      endereco: {
        ...raw.endereco,
        latitude: coords.lat,
        longitude: coords.lng,
      },
      contato: {
        telefonePrincipal: raw.contato.telefonePrincipal,
        telefoneSecundario: raw.contato.telefoneSecundario,
        email: raw.contato.email || undefined,
        site: raw.contato.site,
      },
      analiseFinanceira: analise,
      origemDados: 'BASE_CURADA',
      dataConsulta: new Date().toISOString(),
    };
  });
}
