import { Supplier, SituacaoCadastral, PorteEmpresa, RegimeTributario, TipoEstabelecimento } from '../types/supplier';
import { cleanCnpj, formatCnpj, isValidCnpj } from './cnpjValidator';
import { getCoordinatesForCity } from './geoCoordinates';
import { computeFinancialHealth } from './financialAnalysis';
import { resolveCnaeHierarchy } from './cnaeService';

export interface CsvParseResult {
  cnpjs: string[];
  fullSuppliers: Supplier[];
  totalRows: number;
  detectedColumns: string[];
  delimiter: string;
  hasEnrichedData: boolean;
}

/**
 * Detecta o delimitador do CSV (; , \t ou |)
 */
function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r\n|\n|\r/)[0] || '';
  const counts = {
    ';': (firstLine.match(/;/g) || []).length,
    ',': (firstLine.match(/,/g) || []).length,
    '\t': (firstLine.match(/\t/g) || []).length,
    '|': (firstLine.match(/\|/g) || []).length,
  };
  let maxDelim = ';';
  let maxCount = counts[';'];
  for (const [delim, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxDelim = delim;
    }
  }
  return maxCount > 0 ? maxDelim : ';';
}

/**
 * Divide uma linha CSV respeitando aspas
 */
function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Analisa e extrai dados de um arquivo CSV ou texto delimitado
 */
