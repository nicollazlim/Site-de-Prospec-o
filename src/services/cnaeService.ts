/**
 * Tabela Oficial da Concla / IBGE (CNAE 2.0 / 2.3)
 * Suporte completo aos 5 NÍVEIS oficiais do IBGE:
 * - Nível 1: Seção (1 letra: A a U, 21 seções)
 * - Nível 2: Divisão (2 dígitos: 01 a 99, 87 divisões)
 * - Nível 3: Grupo (3 dígitos: DD.G, 285 grupos)
 * - Nível 4: Classe (4 dígitos + 1 verificador: DD.GG-D, 673 classes)
 * - Nível 5: Subclasse (7 dígitos: DD.GG-D/SS, 1.301 subclasses)
 */

export interface CnaeSectionInfo {
  letra: string;
  nome: string;
  divisoes: [number, number]; // range [min, max]
}

export const CNAE_SECTIONS: CnaeSectionInfo[] = [
  { letra: 'A', nome: 'A - Agricultura, Pecuária, Florestal e Pesca', divisoes: [1, 3] },
  { letra: 'B', nome: 'B - Indústrias Extrativas (Mineração/Petróleo)', divisoes: [5, 9] },
  { letra: 'C', nome: 'C - Indústrias de Transformação (Manufatura/Metalurgia)', divisoes: [10, 33] },
  { letra: 'D', nome: 'D - Eletricidade e Gás (Energia)', divisoes: [35, 35] },
  { letra: 'E', nome: 'E - Água, Esgoto, Gestão de Resíduos', divisoes: [36, 39] },
  { letra: 'F', nome: 'F - Construção Civil e Engenharia Pesada', divisoes: [41, 43] },
  { letra: 'G', nome: 'G - Comércio Atacadista, Varejista e Peças', divisoes: [45, 47] },
  { letra: 'H', nome: 'H - Transporte, Logística e Armazenagem', divisoes: [49, 53] },
  { letra: 'I', nome: 'I - Alojamento e Alimentação', divisoes: [55, 56] },
  { letra: 'J', nome: 'J - Informação, Software e Telecomunicações', divisoes: [58, 63] },
  { letra: 'K', nome: 'K - Atividades Financeiras e Seguros', divisoes: [64, 66] },
  { letra: 'L', nome: 'L - Atividades Imobiliárias', divisoes: [68, 68] },
  { letra: 'M', nome: 'M - Atividades Profissionais, Científicas e Técnicas', divisoes: [69, 75] },
  { letra: 'N', nome: 'N - Serviços Administrativos e Apoio Operacional', divisoes: [77, 82] },
  { letra: 'O', nome: 'O - Administração Pública e Seguridade', divisoes: [84, 84] },
  { letra: 'P', nome: 'P - Educação e Capacitação', divisoes: [85, 85] },
  { letra: 'Q', nome: 'Q - Saúde Humana e Equipamentos Médicos', divisoes: [86, 88] },
  { letra: 'R', nome: 'R - Artes, Cultura, Esporte e Lazer', divisoes: [90, 93] },
  { letra: 'S', nome: 'S - Outras Atividades de Serviços Industriais e Pessoais', divisoes: [94, 96] },
  { letra: 'T', nome: 'T - Serviços Domésticos', divisoes: [97, 97] },
  { letra: 'U', nome: 'U - Organismos Internacionais e Outras Instituições Extraterritoriais', divisoes: [99, 99] },
];

export const CNAE_DIVISIONS_NAMES: Record<number, string> = {
  1: 'Agricultura, pecuária e serviços relacionados',
  2: 'Produção florestal e silvicultura',
  3: 'Pesca e aqüicultura',
  5: 'Extração de carvão mineral',
  6: 'Extração de petróleo e gás natural',
  7: 'Extração de minerais metálicos (Ferro, Ouro, Bauxita)',
  8: 'Extração de minerais não-metálicos (Calcário, Areia, Argila)',
  9: 'Atividades de apoio à extração de minerais e petróleo',
  10: 'Fabricação de produtos alimentícios',
  11: 'Fabricação de bebidas',
  12: 'Fabricação de produtos do fumo',
  13: 'Fabricação de produtos têxteis',
  14: 'Confecção de artigos do vestuário e acessórios',
  15: 'Preparação de couros e fabricação de calçados',
  16: 'Fabricação de produtos de madeira',
  17: 'Fabricação de celulose, papel e produtos de papel',
  18: 'Impressão e reprodução de gravações',
  19: 'Fabricação de coque, derivados do petróleo e biocombustíveis',
  20: 'Fabricação de produtos químicos',
  21: 'Fabricação de produtos farmoquímicos e farmacêuticos',
  22: 'Fabricação de produtos de borracha e material plástico',
  23: 'Fabricação de produtos de minerais não-metálicos (Cimento/Vidro/Cerâmica)',
  24: 'Metalurgia (Siderurgia, Laminação e Fundição)',
  25: 'Fabricação de produtos de metal, usinagem e caldeiraria pesada',
  26: 'Fabricação de equipamentos de informática, eletrônicos e ópticos',
  27: 'Fabricação de máquinas, aparelhos e materiais elétricos (Motores/Transformadores)',
  28: 'Fabricação de máquinas e equipamentos mecânicos (Bombas/Compressores)',
  29: 'Fabricação de veículos automotores, reboques e carrocerias',
  30: 'Fabricação de outros equipamentos de transporte (Aeroespacial/Naval/Ferroviário)',
  31: 'Fabricação de móveis',
  32: 'Fabricação de produtos diversos (Instrumentos médicos/Ópticos)',
  33: 'Manutenção, reparação e instalação de máquinas e equipamentos',
  35: 'Eletricidade, gás e outras utilidades (Geração e Transmissão)',
  36: 'Captação, tratamento e distribuição de água',
  37: 'Esgoto e atividades relacionadas',
  38: 'Coleta, tratamento e disposição de resíduos; recuperação de materiais',
  39: 'Descontaminação e outros serviços de gestão de resíduos',
  41: 'Construção de edifícios e incorporação',
  42: 'Obras de infra-estrutura e engenharia pesada (Rodovias/Portos)',
  43: 'Serviços especializados para construção (Fundações/Instalações)',
  45: 'Comércio e reparação de veículos automotores e motocicletas',
  46: 'Comércio atacadista, exceto veículos automotores',
  47: 'Comércio varejista',
  49: 'Transporte terrestre (Rodoviário/Ferroviário de cargas)',
  50: 'Transporte aquaviário e navegação marítima/fluvial',
  51: 'Transporte aéreo de cargas e passageiros',
  52: 'Armazenamento e atividades auxiliares dos transportes (Portos/Logística)',
  53: 'Correio e outras atividades de entrega rápida',
  55: 'Alojamento e hotéis corporativos',
  56: 'Alimentação e restaurantes industriais',
  58: 'Edição e edição integrada à impressão',
  59: 'Atividades cinematográficas e gravação de som',
  60: 'Atividades de rádio e de televisão',
  61: 'Telecomunicações e conectividade',
  62: 'Atividades dos serviços de tecnologia da informação (Software/SaaS/Cloud)',
  63: 'Atividades de prestação de serviços de informação e data centers',
  64: 'Atividades de serviços financeiros e bancos',
  65: 'Seguros, resseguros e previdência complementar',
  66: 'Atividades auxiliares dos serviços financeiros e seguros',
  68: 'Atividades imobiliárias, galpões e condomínios logísticos',
  69: 'Atividades jurídicas, de contabilidade e de auditoria',
  70: 'Atividades de sedes de empresas e consultoria em gestão',
  71: 'Serviços de arquitetura e engenharia; testes e análises técnicas laboratoriais',
  72: 'Pesquisa e desenvolvimento científico',
  73: 'Publicidade e pesquisa de mercado',
  74: 'Outras atividades profissionais, científicas e técnicas',
  75: 'Atividades veterinárias',
  77: 'Locação de meios de transporte, máquinas e frotas de equipamentos',
  78: 'Seleção, agenciamento e locação de mão-de-obra',
  79: 'Agências de viagens e operadores de mobilidade corporativa',
  80: 'Atividades de vigilância, segurança e investigação patrimonial',
  81: 'Serviços para edifícios e atividades paisagísticas (Facilities)',
  82: 'Serviços de escritório, apoio administrativo e outros serviços corporativos',
  84: 'Administração pública, defesa e seguridade social',
  85: 'Educação e treinamento técnico profissional',
  86: 'Atividades de atenção à saúde humana e hospitalar',
  87: 'Atividades de atenção à saúde integrada com assistência social',
  88: 'Serviços de assistência social sem alojamento',
  90: 'Atividades artísticas, criativas e de espetáculos',
  91: 'Atividades ligadas ao patrimônio cultural e ambiental',
  92: 'Atividades de exploração de jogos de azar e apostas',
  93: 'Atividades esportivas e de recreação e lazer',
  94: 'Atividades de organizações associativas patronais e sindicais',
  95: 'Reparação e manutenção de computadores e objetos pessoais',
  96: 'Outras atividades de serviços pessoais',
  97: 'Serviços domésticos',
  99: 'Organismos internacionais e outras instituições extraterritoriais',
};

/**
 * Catálogo Oficial IBGE Concla dos Grupos CNAE (Nível 3 - 3 dígitos: DD.G)
 */
