/**
 * Validador e Formatador de CNPJ Brasileiro (Algoritmo Oficial Módulo 11)
 */

export function cleanCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

export function formatCnpj(cnpj: string): string {
  const digits = cleanCnpj(cnpj);
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

export function isValidCnpj(cnpj: string): boolean {
  const digits = cleanCnpj(cnpj);

  if (digits.length !== 14) return false;

  // Rejeita padrões conhecidos inválidos de dígitos repetidos
  if (/^(\d)\1{13}$/.test(digits)) return false;

  // Validação do 1º dígito verificador
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(digits.charAt(i), 10) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  if (parseInt(digits.charAt(12), 10) !== digito1) return false;

  // Validação do 2º dígito verificador
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(digits.charAt(i), 10) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  return parseInt(digits.charAt(13), 10) === digito2;
}

/**
 * Extrai lista de CNPJs de qualquer texto (vírgula, ponto e vírgula, espaços, quebra de linha, CSV)
 */
export function extractCnpjsFromText(rawText: string): string[] {
  if (!rawText) return [];

  // Primeiro busca padrões com pontuação ex: 00.000.000/0001-00
  const formattedMatches = rawText.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g) || [];

  // Quebra por linhas, vírgulas, ponto e vírgula, espaços
  const tokens = rawText
    .split(/[\r\n,;\t| ]+/)
    .map(t => cleanCnpj(t))
    .filter(t => t.length === 14);

  // Unifica e remove duplicados mantendo a ordem
  const cleanList = Array.from(new Set([...formattedMatches.map(cleanCnpj), ...tokens]));

  return cleanList;
}

export function formatCurrencyBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return phone;
}