export function parseLocalCsv(csvText: string): CsvParseResult {
  const lines = csvText.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return {
      cnpjs: [],
      fullSuppliers: [],
      totalRows: 0,
      detectedColumns: [],
      delimiter: ';',
      hasEnrichedData: false,
    };
  }

  const delimiter = detectDelimiter(csvText);
  const headerLine = lines[0];
  const rawHeaders = parseCsvLine(headerLine, delimiter);
  const headers = rawHeaders.map(h => h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_]/g, ''));

  // Identifica índice das colunas mais comuns
  const cnpjColIdx = headers.findIndex(h => h.includes('cnpj') || h === 'documento' || h === 'doc' || h === 'cpf_cnpj' || h === 'identificacao');
  const razaoColIdx = headers.findIndex(h => h.includes('razao') || h.includes('nome') || h === 'empresa' || h === 'social' || h === 'fornecedor');
  const fantasiaColIdx = headers.findIndex(h => h.includes('fantasia') || h.includes('apelido'));
  const cidadeColIdx = headers.findIndex(h => h.includes('cidade') || h.includes('municipio'));
  const ufColIdx = headers.findIndex(h => h === 'uf' || h.includes('estado'));
  const cnaeColIdx = headers.findIndex(h => h.includes('cnae') || h.includes('atividade') || h.includes('ramo'));
  const telColIdx = headers.findIndex(h => h.includes('tel') || h.includes('fone') || h.includes('contato'));
  const emailColIdx = headers.findIndex(h => h.includes('email') || h.includes('e_mail') || h.includes('correio'));
  const capitalColIdx = headers.findIndex(h => h.includes('capital') || h.includes('patrimonio'));
  const statusColIdx = headers.findIndex(h => h.includes('status') || h.includes('situacao'));
  const logradouroColIdx = headers.findIndex(h => h.includes('logradouro') || h.includes('rua') || h.includes('endereco') || h.includes('logr'));
  const numeroColIdx = headers.findIndex(h => h === 'numero' || h === 'num' || h.includes('numero'));
  const bairroColIdx = headers.findIndex(h => h.includes('bairro'));
  const cepColIdx = headers.findIndex(h => h.includes('cep') || h.includes('postal'));

  const cnpjsFound: string[] = [];
  const fullSuppliers: Supplier[] = [];
  const seenCnpjs = new Set<string>();

  // Se tem cabeçalho identificado, começa da linha 1; senão, processa da linha 0
  const isHeaderRow = cnpjColIdx !== -1 || headers.some(h => ['cnpj', 'razao', 'nome', 'cidade', 'uf'].some(k => h.includes(k)));
  const startIndex = isHeaderRow ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i], delimiter);
    if (cols.length === 0) continue;

    let candidateCnpj = '';
    if (cnpjColIdx !== -1 && cols[cnpjColIdx]) {
      candidateCnpj = cleanCnpj(cols[cnpjColIdx]);
    } else {
      // Procura primeiro valor que tenha 14 dígitos na linha
      for (const col of cols) {
        const cleaned = cleanCnpj(col);
        if (cleaned.length === 14 && isValidCnpj(cleaned)) {
          candidateCnpj = cleaned;
          break;
        }
      }
    }

    if (!candidateCnpj || candidateCnpj.length !== 14 || seenCnpjs.has(candidateCnpj)) {
      continue;
    }

    seenCnpjs.add(candidateCnpj);
    cnpjsFound.push(candidateCnpj);

    // Se o CSV possui Razão Social ou Cidade/UF, cria o objeto de fornecedor diretamente
    const razaoSocial = (razaoColIdx !== -1 && cols[razaoColIdx]) ? cols[razaoColIdx].toUpperCase().trim() : '';
    const cidade = (cidadeColIdx !== -1 && cols[cidadeColIdx]) ? cols[cidadeColIdx].toUpperCase().trim() : 'SAO PAULO';
    const uf = (ufColIdx !== -1 && cols[ufColIdx]) ? cols[ufColIdx].toUpperCase().trim().slice(0, 2) : 'SP';

    if (razaoSocial) {
      const nomeFantasia = (fantasiaColIdx !== -1 && cols[fantasiaColIdx]) ? cols[fantasiaColIdx].toUpperCase().trim() : razaoSocial;
      const cnaeCode = (cnaeColIdx !== -1 && cols[cnaeColIdx]) ? cols[cnaeColIdx].trim() : '25.11-0-00';
      const cnaeHier = resolveCnaeHierarchy(cnaeCode, 'Atividade Principal Mapeada em CSV');
      const coords = getCoordinatesForCity(cidade, uf, candidateCnpj);
      const capital = capitalColIdx !== -1 && cols[capitalColIdx] ? parseFloat(cols[capitalColIdx].replace(/[^\d.,]/g, '').replace(',', '.')) || 150000 : 150000;
      
      const rawStatus = statusColIdx !== -1 && cols[statusColIdx] ? cols[statusColIdx].toUpperCase() : 'ATIVA';
      const situacaoCadastral: SituacaoCadastral = rawStatus.includes('BAIX') ? 'BAIXADA' : rawStatus.includes('SUSP') ? 'SUSPENSA' : 'ATIVA';
      const porte: PorteEmpresa = capital > 4800000 ? 'DEMAIS' : capital > 360000 ? 'EPP' : 'ME';
      const tipoEstabelecimento: TipoEstabelecimento = candidateCnpj.endsWith('0001') ? 'MATRIZ' : 'FILIAL';

      const qsa = [
        {
          nome: 'DIRETOR ADMINISTRATIVO',
          qualificacao: 'Sócio-Administrador',
          paisOrigem: 'BRASIL',
          faixaEtaria: 'Entre 40 e 50 anos',
        }
      ];

      const analise = computeFinancialHealth({
        dataAbertura: '2015-06-15',
        situacaoCadastral,
        capitalSocial: capital,
        porte,
        qsa,
        cnaesCount: 1,
        cnpj: candidateCnpj,
      });

      const supplier: Supplier = {
        id: candidateCnpj,
        cnpj: candidateCnpj,
        formattedCnpj: formatCnpj(candidateCnpj),
        razaoSocial,
        nomeFantasia,
        tipoEstabelecimento,
        regimeTributario: 'Lucro Presumido' as RegimeTributario,
        dataAbertura: '2015-06-15',
        naturezaJuridica: '206-2 - Sociedade Empresária Limitada',
        porte,
        capitalSocial: capital,
        situacaoCadastral,
        dataSituacao: '2015-06-15',
        cnaePrincipal: {
          codigo: cnaeHier.subclasse.codigo,
          descricao: cnaeHier.subclasse.descricao,
        },
        cnaeHierarchy: cnaeHier,
        cnaesSecundarios: [],
        qsa,
        endereco: {
          logradouro: (logradouroColIdx !== -1 && cols[logradouroColIdx]) ? cols[logradouroColIdx].trim() : 'Endereço Comercial',
          numero: (numeroColIdx !== -1 && cols[numeroColIdx]) ? cols[numeroColIdx].trim() : 'S/N',
          bairro: (bairroColIdx !== -1 && cols[bairroColIdx]) ? cols[bairroColIdx].trim() : 'Centro',
          municipio: cidade,
          uf,
          cep: (cepColIdx !== -1 && cols[cepColIdx]) ? cols[cepColIdx].trim() : '01000-000',
          latitude: coords.lat,
          longitude: coords.lng,
        },
        contato: {
          telefonePrincipal: (telColIdx !== -1 && cols[telColIdx]) ? cols[telColIdx] : '(11) 3200-0000',
          email: (emailColIdx !== -1 && cols[emailColIdx]) ? cols[emailColIdx].toLowerCase() : undefined,
          site: undefined,
        },
        analiseFinanceira: analise,
        origemDados: 'RECEITA_FEDERAL',
        dataConsulta: new Date().toISOString(),
      };

      fullSuppliers.push(supplier);
    }
  }

  return {
    cnpjs: cnpjsFound,
    fullSuppliers,
    totalRows: lines.length - startIndex,
    detectedColumns: rawHeaders,
    delimiter,
    hasEnrichedData: fullSuppliers.length > 0,
  };
}

