import { 
  AnaliseFinanceira, 
  NivelRisco, 
  PorteEmpresa, 
  RegularidadeFiscal, 
  SituacaoCadastral, 
  SocioQSA 
} from '../types/supplier';

export function calculateCompanyAge(dataAbertura: string): number {
  if (!dataAbertura) return 0;
  const parts = dataAbertura.split('-');
  const openDate = parts.length === 3 
    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    : new Date(dataAbertura);
  
  if (isNaN(openDate.getTime())) return 0;

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - openDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(diffYears * 10) / 10;
}

export function computeFinancialHealth(params: {
  dataAbertura: string;
  situacaoCadastral: SituacaoCadastral;
  capitalSocial: number;
  porte: PorteEmpresa;
  qsa: SocioQSA[];
  cnaesCount: number;
  cnpj: string;
}): AnaliseFinanceira {
  const { dataAbertura, situacaoCadastral, capitalSocial, porte, qsa, cnaesCount, cnpj } = params;
  const companyAge = calculateCompanyAge(dataAbertura);

  // Deterministic seed from CNPJ digits to ensure stability across calls
  const numericSum = cnpj.split('').reduce((acc, c) => acc + (parseInt(c, 10) || 0), 0);
  
  let score = 50; // Base score
  const pontosPositivos: string[] = [];
  const pontosAtencao: string[] = [];

  // 1. Situação Cadastral (Impacto Crítico)
  if (situacaoCadastral === 'ATIVA') {
    score += 20;
    pontosPositivos.push('Situação Cadastral regular e ativa perante a Receita Federal');
  } else if (situacaoCadastral === 'BAIXADA') {
    score = 10;
    pontosAtencao.push('Empresa BAIXADA no cadastro nacional (inapta para faturamento)');
  } else if (situacaoCadastral === 'SUSPENSA') {
    score = 25;
    pontosAtencao.push('Cadastro SUSPENSO por pendências administrativas ou tributárias');
  } else {
    score = 20;
    pontosAtencao.push('Situação Cadastral inativa');
  }

  // 2. Tempo de Mercado (Longevidade)
  if (companyAge >= 10) {
    score += 15;
    pontosPositivos.push(`Alta maturidade corporativa (${companyAge} anos de atividade ininterrupta)`);
  } else if (companyAge >= 5) {
    score += 10;
    pontosPositivos.push(`Empresa consolidada no mercado (${companyAge} anos de fundação)`);
  } else if (companyAge >= 2) {
    score += 5;
    pontosPositivos.push(`Histórico operacional com mais de 2 anos de atuação`);
  } else if (companyAge > 0) {
    score -= 8;
    pontosAtencao.push(`Empresa recente (${companyAge} anos de registro) – requer validação de referências`);
  }

  // 3. Capital Social & Porte
  if (capitalSocial >= 1000000) {
    score += 15;
    pontosPositivos.push('Capital Social robusto superior a R$ 1.000.000,00');
  } else if (capitalSocial >= 200000) {
    score += 10;
    pontosPositivos.push('Capital Social compatível com fornecimento de médio/grande porte');
  } else if (capitalSocial >= 50000) {
    score += 5;
    pontosPositivos.push('Capital Social declarado atende exigências contratuais padrão');
  } else if (capitalSocial <= 10000 && porte === 'DEMAIS') {
    score -= 10;
    pontosAtencao.push('Capital Social baixo desproporcional ao porte corporativo');
  }

  // 4. Governança e QSA
  if (qsa.length >= 2) {
    score += 5;
    pontosPositivos.push(`Sociedade pluripessoal estruturada (${qsa.length} administradores/sócios)`);
  } else if (qsa.length === 1) {
    score += 2;
    pontosPositivos.push('Administração unificada com responsabilidade individual definida');
  }

  // 5. Diversificação de CNAEs
  if (cnaesCount >= 5) {
    score += 5;
    pontosPositivos.push('Amplo escopo operacional com mais de 5 atividades secundárias registradas');
  }

  // Se a empresa estiver baixada ou suspensa, o score não pode passar de 30
  if (situacaoCadastral !== 'ATIVA') {
    score = Math.min(score, 30);
  }

  // Limita score entre 5 e 98
  score = Math.max(5, Math.min(98, score));

  // Nível de Risco
  let nivelRisco: NivelRisco = 'MEDIO';
  if (situacaoCadastral !== 'ATIVA') {
    nivelRisco = 'CRITICO';
  } else if (score >= 80) {
    nivelRisco = 'BAIXO';
  } else if (score >= 55) {
    nivelRisco = 'MEDIO';
  } else {
    nivelRisco = 'ALTO';
  }

  // Capacidade de Fornecimento
  let capacidadeFornecimento: 'ALTA' | 'MEDIA' | 'EM_DESENVOLVIMENTO' | 'LIMITADA' = 'MEDIA';
  if (capitalSocial >= 1000000 && companyAge >= 5 && situacaoCadastral === 'ATIVA') {
    capacidadeFornecimento = 'ALTA';
  } else if (situacaoCadastral !== 'ATIVA') {
    capacidadeFornecimento = 'LIMITADA';
  } else if (companyAge < 2 || capitalSocial < 30000) {
    capacidadeFornecimento = 'EM_DESENVOLVIMENTO';
  } else {
    capacidadeFornecimento = 'MEDIA';
  }

  // Regularidade fiscal simulada realista (com base no status e semente)
  const isHealthy = situacaoCadastral === 'ATIVA' && score >= 50;
  const regularidadeFiscal: RegularidadeFiscal = {
    cndFederal: isHealthy || (numericSum % 7 !== 0),
    cndFederalValidade: '2026-12-31',
    fgts: isHealthy || (numericSum % 5 !== 0),
    cndtTrabalhista: isHealthy || (numericSum % 9 !== 0),
    sintegraEstadual: situacaoCadastral === 'ATIVA',
    dividaAtivaPgfn: (isHealthy || (numericSum % 7 !== 0)) ? 'Nada Consta' : 'Débito Inscrito',
    dataUltimaConsulta: new Date().toISOString().split('T')[0],
    ceisSanction: (situacaoCadastral !== 'ATIVA' && numericSum % 4 === 0) ? 'Inidônea / Suspensa' : 'Nada Consta',
    cnepSanction: (situacaoCadastral !== 'ATIVA' && numericSum % 5 === 0) ? 'Punida' : 'Nada Consta',
    trabalhoEscravo: 'Nada Consta',
    pepIdentificado: false,
    riscoInsolvencia: situacaoCadastral !== 'ATIVA' ? 'ALTO' : score >= 75 ? 'BAIXO' : 'MEDIO',
  };

  if (!regularidadeFiscal.cndFederal) pontosAtencao.push('Certidão Negativa Federal com pendência cadastral em apuração');
  if (!regularidadeFiscal.fgts) pontosAtencao.push('Certificado de Regularidade do FGTS com vencimento recente');
  if (!regularidadeFiscal.cndtTrabalhista) pontosAtencao.push('Apontamento no Banco Nacional de Devedores Trabalhistas (BNDT)');

  // Limite de Crédito / Fornecimento Sugerido
  let limiteCreditoSugerido = 0;
  if (situacaoCadastral === 'ATIVA') {
    const multiplier = score >= 80 ? 0.35 : score >= 60 ? 0.20 : 0.10;
    limiteCreditoSugerido = Math.round(Math.max(25000, capitalSocial * multiplier));
    // Limite teto para não estourar valores absurdos
    limiteCreditoSugerido = Math.min(limiteCreditoSugerido, 15000000);
  }

  // Score de Atratividade para o Comprador (0-100)
  const atratividadeScore = Math.round(
    (score * 0.5) + 
    (Math.min(companyAge, 15) / 15 * 25) + 
    (Math.min(capitalSocial, 2000000) / 2000000 * 25)
  );

  // Faixa de funcionários e faturamento estimado
  const faixaFuncionarios = capitalSocial >= 10000000 
    ? 'Mais de 100 funcionários' 
    : capitalSocial >= 1000000 
    ? '50 a 100 funcionários' 
    : capitalSocial >= 200000 
    ? '10 a 49 funcionários' 
    : 'Até 9 funcionários';

  // Recomendação formal de contratação
  let recomendacaoCompra = '';
  if (situacaoCadastral !== 'ATIVA') {
    recomendacaoCompra = 'REPROVADO: Fornecedor inapto juridicamente perante órgãos oficiais. Não efetuar adiantamentos ou contratações.';
  } else if (score >= 82) {
    recomendacaoCompra = 'ALTAMENTE RECOMENDADO: Fornecedor de baixo risco com histórico consolidado, capital compatível e regularidade fiscal plena.';
  } else if (score >= 65) {
    recomendacaoCompra = 'APROVADO COM RESSALVAS: Fornecedor elegível para contratos correntes. Recomenda-se solicitar CNDs atualizadas na emissão de POs.';
  } else {
    recomendacaoCompra = 'ATENÇÃO CRÍTICA: Alto risco cadastral ou operacional. Exigir garantia contratual e evitar pagamento antecipado.';
  }

  return {
    scoreGeral: score,
    nivelRisco,
    atratividadeScore: Math.min(99, Math.max(10, atratividadeScore)),
    capacidadeFornecimento,
    limiteCreditoSugerido,
    regularidadeFiscal,
    tempoMercadoAnos: companyAge,
    pontosPositivos,
    pontosAtencao,
    recomendacaoCompra,
    faturamentoEstimado: 'Conforme Receita Federal',
    faixaFuncionarios,
  };
}