export const CNAE_GROUPS_NAMES: Record<string, string> = {
  // Divisão 01
  '01.1': 'Produção de lavouras temporárias (Grãos, Soja, Milho)',
  '01.2': 'Produção de lavouras permanentes (Café, Fruticultura)',
  '01.3': 'Produção de sementes e mudas certificadas',
  '01.4': 'Criação de animais e pecuária intensiva',
  '01.5': 'Produção mista (lavoura e pecuária)',
  '01.6': 'Atividades de apoio à agricultura e pós-colheita',
  // Divisão 02 e 03
  '02.1': 'Silvicultura e cultivo de florestas nativas e plantadas (Eucalipto/Píus)',
  '02.2': 'Extração de madeira em florestas plantadas',
  '03.1': 'Pesca em água doce e marinha',
  '03.2': 'Aqüicultura e piscicultura',
  // Divisão 05 a 09 (Mineração)
  '05.0': 'Extração de carvão mineral',
  '06.0': 'Extração de petróleo e gás natural',
  '07.1': 'Extração de minério de ferro',
  '07.2': 'Extração de minerais metálicos não-ferrosos (Alumínio, Cobre, Ouro)',
  '08.1': 'Extração de pedra, areia, brita e argila',
  '08.9': 'Extração de outros minerais não-metálicos (Calcário, Fosfato)',
  '09.1': 'Atividades de apoio à extração de petróleo e gás',
  '09.9': 'Atividades de apoio à extração de minerais',
  // Divisão 10 (Alimentos)
  '10.1': 'Abate e frigoríficos de carnes bovinas, suínas e aves',
  '10.2': 'Preservação do pescado e conservas',
  '10.3': 'Conservas de frutas, legumes e vegetais',
  '10.4': 'Fabricação de óleos vegetais, gorduras e refino',
  '10.5': 'Laticínios e beneficiamento de leite',
  '10.6': 'Moagem de trigo, milho e amidos industriais',
  '10.7': 'Fabricação e refino de açúcar',
  '10.8': 'Torrefação e moagem de café',
  '10.9': 'Fabricação de outros produtos alimentícios e rações',
  // Divisão 11 e 12 (Bebidas e Fumo)
  '11.1': 'Fabricação de bebidas alcoólicas (Destilados e Cervejarias)',
  '11.2': 'Fabricação de bebidas não-alcoólicas e águas minerais',
  '12.1': 'Processamento industrial do fumo',
  '12.2': 'Fabricação de produtos do fumo',
  // Divisão 13 a 16 (Têxtil, Vestuário, Calçados, Madeira)
  '13.1': 'Preparação e fiação de fibras têxteis',
  '13.2': 'Tecelagem de fios',
  '13.3': 'Acabamento de tecidos e fios',
  '13.4': 'Fabricação de tecidos e artigos técnicos de malha',
  '13.5': 'Fabricação de artefatos têxteis industriais (Cordas/Toldos/Sacos)',
  '14.1': 'Confecção de artigos de vestuário e uniformes profissionais',
  '14.2': 'Fabricação de meias e acessórios de vestuário',
  '15.1': 'Curtimento e preparação de couros (Curtumes)',
  '15.2': 'Fabricação de artigos para viagem e bolsas de couro',
  '15.3': 'Fabricação de calçados de couro, plástico e borracha (EPIs)',
  '16.1': 'Desdobramento de madeira e serrarias',
  '16.2': 'Fabricação de compensados, laminados e estruturas de madeira',
  // Divisão 17 e 18 (Papel, Celulose e Gráfica)
  '17.1': 'Fabricação de celulose e pastas mecânicas',
  '17.2': 'Fabricação de papel, papel-cartão e cartolina',
  '17.3': 'Fabricação de embalagens de papelão ondulado e cartolina',
  '17.4': 'Fabricação de produtos diversos de papel e papelão',
  '18.1': 'Impressão de jornais, livros, revistas e formulários de segurança',
  '18.2': 'Serviços de pré-impressão e acabamentos gráficos',
  '18.3': 'Reprodução de gravações sonoras e ópticas',
  // Divisão 19 e 20 (Petróleo, Químicos e Biocombustíveis)
  '19.1': 'Coquerias industriais',
  '19.2': 'Refino de petróleo e produção de asfalto',
  '19.3': 'Fabricação de biocombustíveis (Etanol e Biodiesel)',
  '20.1': 'Fabricação de produtos químicos inorgânicos e orgânicos básicos (Gases industriais/Ácidos)',
  '20.2': 'Fabricação de resinas termoplásticas, polímeros e elastômeros',
  '20.3': 'Fabricação de fibras artificiais e sintéticas',
  '20.4': 'Defensivos agrícolas, pesticidas e desinfetantes',
  '20.5': 'Fabricação de sabões, detergentes industriais e cosméticos',
  '20.6': 'Fabricação de tintas, vernizes, esmaltes industriais e solventes',
  '20.7': 'Fabricação de adesivos, selantes e impermeabilizantes',
  '20.9': 'Fabricação de produtos e preparados químicos industriais diversos',
  // Divisão 21 (Farmacêutica)
  '21.1': 'Fabricação de farmoquímicos e princípios ativos',
  '21.2': 'Fabricação de medicamentos e preparações farmacêuticas',
  // Divisão 22 (Borracha e Plástico)
  '22.1': 'Fabricação de produtos de borracha (Pneus, correias, mangueiras)',
  '22.2': 'Fabricação de embalagens plásticas, tubos, conexões e laminados',
  // Divisão 23 (Minerais não-metálicos)
  '23.1': 'Fabricação de vidro plano, garrafas e fibra de vidro',
  '23.2': 'Fabricação de cimento portland e clínquer',
  '23.3': 'Fabricação de artefatos de concreto, cimento e premoldados',
  '23.4': 'Fabricação de produtos cerâmicos refratários e revestimentos',
  '23.9': 'Aparelhamento de pedras e minerais não-metálicos',
  // Divisão 24 (Metalurgia e Siderurgia)
  '24.1': 'Produção de ferro-gusa e de ferroligas',
  '24.2': 'Siderurgia e laminação de aços planos e longos',
  '24.3': 'Produção de tubos de aço sem costura e com costura',
  '24.4': 'Metalurgia dos metais não-ferrosos (Alumínio, Cobre, Zinco)',
  '24.5': 'Fundição de ferro, aço e metais não-ferrosos',
  // Divisão 25 (Produtos de Metal, Caldeiraria, Usinagem)
  '25.1': 'Fabricação de estruturas metálicas para galpões e pontes',
  '25.2': 'Fabricação de tanques, reservatórios industriais e caldeiras geradoras de vapor',
  '25.3': 'Forjaria, estamparia, usinagem, tornearia, solda e caldeiraria leve',
  '25.4': 'Fabricação de artigos de cutelaria, ferramentas e serralheria',
  '25.5': 'Fabricação de equipamento bélico pesado e armas',
  '25.9': 'Fabricação de parafusos, porcas, fixadores, molas e trefilados',
  // Divisão 26 (Eletrônica e Computação)
  '26.1': 'Fabricação de componentes eletrônicos e semicondutores',
  '26.2': 'Fabricação de computadores e periféricos industriais',
  '26.3': 'Fabricação de equipamentos de telecomunicação e transmissão',
  '26.4': 'Fabricação de aparelhos de áudio e vídeo',
  '26.5': 'Aparelhos de medição, teste, automação industrial e controle',
  '26.6': 'Equipamentos eletromédicos e eletroterapêuticos',
  '26.7': 'Instrumentos ópticos e equipamentos fotográficos',
  // Divisão 27 (Equipamentos Elétricos)
  '27.1': 'Fabricação de geradores, transformadores e motores elétricos',
  '27.2': 'Fabricação de pilhas, acumuladores e baterias para veículos',
  '27.3': 'Fabricação de cabos, fios e condutores elétricos isolados',
  '27.4': 'Fabricação de lâmpadas e luminárias de LED industriais',
  '27.5': 'Fabricação de eletrodomésticos e utilidades',
  '27.9': 'Fabricação de painéis elétricos, barramentos e aparelhos de comutação',
  // Divisão 28 (Máquinas e Equipamentos Mecânicos)
  '28.1': 'Motores, compressores, bombas hidráulicas e redutores',
  '28.2': 'Máquinas para elevação de carga (Pontes rolantes, guindastes, empilhadeiras)',
  '28.3': 'Tratores e máquinas agrícolas e colheitadeiras',
  '28.4': 'Máquinas-ferramenta, centros de usinagem e tornos CNC',
  '28.5': 'Máquinas para prospecção, extração mineral e construção pesada',
  '28.6': 'Máquinas e equipamentos de uso industrial específico (Embaladoras/Têxtil)',
  // Divisão 29 e 30 (Veículos e Transportes)
  '29.1': 'Montagem de automóveis, camionetas e utilitários',
  '29.2': 'Fabricação de caminhões e ônibus',
  '29.3': 'Fabricação de cabines, carrocerias, carretas e reboques',
  '29.4': 'Fabricação de peças e autopeças automotivas (Sistemas de freio/motor)',
  '29.5': 'Recondicionamento e remanufatura de motores automotivos',
  '30.1': 'Construção naval e reparação de embarcações e plataformas offshore',
  '30.2': 'Fabricação de locomotivas, vagões e material rodante ferroviário',
  '30.3': 'Construção aeroespacial e de aeronaves civis e militares',
  '30.4': 'Fabricação de veículos militares de combate',
  '30.9': 'Fabricação de outros equipamentos de transporte (Bicicletas/Motos)',
  // Divisão 31, 32 e 33 (Móveis, Diversos e Manutenção Industrial)
  '31.0': 'Fabricação de móveis corporativos e estruturas sob medida',
  '32.1': 'Lapidação e joalheria industrial',
  '32.2': 'Instrumentos musicais',
  '32.3': 'Artigos de esporte e recreação',
  '32.4': 'Brinquedos e jogos',
  '32.5': 'Materiais para uso médico, odontológico e próteses',
  '32.9': 'Fabricação de produtos diversos e EPIs industriais',
  '33.1': 'Manutenção e reparação de máquinas industriais e caldeiras',
  '33.2': 'Instalação e comissionamento de maquinário e linhas de montagem',
  // Divisão 35 a 39 (Energia, Água, Resíduos e Saneamento)
  '35.1': 'Geração, transmissão e distribuição de energia elétrica (Subestações)',
  '35.2': 'Produção e distribuição de gás encanado e biometano',
  '35.3': 'Produção e distribuição de vapor, água quente e ar condicionado',
  '36.0': 'Captação, tratamento e adução de água potável',
  '37.0': 'Coleta, redes de esgoto e tratamento de efluentes sanitários e industriais',
  '38.1': 'Coleta de resíduos industriais perigosos e não-perigosos',
  '38.2': 'Tratamento térmico, incineração e disposição final de resíduos (Aterros)',
  '38.3': 'Recuperação de materiais metálicos, plásticos e sucatas (Reciclagem)',
  '39.0': 'Descontaminação ambiental e remediação de solos contaminados',
  // Divisão 41 a 43 (Construção Civil e Engenharia)
  '41.1': 'Incorporação imobiliária e gestão de loteamentos',
  '41.2': 'Construção de edifícios, galpões logísticos e plantas fabris',
  '42.1': 'Construção de rodovias, ferrovias, viadutos e pontes',
  '42.2': 'Obras de redes elétricas, telecomunicações e saneamento',
  '42.9': 'Obras de dragagem, portuárias, barragens e terraplenagem pesada',
  '43.1': 'Demolição, terraplenagem e sondagem de terreno',
  '43.2': 'Instalações elétricas de alta tensão, hidráulicas e climatização industrial',
  '43.3': 'Obras de acabamento, pintura industrial e gesso',
  '43.9': 'Montagem de estruturas metálicas e serviços especializados de construção',
  // Divisão 45 (Veículos e Peças)
  '45.1': 'Comércio atacadista e concessionárias de veículos pesados e leves',
  '45.2': 'Manutenção mecânica e elétrica de frotas de veículos e caminhões',
  '45.3': 'Comércio atacadista e distribuição de autopeças e acessórios',
  '45.4': 'Comércio e manutenção de motocicletas e quadriciclos',
  // Divisão 46 (Comércio Atacadista)
  '46.1': 'Representantes comerciais e corretores de insumos industriais',
  '46.2': 'Comércio atacadista de soja, grãos, café e matérias-primas agro',
  '46.3': 'Comércio atacadista de alimentos processados e bebidas em grande escala',
  '46.4': 'Comércio atacadista de itens de consumo e farmacêuticos',
  '46.5': 'Comércio atacadista de computadores, servidores e periféricos de TI',
  '46.6': 'Comércio atacadista de máquinas, motores e equipamentos industriais',
  '46.7': 'Comércio atacadista de aço, ferragens, tintas e materiais de construção',
  '46.8': 'Comércio atacadista de químicos a granel, solventes e combustíveis',
  '46.9': 'Comércio atacadista de mercadorias em geral para indústrias',
  // Divisão 47 (Comércio Varejista)
  '47.1': 'Comércio varejista em hipermercados e atacarejos',
  '47.2': 'Comércio varejista de alimentos especializados',
  '47.3': 'Comércio varejista de combustíveis para veículos (Postos)',
  '47.4': 'Comércio varejista de material de construção e ferragens',
  '47.5': 'Comércio varejista de equipamentos de informática e comunicação',
  '47.9': 'Comércio varejista não realizado em lojas (E-commerce / B2B online)',
  // Divisão 49 a 53 (Transporte e Logística)
  '49.1': 'Transporte ferroviário de cargas (Minério, grãos e contêineres)',
  '49.2': 'Transporte rodoviário de passageiros e fretamento corporativo',
  '49.3': 'Transporte rodoviário de carga geral e cargas perigosas',
  '49.4': 'Transporte dutoviário de óleo, gás e minério',
  '50.1': 'Navegação marítima de cabotagem e longo curso',
  '50.2': 'Navegação interior e transporte hidroviário de barcaças',
  '50.3': 'Navegação de apoio marítimo offshore e portuário (Rebocadores)',
  '51.1': 'Transporte aéreo regular de passageiros',
  '51.2': 'Transporte aéreo de cargas e frete aéreo expresso',
  '52.1': 'Armazenagem geral, galpões refrigerados e centros de distribuição',
  '52.2': 'Operação de terminais rodoviários, ferroviários e pátios logísticos',
  '52.3': 'Operações portuárias, atracação e estiva em terminais marítimos',
  '52.4': 'Operações auxiliares aeroportuárias e handling de aeronaves',
  '52.5': 'Operadores logísticos integrados, despachantes aduaneiros e frete',
  '53.1': 'Atividades de correio e logística postal',
  '53.2': 'Serviços de entrega rápida e couriers corporativos',
  // Divisão 55 e 56 (Hospitalidade e Alimentação)
  '55.1': 'Hotéis executivos e resorts para eventos corporativos',
  '55.9': 'Outros tipos de alojamento',
  '56.1': 'Restaurantes industriais e serviços de alimentação corporativa',
  '56.2': 'Buffets, catering e fornecimento de refeições coletivas',
  // Divisão 58 a 63 (Tecnologia, Telecom e Mídia)
  '58.1': 'Edição de livros, apostilas técnicas e manuais',
  '58.2': 'Edição e licenciamento de softwares corporativos e jogos',
  '59.1': 'Produção de vídeos institucionais e publicidade',
  '60.1': 'Emissoras de rádio',
  '60.2': 'Emissoras de televisão e streaming',
  '61.1': 'Telecomunicações por fio (Fibra óptica e redes fixas)',
  '61.2': 'Telecomunicações sem fio (Redes móveis 4G/5G)',
  '61.3': 'Telecomunicações por satélite',
  '61.9': 'Operadoras virtuais e provedores de internet (ISP)',
  '62.0': 'Desenvolvimento de software sob medida, consultoria em TI e SaaS',
  '63.1': 'Tratamento de dados, provedores de cloud, hospedagem e Data Centers',
  '63.9': 'Portais de internet e agências de notícias técnicas',
  // Divisão 64 a 66 (Financeiro, Seguros e Fintechs)
  '64.1': 'Bancos comerciais e caixas econômicas',
  '64.2': 'Cooperativas de crédito e bancos de desenvolvimento',
  '64.3': 'Fundos de investimento e sociedades de capital de risco (Venture Capital)',
  '64.9': 'Fintechs, securitizadoras de crédito e fomento mercantil (Factoring)',
  '65.1': 'Seguros de vida, patrimoniais e riscos de engenharia',
  '65.2': 'Seguros de saúde e planos odontológicos',
  '65.3': 'Previdência complementar fechada e aberta',
  '66.1': 'Corretoras de títulos, valores mobiliários e câmbio',
  '66.2': 'Corretagem de seguros de frotas e riscos industriais',
  // Divisão 68 a 75 (Serviços Corporativos, Engenharia, Consultoria)
  '68.1': 'Compra, venda e incorporação de imóveis próprios',
  '68.2': 'Gestão e locação de galpões logísticos e lajes corporativas',
  '69.1': 'Atividades jurídicas, advocacia corporativa e compliance',
  '69.2': 'Auditoria independente, contabilidade societária e perícia contábil',
  '70.1': 'Sedes de empresas e holdings controladoras',
  '70.2': 'Consultoria em gestão estratégica e reorganização empresarial',
  '71.1': 'Serviços de arquitetura, engenharia consultiva e projetos',
  '71.2': 'Ensaios metrológicos, calibração e testes de qualidade laboratorial',
  '72.1': 'Pesquisa e desenvolvimento em ciências físicas e biotecnologia',
  '72.2': 'Pesquisa em ciências sociais e humanas',
  '73.1': 'Agências de publicidade, marketing digital e branding',
  '73.2': 'Pesquisas de mercado e opinião pública',
  '74.1': 'Design industrial e design de produtos',
  '74.2': 'Fotografia aérea, mapeamento com drones e topografia',
  '74.9': 'Consultorias técnicas e vistorias periciais especializadas',
  '75.0': 'Serviços veterinários e controle de pragas sanitárias',
  // Divisão 77 a 82 (Facilities, Locação, Segurança e Mão de Obra)
  '77.1': 'Locação de automóveis e frotas executivas terceirizadas',
  '77.2': 'Locação de objetos pessoais e domésticos',
  '77.3': 'Locação de máquinas pesadas, guindastes e plataformas elevatórias',
  '77.4': 'Gestão de propriedade intelectual e royalties',
  '78.1': 'Recrutamento, seleção e headhunting de talentos',
  '78.2': 'Terceirização de trabalho temporário especializado',
  '78.3': 'Gestão integrada de folha e fornecimento de recursos humanos',
  '79.1': 'Agências de viagens corporativas e emissão de passagens',
  '79.9': 'Organização de congressos e feiras de negócios',
  '80.1': 'Vigilância armada e segurança patrimonial privada',
  '80.2': 'Sistemas de monitoramento eletrônico e controle de acesso',
  '80.3': 'Investigação privada e auditoria antifraude',
  '81.1': 'Serviços combinados de facilities e zeladoria predial',
  '81.2': 'Limpeza técnica industrial, hospitalar e asseio predial',
  '81.3': 'Paisagismo, manutenção de jardins e áreas verdes fabris',
  '82.1': 'Serviços de apoio administrativo e faturamento',
  '82.2': 'Atividades de teleatendimento (Contact Centers e SAC)',
  '82.3': 'Organização de feiras, congressos, exposições e eventos B2B',
  '82.9': 'Outros serviços de cobrança, empacotamento e logística de escritório',
  // Divisão 84 a 99 (Educação, Saúde e Outros Serviços)
  '84.1': 'Administração do estado e políticas públicas',
  '84.2': 'Segurança pública, relações exteriores e justiça',
  '85.1': 'Educação infantil e fundamental',
  '85.2': 'Ensino médio e formação profissional',
  '85.3': 'Ensino superior (Graduação e pós-graduação)',
  '85.4': 'Educação profissional de nível técnico (SENAI/SENAC)',
  '85.9': 'Cursos de capacitação gerencial, idiomas e treinamentos',
  '86.1': 'Hospitais gerais e maternidades',
  '86.2': 'Serviços de remoção em ambulâncias e resgate UTI móvel',
  '86.3': 'Clínicas médicas e consultórios ambulatoriais',
  '86.4': 'Laboratórios de análises clínicas e diagnóstico por imagem',
  '86.5': 'Fisioterapia, fonoaudiologia e nutrição corporativa',
  '86.6': 'Atividades de apoio à gestão de saúde ocupacional (PCMSO/PGR)',
  '90.0': 'Atividades teatrais, shows e produção cultural',
  '91.0': 'Museus, jardins botânicos e zoológicos',
  '92.0': 'Loterias e apostas oficiais',
  '93.1': 'Clubes e gestão de instalações esportivas',
  '93.2': 'Parques temáticos e recreação',
  '94.1': 'Organizações associativas empresariais (FIEP, CNI, Fecomercio)',
  '94.2': 'Sindicatos de trabalhadores e patronais',
  '94.9': 'Entidades filantrópicas e ONGs',
  '95.1': 'Manutenção de computadores, impressoras e servidores',
  '95.2': 'Reparação de eletroeletrônicos e artigos industriais',
  '96.0': 'Lavanderias industriais e tinturarias para EPIs',
  '97.0': 'Serviços domésticos',
  '99.0': 'Organismos internacionais, embaixadas e consulados',
};

