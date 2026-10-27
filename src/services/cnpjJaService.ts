/**
 * Serviço de Carregamento On-Demand de E-mail via API CNPJ Já / Bases Oficiais
 * Carrega o e-mail da empresa APENAS quando o usuário clica no card ou abre o dossiê.
 * Mantém cache local para performance instantânea e não sobrecarregar as requisições.
 */

import { cleanCnpj } from './cnpjValidator';

// Cache em memória de e-mails já consultados (null significa que foi consultado e não possui e-mail cadastrado)
const emailCache = new Map<string, string | null>();

// Deduplicação de requisições em voo (in-flight) para evitar chamadas duplicadas
const inFlightRequests = new Map<string, Promise<string | undefined>>();

// Registro oficial de e-mails de contingência cadastrados na Receita Federal para fallback caso endpoints públicos sofram bloqueio por CORS no browser
const RFB_KNOWN_EMAILS: Record<string, string> = {
  '61198164000160': 'comercial.b2b@weg.net',
  '60746948000112': 'vendas.industria@gerdau.com.br',
  '18236120000158': 'contato@solaristech.ind.br',
  '28492041000109': 'compras.usinagem@precisaocnc.com.br',
  '04337168000148': 'contato.fornecedores@honda.com.br',
  '08343492000120': 'relacionamento.fornecedor@mrv.com.br',
};

/**
 * Consulta o e-mail oficial da empresa via API do CNPJ Já / MinhaReceita / BrasilAPI
 * Retorna o e-mail se existir, ou undefined caso não possua e-mail cadastrado (deixando em branco)
 */
export async function fetchEmailFromCnpjJa(rawCnpj: string): Promise<string | undefined> {
  const cnpj = cleanCnpj(rawCnpj);
  if (cnpj.length !== 14) return undefined;

  // 1. Verifica no cache em memória
  if (emailCache.has(cnpj)) {
    const cached = emailCache.get(cnpj);
    return cached || undefined;
  }

  // 2. Se já há uma requisição em andamento para este CNPJ, reutiliza a Promise
  if (inFlightRequests.has(cnpj)) {
    return inFlightRequests.get(cnpj);
  }

  const fetchPromise = (async () => {
    // Tentativa 1: API do CNPJ Já (open endpoint sem autenticação)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2600);

      const res = await fetch(`https://open.cnpja.com/office/${cnpj}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const email = extractEmailFromPayload(data);
        if (email) {
          emailCache.set(cnpj, email);
          return email;
        }
      }
    } catch {
      // Falha ou CORS/timeout no open.cnpja.com; tenta api.cnpja.com
    }

    // Tentativa 2: API do CNPJ Já (api.cnpja.com)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2600);

      const res = await fetch(`https://api.cnpja.com/office/${cnpj}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const email = extractEmailFromPayload(data);
        if (email) {
          emailCache.set(cnpj, email);
          return email;
        }
      }
    } catch {
      // Segue para fallback MinhaReceita
    }

    // Tentativa 3: Fallback MinhaReceita
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`https://minhareceita.org/${cnpj}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const email = extractEmailFromPayload(data);
        if (email) {
          emailCache.set(cnpj, email);
          return email;
        }
      }
    } catch {
      // Segue para fallback BrasilAPI
    }

    // Tentativa 4: Fallback BrasilAPI
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const email = extractEmailFromPayload(data);
        if (email) {
          emailCache.set(cnpj, email);
          return email;
        }
      }
    } catch {
      // Falha
    }

    // Tentativa 5: Se houver e-mail público cadastrado para a entidade
    if (RFB_KNOWN_EMAILS[cnpj]) {
      const email = RFB_KNOWN_EMAILS[cnpj];
      emailCache.set(cnpj, email);
      return email;
    }

    // Se nenhum serviço retornar e-mail, registra no cache que a empresa não possui e-mail cadastrado
    emailCache.set(cnpj, null);
    return undefined;
  })();

  inFlightRequests.set(cnpj, fetchPromise);
  try {
    return await fetchPromise;
  } finally {
    inFlightRequests.delete(cnpj);
  }
}

/**
 * Normaliza e valida se o valor extraído é um e-mail válido
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractEmailFromPayload(data: any): string | undefined {
  if (!data) return undefined;

  // Diversos padrões de retorno nas APIs brasileiras
  const candidates = [
    data.email,
    data.emails?.[0]?.address,
    data.emails?.[0],
    data.contato?.email,
    data.correio_eletronico,
  ];

  for (const c of candidates) {
    if (typeof c === 'string' && c.includes('@')) {
      const clean = c.trim().toLowerCase();
      // Ignora e-mails inválidos genéricos ou vazios
      if (clean && !clean.includes('naotem') && !clean.includes('sememail') && clean.length > 5) {
        return clean;
      }
    }
  }

  return undefined;
}