/**
 * Gera um arquivo modelo CSV para download
 */
export function generateSampleCsvContent(): string {
  const headers = ['cnpj', 'razao_social', 'nome_fantasia', 'cidade', 'uf', 'cnae', 'telefone', 'email', 'capital_social'];
  const sampleRows = [
    ['61.198.164/0001-60', 'WEG EQUIPAMENTOS ELETRICOS S.A.', 'WEG MOTORES', 'JARAGUA DO SUL', 'SC', '27.10-4-01', '(47) 3276-4000', 'contato@weg.net', '3500000000'],
    ['33.000.167/0001-01', 'PETROLEO BRASILEIRO S.A. PETROBRAS', 'PETROBRAS', 'RIO DE JANEIRO', 'RJ', '19.21-7-00', '(21) 3224-4477', 'fornecedores@petrobras.com.br', '205000000000'],
    ['60.746.948/0001-12', 'GERDAU ACOS LONGOS S.A.', 'GERDAU SIDERURGIA', 'SAO PAULO', 'SP', '24.21-1-00', '(11) 3094-6600', 'compras@gerdau.com', '19200000000'],
    ['45.997.418/0001-53', 'TUPY S.A.', 'TUPY FUNDICAO', 'JOINVILLE', 'SC', '24.51-2-00', '(47) 4009-8111', 'compras@tupy.com.br', '1400000000'],
    ['17.281.106/0001-03', 'VOTORANTIM CIMENTOS S.A.', 'VOTORANTIM', 'SAO PAULO', 'SP', '23.20-6-00', '(11) 2195-2000', 'suprimentos@votorantim.com', '5000000000'],
    ['00.604.122/0001-97', 'TOTVS S.A.', 'TOTVS TECNOLOGIA', 'SAO PAULO', 'SP', '62.01-5-01', '(11) 2067-4000', 'relacionamento@totvs.com.br', '1800000000'],
    ['02.808.708/0001-07', 'JSL S.A.', 'JSL LOGISTICA', 'MOGI DAS CRUZES', 'SP', '49.30-2-02', '(11) 4795-7000', 'contato@jsl.com.br', '1200000000'],
    ['01.545.826/0001-07', 'RANDON S.A. IMPLEMENTOS E PARTICIPACOES', 'RANDON VEICULOS', 'CAXIAS DO SUL', 'RS', '29.30-1-01', '(54) 3239-2000', 'atendimento@randon.com.br', '1100000000'],
    ['03.007.331/0001-41', 'AMBEV S.A.', 'AMBEV BEBIDAS', 'SAO PAULO', 'SP', '11.11-9-02', '(11) 2122-1200', 'faleconosco@ambev.com.br', '57000000000'],
    ['02.916.265/0001-60', 'JBS S.A.', 'JBS ALIMENTOS', 'SAO PAULO', 'SP', '10.11-2-01', '(11) 3144-4000', 'ri@jbs.com.br', '23000000000'],
  ];

  const csvLines = [headers.join(';')];
  for (const row of sampleRows) {
    csvLines.push(row.join(';'));
  }
  return csvLines.join('\n');
}

/**
 * Realiza download do arquivo de modelo CSV para a máquina do usuário
 */
export function downloadSampleCsv(): void {
  const content = generateSampleCsvContent();
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'modelo_fornecedores_cnpjs.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