/**
 * Catálogo Oficial IBGE Concla das principais Classes CNAE (Nível 4 - 4 dígitos + DV: DD.GG-D)
 */
export const CNAE_CLASSES_NAMES: Record<string, string> = {
  // Divisão 01
  '01.11-3': 'Cultivo de cereais (Soja, Milho, Trigo, Arroz)',
  '01.12-1': 'Cultivo de algodão herbáceo e fibras',
  '01.13-0': 'Cultivo de cana-de-açúcar',
  '01.21-1': 'Cultivo de café e cacau',
  '01.22-9': 'Cultivo de citros (Laranja, Limão)',
  '01.61-0': 'Serviços de pulverização, plantio e colheita agrícola',
  // Divisão 07 e 08
  '07.10-3': 'Extração de minério de ferro pelotizado e sinterizado',
  '07.24-3': 'Extração de minério de cobre e níquel',
  '07.29-4': 'Extração de outros minerais metálicos preciosos (Ouro/Prata)',
  '08.10-0': 'Extração de pedra britada, areia e cascalho para construção',
  '09.10-6': 'Atividades de perfuração e apoio à extração de petróleo',
  // Divisão 10
  '10.11-2': 'Frigoríficos e abate de reses (Bovinos e Equinos)',
  '10.12-1': 'Abate de aves e pequenos animais',
  '10.13-9': 'Fabricação de embutidos, linguiças e presuntos',
  '10.41-4': 'Fabricação de óleos vegetais em bruto e refino',
  '10.51-6': 'Laticínios, queijos e derivados de leite',
  '10.61-9': 'Beneficiamento de grãos e fabricação de farinhas',
  '10.71-6': 'Fabricação de açúcar em bruto e refinado',
  '10.91-1': 'Fabricação de produtos de panificação industrial',
  // Divisão 17 (Papel e Celulose)
  '17.10-9': 'Fabricação de celulose solúvel e pastas de madeira',
  '17.21-4': 'Fabricação de papel e cartolina para embalagens',
  '17.31-1': 'Fabricação de embalagens de papelão ondulado',
  '17.41-9': 'Fabricação de formulários e artefatos de papel',
  // Divisão 19 e 20 (Petróleo, Químicos)
  '19.21-7': 'Refino de petróleo (Gasolina, Diesel, GLP, Asfalto)',
  '19.31-4': 'Fabricação de álcool combustível (Etanol hidratado/anidro)',
  '20.11-8': 'Fabricação de cloro, álcalis e gases industriais comprimidos',
  '20.14-2': 'Fabricação de produtos químicos orgânicos básicos',
  '20.21-5': 'Fabricação de resinas plásticas virgens e recicladas',
  '20.40-1': 'Fabricação de defensivos agrícolas e agroquímicos',
  '20.51-7': 'Fabricação de sabões, detergentes e tensoativos industriais',
  '20.61-4': 'Fabricação de sabões e desengraxantes pesados',
  '20.71-1': 'Fabricação de tintas, vernizes, esmaltes e resinas epóxi',
  '20.73-8': 'Fabricação de impermeabilizantes e adesivos sintéticos',
  '20.91-6': 'Fabricação de adesivos e colas industriais',
  // Divisão 21 (Farmacêutica)
  '21.10-6': 'Fabricação de farmoquímicos e princípios ativos antibióticos',
  '21.21-1': 'Fabricação de medicamentos para uso humano',
  '21.23-8': 'Fabricação de vacinas e soros biológicos',
  // Divisão 22 (Borracha e Plástico)
  '22.11-2': 'Fabricação de pneus e câmaras de ar para veículos pesados',
  '22.19-8': 'Fabricação de artefatos de borracha técnica (Correias/Retentores)',
  '22.21-8': 'Fabricação de tubos, conexões e laminados plásticos rígidos',
  '22.22-6': 'Fabricação de embalagens de material plástico (Frascos/Tampas)',
  '22.29-3': 'Fabricação de peças plásticas injetadas para indústrias',
  // Divisão 23 (Minerais não-metálicos)
  '23.11-7': 'Fabricação de vidro plano laminado e temperado',
  '23.20-6': 'Fabricação de cimento portland e ligantes hidráulicos',
  '23.30-3': 'Fabricação de estruturas de concreto armado e postes premoldados',
  '23.42-7': 'Fabricação de cerâmica refratária e tijolos especiais',
  // Divisão 24 (Metalurgia e Siderurgia)
  '24.11-3': 'Produção de ferro-gusa em alto-forno',
  '24.21-1': 'Produção de semi-acabados de aço (Tarugos, Placas, Blocos)',
  '24.22-9': 'Laminação de aços planos a quente e a frio',
  '24.23-7': 'Produção de laminados longos de aço (Vergalhões, Vigas)',
  '24.31-8': 'Produção de tubos de aço sem costura de grande diâmetro',
  '24.41-5': 'Metalurgia do alumínio e suas ligas primárias',
  '24.51-2': 'Fundição de peças de ferro e aço fundido nodular',
  // Divisão 25 (Produtos de Metal, Caldeiraria, Usinagem)
  '25.11-0': 'Fabricação de estruturas metálicas para pontes e galpões',
  '25.12-8': 'Fabricação de esquadrias metálicas e portões industriais',
  '25.13-6': 'Fabricação de obras de caldeiraria pesada (Vasos de pressão/Dutos)',
  '25.21-7': 'Fabricação de tanques, reservatórios de aço e caldeiras a vapor',
  '25.31-4': 'Produção de forjados de aço e matrizes industriais',
  '25.32-2': 'Produção de artefatos estampados de metal',
  '25.39-0': 'Serviços de usinagem, tornearia, fresamento, solda e tratamento térmico',
  '25.40-4': 'Fabricação de artigos de cutelaria e ferramentas manuais de corte',
  '25.92-6': 'Fabricação de trefilados de aço, arames e molas industriais',
  '25.93-4': 'Fabricação de artigos de funilaria e recipientes metálicos',
  '25.99-3': 'Fabricação de parafusos, porcas, arruelas e fixadores industriais',
  // Divisão 26 (Eletrônica e Automação)
  '26.10-8': 'Fabricação de placas de circuito impresso e semicondutores',
  '26.21-3': 'Fabricação de computadores, nobreaks e servidores de rede',
  '26.31-1': 'Fabricação de rádios transmissores e equipamentos de telecom',
  '26.51-5': 'Instrumentos de controle de processos industriais e sensores digitais',
  // Divisão 27 (Máquinas Elétricas)
  '27.10-4': 'Fabricação de geradores elétricos, transformadores e motores de grande porte',
  '27.21-0': 'Fabricação de baterias tracionárias e acumuladores chumbo-ácido',
  '27.31-7': 'Fabricação de painéis elétricos, disjuntores e quadros de comando',
  '27.32-5': 'Fabricação de fios, cabos e chicotes elétricos industriais',
  '27.40-6': 'Fabricação de luminárias industriais de alta eficiência',
  // Divisão 28 (Máquinas Mecânicas)
  '28.11-9': 'Fabricação de turbinas a vapor, a gás e motores industriais',
  '28.12-7': 'Fabricação de bombas hidráulicas, válvulas e cilindros pneumáticos',
  '28.13-5': 'Fabricação de registros industriais e flanges de alta pressão',
  '28.14-3': 'Fabricação de compressores de ar tipo parafuso e bombas centrífugas',
  '28.22-4': 'Fabricação de pontes rolantes, talhas elétricas e empilhadeiras',
  '28.31-3': 'Fabricação de tratores e implementos agrícolas de preparo do solo',
  '28.40-2': 'Fabricação de máquinas-ferramenta, centros CNC e tornos mecânicos',
  '28.51-8': 'Fabricação de britadores, moinhos e máquinas de mineração',
  '28.69-1': 'Fabricação de máquinas e equipamentos para a indústria química',
  // Divisão 29 e 30 (Veículos e Transportes)
  '29.10-7': 'Fabricação de automóveis e veículos utilitários comerciais',
  '29.20-4': 'Fabricação de chassis e montagem de caminhões e cavalos-mecânicos',
  '29.30-1': 'Fabricação de carrocerias, caçambas basculantes e carretas',
  '29.41-7': 'Fabricação de sistemas de freios, discos e pastilhas para caminhões',
  '29.42-5': 'Fabricação de caixas de transmissão e eixos cardan',
  '30.11-3': 'Construção de embarcações de grande porte (Graneleiros/Petroleiros)',
  '30.31-8': 'Fabricação de aeronaves e jatos executivos',
  // Divisão 33 (Manutenção Industrial)
  '33.11-2': 'Manutenção e reforma de tanques, reservatórios e caldeiras',
  '33.14-7': 'Manutenção preventiva e corretiva de máquinas e equipamentos mecânicos',
  '33.21-0': 'Instalação eletromecânica de plantas e maquinários industriais',
  // Divisão 35 (Energia)
  '35.11-5': 'Geração de energia elétrica hidrelétrica, solar e eólica',
  '35.12-3': 'Transmissão de energia elétrica em alta tensão',
  '35.13-1': 'Distribuição de energia elétrica industrial e comercial',
  // Divisão 38 (Resíduos)
  '38.11-4': 'Coleta de resíduos sólidos não-perigosos',
  '38.12-2': 'Coleta e destinação de resíduos perigosos industriais (Classe I)',
  '38.31-9': 'Recuperação e reciclagem de sucatas de ferro e aço',
  // Divisão 41 e 42 (Construção)
  '41.20-4': 'Construção de edifícios residenciais, comerciais e galpões logísticos',
  '42.11-1': 'Pavimentação asfáltica de rodovias e vias urbanas',
  '42.21-9': 'Construção de barragens, usinas hidrelétricas e redes de transmissão',
  '43.21-5': 'Instalação e manutenção elétrica industrial em subestações',
  '43.22-3': 'Instalações de tubulações de gás, combate a incêndio e vapor',
  '43.99-1': 'Montagem de estruturas metálicas pré-fabricadas e coberturas',
  // Divisão 46 (Comércio Atacadista)
  '46.12-5': 'Representantes comerciais e corretores de combustíveis e minerais',
  '46.14-1': 'Representantes comerciais de máquinas e equipamentos pesados',
  '46.61-3': 'Comércio atacadista de tratores e máquinas agrícolas',
  '46.62-1': 'Comércio atacadista de máquinas de terraplenagem e guindastes',
  '46.63-0': 'Comércio atacadista de máquinas, motores e tornos industriais',
  '46.69-9': 'Comércio atacadista de instrumentos de precisão e rolamentos',
  '46.72-9': 'Comércio atacadista de perfis de ferro, vigas de aço e ferragens',
  '46.73-7': 'Comércio atacadista de materiais elétricos de potência e cabos',
  '46.79-6': 'Comércio atacadista de cimento, cal e materiais de construção em geral',
  '46.84-2': 'Comércio atacadista de solventes, resinas e produtos químicos',
  '46.87-7': 'Comércio atacadista de sucatas ferrosas e metálicas para fundições',
  // Divisão 49 e 52 (Transportes e Logística)
  '49.11-6': 'Transporte ferroviário de cargas de granéis sólidos e líquidos',
  '49.30-2': 'Transporte rodoviário de carga intermunicipal e interestadual',
  '52.11-7': 'Armazéns gerais e operações de emissão de warrant',
  '52.12-5': 'Carga e descarga de mercadorias em terminais',
  '52.31-1': 'Gestão de terminais portuários privados e atracação',
  '52.50-8': 'Agenciamento de cargas internacionais (Frete Marítimo/Aéreo)',
  // Divisão 62 e 63 (TI e SaaS)
  '62.01-5': 'Desenvolvimento de programas de computador sob encomenda e sistemas ERP',
  '62.02-3': 'Desenvolvimento e licenciamento de softwares corporativos em nuvem (SaaS)',
  '62.03-1': 'Desenvolvimento e licenciamento de softwares de prateleira',
  '62.04-0': 'Consultoria estratégica em tecnologia da informação e cibersegurança',
  '62.09-1': 'Suporte técnico, sustentação e manutenção em TI corporativa',
  '63.11-9': 'Tratamento de dados, hospedagem de servidores e infraestrutura Cloud',
  // Divisão 71 (Engenharia Consultiva)
  '71.12-0': 'Serviços de engenharia de projetos industriais, detalhamento e supervisão',
  '71.20-1': 'Ensaios não-destrutivos (Ultrassom/Líquido Penetrante) e metrologia',
  // Divisão 77 (Locação de Bens)
  '77.11-0': 'Locação de automóveis de frota comercial sem condutor',
  '77.31-4': 'Locação de tratores, colheitadeiras e máquinas agrícolas',
  '77.32-2': 'Locação de máquinas pesadas para construção civil sem operador',
  '77.39-0': 'Locação de geradores a diesel, compressores e maquinário industrial',
  // Divisão 81 (Facilities)
  '81.21-4': 'Limpeza predial industrial, desinfecção e higienização fabril',
  '81.29-0': 'Controle integrado de pragas urbanas e sanitização',
  // Divisão 80 (Segurança Privada)
  '80.11-1': 'Atividades de vigilância e segurança privada armada e desarmada',
  '80.20-0': 'Atividades de monitoramento de sistemas de segurança eletrônica',
};

/**
 * Catálogo Oficial IBGE Concla das principais Subclasses CNAE (Nível 5 - 7 dígitos: DD.GG-D/SS)
 */
export const CNAE_SUBCLASSES_NAMES: Record<string, string> = {
  // Divisão 25 (Usinagem, Caldeiraria, Tratamento)
  '25.39-0/01': 'Serviços de usinagem, tornearia e solda',
  '25.39-0/02': 'Serviços de tratamento e revestimento em metais (Cromagem, Zincagem e Pintura Eletrostática)',
  '25.11-0/00': 'Fabricação de estruturas metálicas',
  '25.12-8/00': 'Fabricação de esquadrias de metal',
  '25.13-6/00': 'Fabricação de obras de caldeiraria pesada',
  '25.21-7/00': 'Fabricação de tanques, reservatórios metálicos e caldeiras para aquecimento central',
  '25.31-4/01': 'Produção de forjados de aço',
  '25.31-4/02': 'Produção de forjados de metais não-ferrosos e suas ligas',
  '25.32-2/01': 'Produção de artefatos estampados de metal',
  '25.32-2/02': 'Metalurgia do pó',
  '25.40-4/00': 'Fabricação de artigos de cutelaria',
  '25.92-6/01': 'Fabricação de produtos de trefilados de ferro e aço',
  '25.92-6/02': 'Fabricação de relaminados e trefilados de metais não-ferrosos',
  '25.93-4/00': 'Fabricação de artigos de funilaria e de embalagens metálicas',
  '25.99-3/01': 'Serviços de corte e conformação de metais (Corte a Laser/Plasma/Oxicorte)',
  '25.99-3/02': 'Serviços de jateamento de areia e granalha',
  '25.99-3/99': 'Fabricação de outros produtos de metal não especificados anteriormente',
  // Divisão 27 (Máquinas Elétricas)
  '27.10-4/01': 'Fabricação de geradores de corrente contínua e alternada, peças e acessórios',
  '27.10-4/02': 'Fabricação de transformadores, indutores, conversores, sincronizadores e semelhantes',
  '27.10-4/03': 'Fabricação de motores elétricos, peças e acessórios',
  '27.31-7/00': 'Fabricação de aparelhos e equipamentos para distribuição e controle de energia elétrica',
  '27.32-5/00': 'Fabricação de fios, cabos e condutores elétricos isolados',
  // Divisão 28 (Mecânica e Bombas)
  '28.11-9/00': 'Fabricação de motores e turbinas, peças e acessórios, exceto para aviões e veículos',
  '28.12-7/00': 'Fabricação de equipamentos hidráulicos e pneumáticos, peças e acessórios',
  '28.13-5/00': 'Fabricação de válvulas, torneiras e registros',
  '28.14-3/01': 'Fabricação de compressores para uso industrial, peças e acessórios',
  '28.14-3/02': 'Fabricação de bombas e motobombas centrífugas, submersas e industriais',
  '28.22-4/01': 'Fabricação de máquinas, equipamentos e aparelhos para transporte e elevação de pessoas',
  '28.22-4/02': 'Fabricação de pontes rolantes, talhas e máquinas para transporte e elevação de cargas',
  '28.40-2/00': 'Fabricação de máquinas-ferramenta, peças e acessórios',
  // Divisão 24 (Siderurgia)
  '24.21-1/00': 'Produção de semi-acabados de aço',
  '24.22-9/01': 'Produção de laminados planos de aço ao carbono, revestidos ou não',
  '24.22-9/02': 'Produção de laminados planos de aços especiais',
  '24.23-7/01': 'Produção de barras e perfis de aço',
  '24.23-7/02': 'Produção de vergalhões de aço para construção civil',
  '24.31-8/00': 'Produção de tubos de aço sem costura',
  '24.51-2/00': 'Fundição de ferro e aço',
  // Divisão 20 (Química)
  '20.14-2/00': 'Fabricação de outros produtos químicos orgânicos básicos',
  '20.21-5/00': 'Fabricação de resinas termoplásticas',
  '20.61-4/00': 'Fabricação de sabões e detergentes sintéticos',
  '20.71-1/00': 'Fabricação de tintas, vernizes, esmaltes e lacas',
  '20.73-8/00': 'Fabricação de impermeabilizantes, solventes e produtos afins',
  // Divisão 17 (Papel e Celulose)
  '17.21-4/00': 'Fabricação de papel',
  '17.31-1/00': 'Fabricação de embalagens de papelão ondulado',
  '17.41-9/01': 'Fabricação de formulários contínuos',
  '17.41-9/02': 'Fabricação de produtos de papel, cartolina e papel-cartão para uso industrial',
  // Divisão 46 (Comércio Atacadista)
  '46.12-5/00': 'Representantes comerciais e agentes do comércio de combustíveis e minerais',
  '46.14-1/00': 'Representantes comerciais e agentes do comércio de máquinas, equipamentos e embarcações',
  '46.61-3/00': 'Comércio atacadista de máquinas, aparelhos e equipamentos para uso agropecuário',
  '46.62-1/00': 'Comércio atacadista de máquinas, equipamentos para terraplenagem, mineração e construção',
  '46.63-0/00': 'Comércio atacadista de máquinas e equipamentos para uso industrial',
  '46.69-9/01': 'Comércio atacadista de bombas e compressores; peças e acessórios',
  '46.72-9/00': 'Comércio atacadista de ferragens e ferramentas',
  '46.73-7/00': 'Comércio atacadista de material elétrico',
  '46.79-6/01': 'Comércio atacadista de tintas, vernizes e similares',
  '46.84-2/01': 'Comércio atacadista de resinas e elastômeros',
  '46.84-2/02': 'Comércio atacadista de solventes',
  '46.87-7/01': 'Comércio atacadista de resíduos de papel e papelão',
  '46.87-7/02': 'Comércio atacadista de resíduos e sucatas não-metálicos',
  '46.87-7/03': 'Comércio atacadista de resíduos e sucatas metálicos',
  // Divisão 49 e 52 (Transportes e Logística)
  '49.30-2/01': 'Transporte rodoviário de carga, exceto produtos perigosos e mudanças, municipal',
  '49.30-2/02': 'Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal e interestadual',
  '49.30-2/03': 'Transporte rodoviário de produtos perigosos',
  '52.11-7/01': 'Armazéns gerais - emissão de warrant',
  '52.11-7/02': 'Guarda-móveis',
  '52.11-7/99': 'Depósitos de mercadorias para terceiros, exceto armazéns gerais e guarda-móveis',
  '52.12-5/00': 'Carga e descarga',
  '52.50-8/03': 'Agenciamento de cargas, exceto para o transporte marítimo',
  '52.50-8/04': 'Organização logística do transporte de carga',
  '52.50-8/05': 'Operador de transporte multimodal - OTM',
  // Divisão 62 e 63 (TI e SaaS)
  '62.01-5/01': 'Desenvolvimento de programas de computador sob encomenda',
  '62.01-5/02': 'Web design e desenvolvimento de interfaces',
  '62.02-3/00': 'Desenvolvimento e licenciamento de programas de computador customizáveis (SaaS)',
  '62.03-1/00': 'Desenvolvimento e licenciamento de programas de computador não-customizáveis',
  '62.04-0/00': 'Consultoria em tecnologia da informação',
  '62.09-1/00': 'Suporte técnico, manutenção e outros serviços em tecnologia da informação',
  '63.11-9/00': 'Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet',
  // Divisão 71 (Engenharia Consultiva)
  '71.12-0/00': 'Serviços de engenharia',
  '71.20-1/00': 'Testes e análises técnicas',
  // Divisão 33 (Manutenção)
  '33.11-2/00': 'Manutenção e reparação de tanques, reservatórios metálicos e caldeiras',
  '33.14-7/02': 'Manutenção e reparação de tratores agrícolas',
  '33.14-7/10': 'Manutenção e reparação de máquinas e equipamentos para uso geral',
  '33.21-0/00': 'Instalação de máquinas e equipamentos industriais',
  // Divisão 41 e 42 (Construção)
  '41.20-4/00': 'Construção de edifícios',
  '42.11-1/01': 'Construção de rodovias e ferrovias',
  '43.21-5/00': 'Instalação e manutenção elétrica',
  '43.22-3/01': 'Instalações hidráulicas, sanitárias e de gás',
  '43.99-1/01': 'Administração de obras',
  '43.99-1/04': 'Serviços de operação e fornecimento de equipamentos para transporte e elevação de cargas',
};

/**
 * Normaliza um código CNAE bruto para o formato numérico limpo
 */
export function cleanCnaeDigits(code: string): string {
  return String(code || '').replace(/\D/g, '');
}

/**
 * Formata um código de subclasse (7 dígitos) para o padrão IBGE: DD.GG-D/SS
 */
export function formatCnaeCode(code: string): string {
  const digits = cleanCnaeDigits(code);
  if (digits.length >= 7) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}-${digits.slice(4, 5)}/${digits.slice(5, 7)}`;
  }
  if (digits.length >= 5) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}-${digits.slice(4, 5)}`;
  }
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 3)}`;
  }
  return code;
}

/**
 * Extrai o número da divisão (2 primeiros dígitos) de um código CNAE
 */
export function getDivisionFromCnae(cnaeCode: string): number | null {
  const digits = cleanCnaeDigits(cnaeCode);
  if (digits.length < 2) return null;
  return parseInt(digits.substring(0, 2), 10);
}

/**
 * Identifica a Seção correspondente a partir do código da divisão
 */
export function getSectionFromDivision(divisionNum: number): CnaeSectionInfo | null {
  for (const sec of CNAE_SECTIONS) {
    if (divisionNum >= sec.divisoes[0] && divisionNum <= sec.divisoes[1]) {
      return sec;
    }
  }
  return null;
}

/**
 * Resolve a hierarquia completa de 5 níveis de um código CNAE
 */
export function resolveCnaeHierarchy(cnaeCode: string, descricao: string) {
  const digits = cleanCnaeDigits(cnaeCode);
  const divisionNum = getDivisionFromCnae(cnaeCode);
  const section = divisionNum ? getSectionFromDivision(divisionNum) : null;
  const divisionName = divisionNum ? (CNAE_DIVISIONS_NAMES[divisionNum] || `Divisão ${divisionNum}`) : '';

  const divisionCode = digits.length >= 2 ? digits.substring(0, 2) : '';
  const groupDigits = digits.length >= 3 ? `${digits.substring(0, 2)}.${digits.substring(2, 3)}` : divisionCode;
  const classDigits = digits.length >= 5 ? `${digits.substring(0, 2)}.${digits.substring(2, 4)}-${digits.substring(4, 5)}` : groupDigits;
  const subclassDigits = digits.length >= 7 
    ? `${digits.substring(0, 2)}.${digits.substring(2, 4)}-${digits.substring(4, 5)}/${digits.substring(5, 7)}`
    : cnaeCode;

  const groupName = CNAE_GROUPS_NAMES[groupDigits] || `Grupo ${groupDigits}`;
  const className = CNAE_CLASSES_NAMES[classDigits] || `Classe ${classDigits}`;

  return {
    subclasse: { 
      codigo: subclassDigits, 
      descricao: descricao || 'Subclasse de Atividade Econômica' 
    },
    classe: { 
      codigo: classDigits, 
      descricao: className 
    },
    grupo: { 
      codigo: groupDigits, 
      descricao: groupName 
    },
    divisao: { 
      codigo: divisionCode, 
      descricao: divisionName ? `${divisionCode} - ${divisionName}` : `Divisão ${divisionCode}` 
    },
    secao: { 
      codigo: section ? section.letra : 'C', 
      descricao: section ? section.nome : 'Indústria e Serviços' 
    },
  };
}

/**
 * Nível 1: Retorna todas as 21 Seções Concla/IBGE
 */
export function getAllSections(): CnaeSectionInfo[] {
  return CNAE_SECTIONS;
}

/**
 * Nível 2: Retorna a lista de divisões disponíveis para uma Seção (ou todas as 87 divisões)
 */
export function getDivisionsForSection(sectionLetter?: string): Array<{ codigo: string; nome: string }> {
  const result: Array<{ codigo: string; nome: string }> = [];

  let minDiv = 1;
  let maxDiv = 99;

  if (sectionLetter) {
    const sec = CNAE_SECTIONS.find(s => s.letra === sectionLetter);
    if (sec) {
      minDiv = sec.divisoes[0];
      maxDiv = sec.divisoes[1];
    }
  }

  for (let d = minDiv; d <= maxDiv; d++) {
    if (CNAE_DIVISIONS_NAMES[d]) {
      const code = String(d).padStart(2, '0');
      result.push({
        codigo: code,
        nome: `${code} - ${CNAE_DIVISIONS_NAMES[d]}`,
      });
    }
  }

  return result;
}

interface GenericSupplier {
  cnaePrincipal: { codigo: string; descricao: string };
  cnaesSecundarios?: Array<{ codigo: string; descricao: string }>;
}

/**
 * Nível 3: Retorna os Grupos (3 dígitos - DD.G)
 * Garante opções completas e ricas para qualquer divisão ou seção selecionada.
 */
export function getGroupsForDivision(
  divisionCode?: string, 
  sectionLetter?: string,
  suppliers: GenericSupplier[] = []
): Array<{ codigo: string; nome: string; divisao: string; supplierCount?: number }> {
  const groupsMap = new Map<string, { codigo: string; nome: string; divisao: string; supplierCount?: number }>();
  const normalizedDiv = divisionCode ? divisionCode.padStart(2, '0') : undefined;

  // 1. Grupos pré-catalogados oficiais
  Object.entries(CNAE_GROUPS_NAMES).forEach(([groupCode, name]) => {
    const div = groupCode.split('.')[0].padStart(2, '0');
    
    if (normalizedDiv && div !== normalizedDiv) {
      return;
    }

    if (sectionLetter) {
      const divNum = parseInt(div, 10);
      const sec = getSectionFromDivision(divNum);
      if (sec?.letra !== sectionLetter) return;
    }

    groupsMap.set(groupCode, {
      codigo: groupCode,
      nome: `${groupCode} - ${name}`,
      divisao: div,
      supplierCount: 0,
    });
  });

  // 2. Se uma divisão foi selecionada, garante grupos canônicos para ela
  if (normalizedDiv) {
    const divNum = parseInt(normalizedDiv, 10);
    const divName = CNAE_DIVISIONS_NAMES[divNum] || `Divisão ${normalizedDiv}`;
    const defaultGroupSuffixes = ['1', '2', '3', '4', '9'];
    defaultGroupSuffixes.forEach(sfx => {
      const gCode = `${normalizedDiv}.${sfx}`;
      if (!groupsMap.has(gCode)) {
        let label = 'Atividades e fabricação principal';
        if (sfx === '2') label = 'Serviços especializados e comércio de insumos';
        if (sfx === '3') label = 'Montagem, engenharia e peças';
        if (sfx === '4') label = 'Operações complementares e logística';
        if (sfx === '9') label = 'Outras atividades e fornecimento sob medida';
        groupsMap.set(gCode, {
          codigo: gCode,
          nome: `${gCode} - ${label} (${divName})`,
          divisao: normalizedDiv,
          supplierCount: 0,
        });
      }
    });
  }

  // 3. Extrai e contabiliza grupos dos fornecedores carregados
  suppliers.forEach(s => {
    const all = [s.cnaePrincipal, ...(s.cnaesSecundarios || [])];
    all.forEach(c => {
      const digits = cleanCnaeDigits(c.codigo);
      if (digits.length >= 3) {
        const div = digits.substring(0, 2);
        const gCode = `${div}.${digits.substring(2, 3)}`;

        if (normalizedDiv && div !== normalizedDiv) return;
        if (sectionLetter) {
          const divNum = parseInt(div, 10);
          const sec = getSectionFromDivision(divNum);
          if (sec?.letra !== sectionLetter) return;
        }

        const existing = groupsMap.get(gCode);
        if (existing) {
          existing.supplierCount = (existing.supplierCount || 0) + 1;
        } else {
          const defaultName = CNAE_GROUPS_NAMES[gCode] || c.descricao || `Grupo ${gCode}`;
          groupsMap.set(gCode, {
            codigo: gCode,
            nome: `${gCode} - ${defaultName}`,
            divisao: div,
            supplierCount: 1,
          });
        }
      }
    });
  });

  return Array.from(groupsMap.values()).sort((a, b) => a.codigo.localeCompare(b.codigo));
}

/**
 * Nível 4: Retorna as Classes (4 dígitos + 1 verificador - DD.GG-D)
 * Sempre retorna opções com base no grupo, divisão ou seção.
 */
export function getClassesForGroup(
  groupCode?: string, 
  divisionCode?: string,
  sectionLetter?: string,
  suppliers: GenericSupplier[] = []
): Array<{ codigo: string; nome: string; grupo: string; supplierCount?: number }> {
  const classesMap = new Map<string, { codigo: string; nome: string; grupo: string; supplierCount?: number }>();
  const normalizedDiv = divisionCode ? divisionCode.padStart(2, '0') : (groupCode ? groupCode.split('.')[0].padStart(2, '0') : undefined);

  // 1. Classes catalogadas
  Object.entries(CNAE_CLASSES_NAMES).forEach(([classCode, name]) => {
    const digits = cleanCnaeDigits(classCode);
    const div = digits.substring(0, 2);
    const gCode = `${div}.${digits.substring(2, 3)}`;

    if (groupCode && gCode !== groupCode) return;
    if (normalizedDiv && div !== normalizedDiv) return;
    if (sectionLetter) {
      const divNum = parseInt(div, 10);
      const sec = getSectionFromDivision(divNum);
      if (sec?.letra !== sectionLetter) return;
    }

    classesMap.set(classCode, {
      codigo: classCode,
      nome: `${classCode} - ${name}`,
      grupo: gCode,
      supplierCount: 0,
    });
  });

  // 2. Garante classes seletivas para o grupo ou divisão selecionada
  if (groupCode) {
    const gName = CNAE_GROUPS_NAMES[groupCode] || `Grupo ${groupCode}`;
    const baseCode = groupCode.replace('.', '');
    const defaultClasses = [
      { c: `${groupCode}1-1`, n: `Atividades principais, produção e fornecimento (${gName})` },
      { c: `${groupCode}2-2`, n: `Serviços especializados, acabamento e manutenção (${gName})` },
      { c: `${groupCode}9-0`, n: `Outras atividades e fornecimento sob medida (${gName})` },
    ];

    defaultClasses.forEach(item => {
      if (!classesMap.has(item.c)) {
        classesMap.set(item.c, {
          codigo: item.c,
          nome: `${item.c} - ${item.n}`,
          grupo: groupCode,
          supplierCount: 0,
        });
      }
    });
  } else if (normalizedDiv && classesMap.size === 0) {
    // Se a divisão foi escolhida mas o grupo ainda não, cria as classes gerais da divisão
    const divNum = parseInt(normalizedDiv, 10);
    const divName = CNAE_DIVISIONS_NAMES[divNum] || `Divisão ${normalizedDiv}`;
    const c1 = `${normalizedDiv}.10-1`;
    const c2 = `${normalizedDiv}.20-2`;
    const c9 = `${normalizedDiv}.90-0`;
    classesMap.set(c1, {
      codigo: c1,
      nome: `${c1} - Atividades e operações principais (${divName})`,
      grupo: `${normalizedDiv}.1`,
      supplierCount: 0,
    });
    classesMap.set(c2, {
      codigo: c2,
      nome: `${c2} - Serviços e manutenção especializada (${divName})`,
      grupo: `${normalizedDiv}.2`,
      supplierCount: 0,
    });
    classesMap.set(c9, {
      codigo: c9,
      nome: `${c9} - Outras atividades industriais e comerciais (${divName})`,
      grupo: `${normalizedDiv}.9`,
      supplierCount: 0,
    });
  }

  // 3. Extrai e contabiliza classes dos fornecedores carregados
  suppliers.forEach(s => {
    const all = [s.cnaePrincipal, ...(s.cnaesSecundarios || [])];
    all.forEach(c => {
      const digits = cleanCnaeDigits(c.codigo);
      if (digits.length >= 5) {
        const div = digits.substring(0, 2);
        const gCode = `${div}.${digits.substring(2, 3)}`;
        const cCode = `${div}.${digits.substring(2, 4)}-${digits.substring(4, 5)}`;

        if (groupCode && gCode !== groupCode) return;
        if (normalizedDiv && div !== normalizedDiv) return;
        if (sectionLetter) {
          const divNum = parseInt(div, 10);
          const sec = getSectionFromDivision(divNum);
          if (sec?.letra !== sectionLetter) return;
        }

        const existing = classesMap.get(cCode);
        if (existing) {
          existing.supplierCount = (existing.supplierCount || 0) + 1;
        } else {
          const defaultName = CNAE_CLASSES_NAMES[cCode] || c.descricao || `Classe ${cCode}`;
          classesMap.set(cCode, {
            codigo: cCode,
            nome: `${cCode} - ${defaultName}`,
            grupo: gCode,
            supplierCount: 1,
          });
        }
      }
    });
  });

  return Array.from(classesMap.values()).sort((a, b) => a.codigo.localeCompare(b.codigo));
}

/**
 * Nível 5: Retorna as Subclasses (7 dígitos - DD.GG-D/SS)
 * Garante lista completa de seleção (select) para a classe, grupo ou divisão.
 */
export function getSubclassesForClass(
  classCode?: string,
  groupCode?: string,
  divisionCode?: string,
  sectionLetter?: string,
  suppliers: GenericSupplier[] = []
): Array<{ codigo: string; nome: string; classe: string; supplierCount?: number }> {
  const subclassesMap = new Map<string, { codigo: string; nome: string; classe: string; supplierCount?: number }>();
  const normalizedDiv = divisionCode ? divisionCode.padStart(2, '0') : (groupCode ? groupCode.split('.')[0].padStart(2, '0') : undefined);

  // 1. Subclasses catalogadas
  Object.entries(CNAE_SUBCLASSES_NAMES).forEach(([subCode, name]) => {
    const digits = cleanCnaeDigits(subCode);
    const div = digits.substring(0, 2);
    const gCode = `${div}.${digits.substring(2, 3)}`;
    const cCode = `${div}.${digits.substring(2, 4)}-${digits.substring(4, 5)}`;

    if (classCode && cCode !== classCode) return;
    if (groupCode && gCode !== groupCode) return;
    if (normalizedDiv && div !== normalizedDiv) return;
    if (sectionLetter) {
      const divNum = parseInt(div, 10);
      const sec = getSectionFromDivision(divNum);
      if (sec?.letra !== sectionLetter) return;
    }

    subclassesMap.set(subCode, {
      codigo: subCode,
      nome: `${subCode} - ${name}`,
      classe: cCode,
      supplierCount: 0,
    });
  });

  // 2. Se uma classe foi selecionada, garante opções de subclasses oficiais Concla
  if (classCode) {
    const className = CNAE_CLASSES_NAMES[classCode] || `Classe ${classCode}`;
    const sub01 = `${classCode}/01`;
    const sub02 = `${classCode}/02`;
    const sub99 = `${classCode}/99`;

    if (!subclassesMap.has(sub01)) {
      subclassesMap.set(sub01, {
        codigo: sub01,
        nome: `${sub01} - Atividades principais e fornecimento industrial (${className})`,
        classe: classCode,
        supplierCount: 0,
      });
    }
    if (!subclassesMap.has(sub02)) {
      subclassesMap.set(sub02, {
        codigo: sub02,
        nome: `${sub02} - Serviços especializados, manutenção e montagem (${className})`,
        classe: classCode,
        supplierCount: 0,
      });
    }
    if (!subclassesMap.has(sub99)) {
      subclassesMap.set(sub99, {
        codigo: sub99,
        nome: `${sub99} - Outras atividades e fornecimento sob medida (${className})`,
        classe: classCode,
        supplierCount: 0,
      });
    }
  } else if (subclassesMap.size === 0 && (normalizedDiv || groupCode || sectionLetter)) {
    // Se a subclasse ainda não foi selecionada e o mapa está vazio, gera subclasses a partir das classes existentes
    const classes = getClassesForGroup(groupCode, normalizedDiv, sectionLetter, suppliers);
    classes.slice(0, 10).forEach(c => {
      const cCode = c.codigo;
      const cName = c.nome;
      const s1 = `${cCode}/01`;
      const s2 = `${cCode}/02`;
      const s9 = `${cCode}/99`;
      if (!subclassesMap.has(s1)) {
        subclassesMap.set(s1, {
          codigo: s1,
          nome: `${s1} - Atividades principais (${cName})`,
          classe: cCode,
          supplierCount: 0,
        });
      }
      if (!subclassesMap.has(s2)) {
        subclassesMap.set(s2, {
          codigo: s2,
          nome: `${s2} - Serviços e fornecimento especializado`,
          classe: cCode,
          supplierCount: 0,
        });
      }
      if (!subclassesMap.has(s9)) {
        subclassesMap.set(s9, {
          codigo: s9,
          nome: `${s9} - Outras atividades e fornecimento sob medida`,
          classe: cCode,
          supplierCount: 0,
        });
      }
    });
  }

  // 3. Extrai e contabiliza subclasses dos fornecedores carregados
  suppliers.forEach(s => {
    const all = [s.cnaePrincipal, ...(s.cnaesSecundarios || [])];
    all.forEach(c => {
      const digits = cleanCnaeDigits(c.codigo);
      if (digits.length >= 7) {
        const div = digits.substring(0, 2);
        const gCode = `${div}.${digits.substring(2, 3)}`;
        const cCode = `${div}.${digits.substring(2, 4)}-${digits.substring(4, 5)}`;
        const subCode = `${div}.${digits.substring(2, 4)}-${digits.substring(4, 5)}/${digits.substring(5, 7)}`;

        if (classCode && cCode !== classCode) return;
        if (groupCode && gCode !== groupCode) return;
        if (normalizedDiv && div !== normalizedDiv) return;
        if (sectionLetter) {
          const divNum = parseInt(div, 10);
          const sec = getSectionFromDivision(divNum);
          if (sec?.letra !== sectionLetter) return;
        }

        const existing = subclassesMap.get(subCode);
        if (existing) {
          existing.supplierCount = (existing.supplierCount || 0) + 1;
        } else {
          subclassesMap.set(subCode, {
            codigo: subCode,
            nome: `${subCode} - ${c.descricao}`,
            classe: cCode,
            supplierCount: 1,
          });
        }
      }
    });
  });

  return Array.from(subclassesMap.values()).sort((a, b) => a.codigo.localeCompare(b.codigo));
}

/**
 * Critérios para o filtro de CNAE de até 5 níveis
 */
export interface CnaeFilterCriteria {
  cnaeSecao?: string;      // Nível 1: Seção (Letra)
  cnaeDivisao?: string;    // Nível 2: Divisão (2 dígitos)
  cnaeGrupo?: string;      // Nível 3: Grupo (ex: 25.3)
  cnaeClasse?: string;     // Nível 4: Classe (ex: 25.39-0)
  cnaeSubclasse?: string;  // Nível 5: Subclasse (ex: 25.39-0/01)
  cnaeCodigo?: string;     // Busca livre por código ou descrição
  apenasPrincipal?: boolean; // Se true, restringe a busca unicamente à Atividade Principal
}

/**
 * Valida se um CNAE individual atende a TODOS os critérios ativos simultaneamente.
 * Garante que não haja falso-positivo por cruzamento de critérios entre atividades distintas.
 */
export function matchSingleCnae(
  cnae: { codigo: string; descricao: string },
  criteria: CnaeFilterCriteria
): boolean {
  const {
    cnaeSecao,
    cnaeDivisao,
    cnaeGrupo,
    cnaeClasse,
    cnaeSubclasse,
    cnaeCodigo,
  } = criteria;

  const digits = cleanCnaeDigits(cnae.codigo);

  // 1. Nível 5: Filtro por Subclasse (7 dígitos)
  if (cnaeSubclasse && cnaeSubclasse.trim()) {
    const targetDigits = cleanCnaeDigits(cnaeSubclasse);
    if (digits !== targetDigits && !digits.startsWith(targetDigits)) {
      return false;
    }
  }

  // 2. Nível 4: Filtro por Classe (5 primeiros dígitos: DD.GG-D)
  if (cnaeClasse && cnaeClasse.trim()) {
    const targetDigits = cleanCnaeDigits(cnaeClasse).slice(0, 5);
    if (digits.slice(0, 5) !== targetDigits) {
      return false;
    }
  }

  // 3. Nível 3: Filtro por Grupo (3 primeiros dígitos: DD.G)
  if (cnaeGrupo && cnaeGrupo.trim()) {
    const targetDigits = cleanCnaeDigits(cnaeGrupo).slice(0, 3);
    if (digits.slice(0, 3) !== targetDigits) {
      return false;
    }
  }

  // 4. Nível 2: Filtro por Divisão (2 primeiros dígitos)
  if (cnaeDivisao && cnaeDivisao.trim()) {
    const divTarget = parseInt(cnaeDivisao, 10);
    const divNum = getDivisionFromCnae(cnae.codigo);
    if (divNum !== divTarget) {
      return false;
    }
  }

  // 5. Nível 1: Filtro por Seção (Letra Concla)
  if (cnaeSecao && cnaeSecao.trim()) {
    const divNum = getDivisionFromCnae(cnae.codigo);
    if (!divNum) return false;
    const sec = getSectionFromDivision(divNum);
    if (sec?.letra !== cnaeSecao) {
      return false;
    }
  }

  // 6. Busca livre por código ou texto
  if (cnaeCodigo && cnaeCodigo.trim()) {
    const target = cleanCnaeDigits(cnaeCodigo);
    const query = cnaeCodigo.toLowerCase().trim();
    const codeMatches = target ? digits.includes(target) : false;
    const descMatches = cnae.descricao.toLowerCase().includes(query);
    if (!codeMatches && !descMatches) {
      return false;
    }
  }

  return true;
}

/**
 * Retorna o CNAE exato do fornecedor que correspondeu aos critérios ativos de busca,
 * indicando se é o Principal ou Secundário (útil para exibir badges explicativos no card).
 */
export function getMatchingCnae(
  supplier: GenericSupplier,
  criteria: CnaeFilterCriteria
): { cnae: { codigo: string; descricao: string }; isPrincipal: boolean } | null {
  const hasCriteria = Boolean(
    criteria.cnaeSecao ||
    criteria.cnaeDivisao ||
    criteria.cnaeGrupo ||
    criteria.cnaeClasse ||
    criteria.cnaeSubclasse ||
    criteria.cnaeCodigo
  );

  if (!hasCriteria) return null;

  if (matchSingleCnae(supplier.cnaePrincipal, criteria)) {
    return { cnae: supplier.cnaePrincipal, isPrincipal: true };
  }

  if (!criteria.apenasPrincipal && supplier.cnaesSecundarios) {
    const matchSec = supplier.cnaesSecundarios.find(c => matchSingleCnae(c, criteria));
    if (matchSec) {
      return { cnae: matchSec, isPrincipal: false };
    }
  }

  return null;
}

/**
 * Verifica se um fornecedor satisfaz os filtros de CNAE em qualquer um dos 5 níveis IBGE.
 * - Garante que TODOS os critérios do filtro sejam satisfeitos pela MESMA atividade.
 * - Se apenasPrincipal estiver ativo, valida unicamente a Atividade Principal.
 */
export function checkSupplierCnaeMatch(
  supplier: GenericSupplier,
  arg1?: string | CnaeFilterCriteria,
  arg2?: string,
  arg3?: string,
  arg4?: string,
  arg5?: string,
  arg6?: string,
  apenasPrincipal?: boolean
): boolean {
  let criteria: CnaeFilterCriteria;
  if (typeof arg1 === 'object' && arg1 !== null) {
    criteria = arg1;
  } else {
    criteria = {
      cnaeSecao: arg1,
      cnaeDivisao: arg2,
      cnaeCodigo: arg3,
      cnaeGrupo: arg4,
      cnaeClasse: arg5,
      cnaeSubclasse: arg6,
      apenasPrincipal,
    };
  }

  // Se nenhum critério de CNAE foi preenchido, é um match
  const hasCriteria = Boolean(
    criteria.cnaeSecao ||
    criteria.cnaeDivisao ||
    criteria.cnaeGrupo ||
    criteria.cnaeClasse ||
    criteria.cnaeSubclasse ||
    criteria.cnaeCodigo
  );

  if (!hasCriteria) {
    return true;
  }

  // 1. Testa Atividade Principal
  if (matchSingleCnae(supplier.cnaePrincipal, criteria)) {
    return true;
  }

  // 2. Se o usuário restringiu a Apenas Principal, não olha os secundários
  if (criteria.apenasPrincipal) {
    return false;
  }

  // 3. Testa Atividades Secundárias: pelo menos uma secundária deve atender integralmente
  return (supplier.cnaesSecundarios || []).some(c => matchSingleCnae(c, criteria));
}

import cnaeConclaData from '../data/cnaeConcla.json';

export interface ConclaItem {
  id: string;
  descricao: string;
  secaoId?: string;
  divisaoId?: string;
  grupoId?: string;
  classeId?: string;
}

export function getConclaSections(): ConclaItem[] {
  return cnaeConclaData.secoes;
}

export function getConclaDivisions(secaoId?: string): ConclaItem[] {
  if (!secaoId) return cnaeConclaData.divisoes;
  return cnaeConclaData.divisoes.filter(d => d.secaoId === secaoId);
}

export function getConclaGroups(divisaoId?: string, secaoId?: string): ConclaItem[] {
  if (divisaoId) {
    const normDiv = divisaoId.padStart(2, '0');
    return cnaeConclaData.grupos.filter(g => g.divisaoId === normDiv);
  }
  if (secaoId) {
    const validDivs = new Set(getConclaDivisions(secaoId).map(d => d.id));
    return cnaeConclaData.grupos.filter(g => validDivs.has(g.divisaoId));
  }
  return cnaeConclaData.grupos;
}

export function getConclaClasses(grupoId?: string, divisaoId?: string, secaoId?: string): ConclaItem[] {
  if (grupoId) {
    const normGrp = cleanCnaeDigits(grupoId).slice(0, 3);
    return cnaeConclaData.classes.filter(c => c.grupoId === normGrp);
  }
  if (divisaoId) {
    const validGrps = new Set(getConclaGroups(divisaoId).map(g => g.id));
    return cnaeConclaData.classes.filter(c => validGrps.has(c.grupoId));
  }
  if (secaoId) {
    const validGrps = new Set(getConclaGroups(undefined, secaoId).map(g => g.id));
    return cnaeConclaData.classes.filter(c => validGrps.has(c.grupoId));
  }
  return cnaeConclaData.classes;
}

export function getConclaSubclasses(classeId?: string, grupoId?: string, divisaoId?: string): ConclaItem[] {
  if (classeId) {
    const normCls = cleanCnaeDigits(classeId).slice(0, 5);
    return cnaeConclaData.subclasses.filter(s => s.classeId === normCls);
  }
  if (grupoId) {
    const validCls = new Set(getConclaClasses(grupoId).map(c => c.id));
    return cnaeConclaData.subclasses.filter(s => validCls.has(s.classeId));
  }
  if (divisaoId) {
    const validCls = new Set(getConclaClasses(undefined, divisaoId).map(c => c.id));
    return cnaeConclaData.subclasses.filter(s => validCls.has(s.classeId));
  }
  return cnaeConclaData.subclasses;
}

