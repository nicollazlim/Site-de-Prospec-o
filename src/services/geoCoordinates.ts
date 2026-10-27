/**
 * Tabela de Coordenadas Geográficas de Referência para Municípios e Capitais do Brasil
 */
import brazilianMunicipalitiesCoords from '../data/brazilianMunicipalitiesCoords.json';

// Coordenadas exatas das sedes das principais empresas brasileiras e filiais reais
export const VERIFIED_COMPANY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Principais Fornecedores
  '05462987000180': { lat: -15.313610, lng: -42.014440 }, // Thathom Agroflorestal - Rua Paulo Adrião da Rocha, 319, Centro, São João do Paraíso, MG (Norte de Minas)
  '08343492000120': { lat: -19.967841, lng: -43.958504 }, // MRV Engenharia - Av Prof Mário Werneck, 621, Estoril, Belo Horizonte, MG
  '04337168000148': { lat: -3.125500, lng: -59.972300 }, // Moto Honda da Amazônia - Rua José de Anchieta, 1205, Distrito Industrial, Manaus, AM
  '84429695000111': { lat: -26.478524, lng: -49.049759 }, // WEG S.A. - Av Pref Waldemar Grubba, 3300, Jaraguá do Sul, SC
  '33000167000101': { lat: -22.909600, lng: -43.179352 }, // Petrobras - Av República do Chile, 65, Rio de Janeiro, RJ
  '33611500000119': { lat: -30.016390, lng: -51.205280 }, // Gerdau S.A. - Av Farrapos, 1811, Porto Alegre, RS
  '18236120000158': { lat: -18.919800, lng: -48.261200 }, // Solaris Tech - Av Rondon Pacheco, 2150, Uberlândia, MG (Triângulo Mineiro)
  '28492041000109': { lat: -22.883500, lng: -47.042800 }, // Precisão Usinagem - Rua das Indústrias Metalúrgicas, 820, Campinas, SP
  '05948372000188': { lat: -19.748300, lng: -47.931900 }, // Metalúrgica Triângulo - Rua das Bandeiras, 310, Uberaba, MG (Triângulo Mineiro)
  '14892019000173': { lat: -3.085100, lng: -59.948200 }, // Distribuidora Norte Pack - Av Autaz Mirim, 4500, Manaus, AM
  
  // Grandes Grupos Industriais e Comerciais em Suas Sedes Reais
  '33592510000154': { lat: -22.946390, lng: -43.181940 }, // Vale S.A. - Praia de Botafogo, 186, Rio de Janeiro, RJ
  '01637895000132': { lat: -23.565800, lng: -46.652100 }, // Votorantim Cimentos - Rua Pamplona, 227, São Paulo, SP
  '42150391000170': { lat: -12.695830, lng: -38.324170 }, // Braskem S.A. - Polo Industrial de Camaçari, BA
  '89637490000145': { lat: -23.593330, lng: -46.691390 }, // Klabin S.A. - Av Brigadeiro Faria Lima, 3600, São Paulo, SP
  '02012862000160': { lat: -12.981940, lng: -38.455280 }, // Suzano S.A. - Av Tancredo Neves, 2744, Salvador, BA
  '33042730000104': { lat: -22.523100, lng: -44.104200 }, // CSN - Volta Redonda, RJ
  '50746577000115': { lat: -23.585560, lng: -46.684170 }, // Cosan S.A. - Av Faria Lima, São Paulo, SP
  '61198164000160': { lat: -23.535830, lng: -46.641670 }, // Porto Seguro - Alameda Barão de Piracicaba, 618, São Paulo, SP
  '60746948000112': { lat: -23.532220, lng: -46.784440 }, // Banco Bradesco - Cidade de Deus, Vila Yara, Osasco, SP
  '60701190000104': { lat: -23.639720, lng: -46.637780 }, // Itaú Unibanco - Praça Alfredo Egydio de Souza Aranha, 100, São Paulo, SP
  '60872504000123': { lat: -23.639720, lng: -46.637780 }, // Itaú Unibanco Holding - São Paulo, SP
  '61585865000151': { lat: -23.557780, lng: -46.727780 }, // Raia Drogasil - Av Corifeu de Azevedo Marques, 3097, São Paulo, SP
  '01438784000105': { lat: -23.504170, lng: -46.621390 }, // Leroy Merlin - Rua Pascoal Pais, 525, São Paulo, SP
  '47960950000121': { lat: -20.536940, lng: -47.399170 }, // Magazine Luiza - Rua Arnulfo de Lima, 2385, Franca, SP
  '71673990000177': { lat: -23.356390, lng: -46.877780 }, // Natura Cosméticos - Rodovia Anhanguera, Cajamar, SP
  '61079117000105': { lat: -23.601940, lng: -46.696390 }, // Alpargatas S.A. - São Paulo, SP
  '03007331000141': { lat: -23.528330, lng: -46.773890 }, // Mercado Livre Brasil - Melicidade, Osasco, SP
  '02808708000107': { lat: -23.606940, lng: -46.698330 }, // Ambev - Rua Dr. Renato Paes de Barros, 1017, São Paulo, SP
  '02916265000160': { lat: -23.513610, lng: -46.721670 }, // JBS S/A - Av Marginal Direita do Tietê, 500, São Paulo, SP
  '06057223000171': { lat: -22.895000, lng: -43.238890 }, // Sendas Distribuidora (Assaí) - Rio de Janeiro, RJ
  '47508411000156': { lat: -23.577220, lng: -46.657780 }, // CBD (Pão de Açúcar) - Av Brigadeiro Luís Antônio, 3144, São Paulo, SP
  '54516661000101': { lat: -23.238900, lng: -45.918900 }, // Johnson & Johnson - São José dos Campos, SP
  '00000000000191': { lat: -15.797500, lng: -47.891900 }, // Banco do Brasil - SBS Quadra 1, Brasília, DF
  '00336701000104': { lat: -15.795830, lng: -47.882500 }, // Telebras - Setor Comercial Norte, Brasília, DF
  '07689002000189': { lat: -23.218900, lng: -45.864400 }, // Embraer S.A. - Av Brigadeiro Faria Lima, 2170, São José dos Campos, SP
  '53113791000122': { lat: -23.507800, lng: -46.654200 }, // Totvs S.A. - Av Braz Leme, 1000, São Paulo, SP
  '84683862000189': { lat: -26.275800, lng: -48.821400 }, // Tupy S.A. - Rua Albano Schmidt, 3400, Joinville, SC
  '89086144000116': { lat: -29.175600, lng: -51.158900 }, // Randon S.A. - Av Abramo Randon, 770, Caxias do Sul, RS
  '88611835000137': { lat: -29.155000, lng: -51.189400 }, // Marcopolo S.A. - Av Marcopolo, 280, Caxias do Sul, RS
  '82901000000127': { lat: -27.593600, lng: -48.621400 }, // Intelbras S.A. - Rodovia BR 101, km 210, São José, SC
  '84693184000101': { lat: -26.248900, lng: -48.868900 }, // Schulz S.A. - Joinville, SC
  '04368898000106': { lat: -25.438900, lng: -49.278900 }, // Copel - Rua José Izidoro Biazetto, 158, Curitiba, PR
  '76484013000145': { lat: -25.445600, lng: -49.261200 }, // Sanepar - Rua Engenheiros Rebouças, 1376, Curitiba, PR
  '07206816000152': { lat: -3.891400, lng: -38.455800 }, // M. Dias Branco - Rodovia BR 116, km 18, Eusébio, CE
  '07533515000138': { lat: -3.738900, lng: -38.648900 }, // Aço Cearense - Caucaia, CE
  '10815493000105': { lat: -8.334700, lng: -36.425800 }, // Moura Baterias - Belo Jardim, PE
  '23507209000180': { lat: -2.518900, lng: -44.258900 }, // Grupo Mateus - São Luís, MA
  '00080671000100': { lat: -18.414400, lng: -49.216400 }, // Caramuru Alimentos - Itumbiara, GO
  '02302324000147': { lat: -16.326800, lng: -48.953400 }, // Granol - DAIA, Anápolis, GO
  '90049792000176': { lat: -29.297800, lng: -51.503600 }, // Tramontina - Carlos Barbosa, RS
  '84684498000151': { lat: -26.318900, lng: -48.854200 }, // Tigre Tubos - Joinville, SC
  '83475913000191': { lat: -27.241400, lng: -48.634700 }, // Portobello - Tijucas, SC
  '60870003000165': { lat: -19.468600, lng: -42.536700 }, // Usiminas - Ipatinga, MG
  '84429695000200': { lat: -23.518900, lng: -46.711400 }, // WEG Filial SP - São Paulo, SP
  '33611500000208': { lat: -22.903600, lng: -43.181400 }, // Gerdau Filial RJ - Rio de Janeiro, RJ
};

export const BRAZILIAN_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Capitais de Todos os 26 Estados + DF
  'SAO PAULO': { lat: -23.5505, lng: -46.6333 },
  'RIO DE JANEIRO': { lat: -22.9068, lng: -43.1729 },
  'BELO HORIZONTE': { lat: -19.9167, lng: -43.9345 },
  'CURITIBA': { lat: -25.4284, lng: -49.2733 },
  'PORTO ALEGRE': { lat: -30.0346, lng: -51.2177 },
  'FLORIANOPOLIS': { lat: -27.5954, lng: -48.5480 },
  'SALVADOR': { lat: -12.9777, lng: -38.5016 },
  'RECIFE': { lat: -8.0476, lng: -34.8770 },
  'FORTALEZA': { lat: -3.7319, lng: -38.5267 },
  'BRASILIA': { lat: -15.7975, lng: -47.8919 },
  'GOIANIA': { lat: -16.6869, lng: -49.2648 },
  'MANAUS': { lat: -3.1190, lng: -60.0217 },
  'BELEM': { lat: -1.4558, lng: -48.4902 },
  'VITORIA': { lat: -20.3155, lng: -40.3128 },
  'CAMPO GRANDE': { lat: -20.4697, lng: -54.6201 },
  'CUIABA': { lat: -15.6014, lng: -56.0979 },
  'NATAL': { lat: -5.7945, lng: -35.2110 },
  'JOAO PESSOA': { lat: -7.1195, lng: -34.8450 },
  'MACEIO': { lat: -9.6658, lng: -35.7351 },
  'TERESINA': { lat: -5.0920, lng: -42.8038 },
  'ARACAJU': { lat: -10.9472, lng: -37.0731 },
  'SAO LUIS': { lat: -2.5307, lng: -44.3068 },
  'PORTO VELHO': { lat: -8.7619, lng: -63.9039 },
  'PALMAS': { lat: -10.2491, lng: -48.3243 },
  'RIO BRANCO': { lat: -9.9749, lng: -67.8243 },
  'MACAPA': { lat: 0.0389, lng: -51.0664 },
  'BOA VISTA': { lat: 2.8235, lng: -60.6758 },

  // Minas Gerais - Polos Regionais em Suas Localizações Reais
  'SAO JOAO DO PARAISO': { lat: -15.3144, lng: -42.0144 }, // Norte de Minas (perto da divisa BA)
  'UBERLANDIA': { lat: -18.9186, lng: -48.2772 }, // Triângulo Mineiro
  'UBERABA': { lat: -19.7483, lng: -47.9319 }, // Triângulo Mineiro
  'ARAGUARI': { lat: -18.6481, lng: -48.1883 },
  'PATOS DE MINAS': { lat: -18.5789, lng: -46.5181 },
  'ITUIUTABA': { lat: -18.9689, lng: -49.4636 },
  'MONTES CLAROS': { lat: -16.7350, lng: -43.8617 }, // Norte de Minas
  'JANUARIA': { lat: -15.4833, lng: -44.3667 },
  'SALINAS': { lat: -16.1706, lng: -42.2883 },
  'PIRAPORA': { lat: -17.3550, lng: -44.9419 },
  'TEOFILO OTONI': { lat: -17.8575, lng: -41.5053 }, // Vale do Mucuri
  'ALMENARA': { lat: -16.1836, lng: -40.6944 }, // Vale do Jequitinhonha
  'DIAMANTINA': { lat: -18.2439, lng: -43.6003 },
  'GOVERNADOR VALADARES': { lat: -18.8511, lng: -41.9494 }, // Rio Doce
  'IPATINGA': { lat: -19.4686, lng: -42.5367 }, // Vale do Aço
  'CORONEL FABRICIANO': { lat: -19.5189, lng: -42.6289 },
  'TIMOTEO': { lat: -19.5828, lng: -42.6442 },
  'ITABIRA': { lat: -19.6192, lng: -43.2269 },
  'JOAO MONLEVADE': { lat: -19.8114, lng: -43.1736 },
  'BARAO DE COCAIS': { lat: -19.9450, lng: -43.4858 },
  'OURO PRETO': { lat: -20.3856, lng: -43.5036 },
  'MARIANA': { lat: -20.3778, lng: -43.4164 },
  'CONGONHAS': { lat: -20.4994, lng: -43.8569 },
  'SETE LAGOAS': { lat: -19.4589, lng: -44.2467 },
  'CURVELO': { lat: -18.7564, lng: -44.4308 },
  'DIVINOPOLIS': { lat: -20.1444, lng: -44.8878 }, // Centro-Oeste Mineiro
  'NOVA SERRANA': { lat: -19.8756, lng: -44.9839 },
  'ITAUNA': { lat: -20.0750, lng: -44.5758 },
  'PARA DE MINAS': { lat: -19.8608, lng: -44.6083 },
  'FORMIGA': { lat: -20.4636, lng: -45.4264 },
  'JUIZ DE FORA': { lat: -21.7642, lng: -43.3503 }, // Zona da Mata
  'UBA': { lat: -21.1206, lng: -42.9431 },
  'MURIAE': { lat: -21.1308, lng: -42.3664 },
  'VICOSA': { lat: -20.7539, lng: -42.8817 },
  'MANHUACU': { lat: -20.2581, lng: -42.0336 },
  'CATAGUASES': { lat: -21.3892, lng: -42.6967 },
  'LEOPOLDINA': { lat: -21.5317, lng: -42.6428 },
  'BARBACENA': { lat: -21.2258, lng: -43.7736 },
  'SAO JOAO DEL-REI': { lat: -21.1356, lng: -44.2617 },
  'POUSO ALEGRE': { lat: -22.2300, lng: -45.9367 }, // Sul de Minas
  'VARGINHA': { lat: -21.5517, lng: -45.4300 },
  'POCOS DE CALDAS': { lat: -21.7878, lng: -46.5614 },
  'PASSOS': { lat: -20.7189, lng: -46.6097 },
  'LAVRAS': { lat: -21.2450, lng: -44.9997 },
  'ALFENAS': { lat: -21.4258, lng: -45.9464 },
  'ITAJUBA': { lat: -22.4264, lng: -45.4531 },
  'SANTA RITA DO SAPUCAI': { lat: -22.2520, lng: -45.7036 },
  'TRES CORACOES': { lat: -21.6944, lng: -45.2536 },
  'SAO SEBASTIAO DO PARAISO': { lat: -20.9167, lng: -46.9833 },
  'PARACATU': { lat: -17.2222, lng: -46.8750 }, // Noroeste Mineiro
  'UNAI': { lat: -16.3575, lng: -46.9064 },
  'BETIM': { lat: -19.9678, lng: -44.1983 },
  'CONTAGEM': { lat: -19.9317, lng: -44.0536 },
  'NOVA LIMA': { lat: -19.9856, lng: -43.8469 },
  'SANTA LUZIA': { lat: -19.7697, lng: -43.8514 },
  'IBIRITE': { lat: -20.0219, lng: -44.0589 },
  'RIBEIRAO DAS NEVES': { lat: -19.7667, lng: -44.0867 },
  'SABARA': { lat: -19.8917, lng: -43.8058 },
  'VESPASIANO': { lat: -19.6917, lng: -43.9236 },
  'LAGOA SANTA': { lat: -19.6264, lng: -43.7881 },
  'PEDRO LEOPOLDO': { lat: -19.6181, lng: -44.0436 },

  // São Paulo
  'CAMPINAS': { lat: -22.9056, lng: -47.0608 },
  'GUARULHOS': { lat: -23.4542, lng: -46.5341 },
  'SANTO ANDRE': { lat: -23.6638, lng: -46.5383 },
  'SAO BERNARDO DO CAMPO': { lat: -23.6944, lng: -46.5654 },
  'SAO CAETANO DO SUL': { lat: -23.6229, lng: -46.5546 },
  'OSASCO': { lat: -23.5329, lng: -46.7916 },
  'BARUERI': { lat: -23.5109, lng: -46.8761 },
  'JUNDIAI': { lat: -23.1857, lng: -46.8892 },
  'SOROCABA': { lat: -23.5015, lng: -47.4587 },
  'RIBEIRAO PRETO': { lat: -21.1767, lng: -47.8208 },
  'SAO JOSE DOS CAMPOS': { lat: -23.2237, lng: -45.9009 },
  'SANTOS': { lat: -23.9608, lng: -46.3336 },
  'VALINHOS': { lat: -22.9708, lng: -46.9958 },
  'PIRACICABA': { lat: -22.7253, lng: -47.6492 },
  'INDAIATUBA': { lat: -23.0903, lng: -47.2181 },
  'AMERICANA': { lat: -22.7375, lng: -47.3331 },
  'ARARAQUARA': { lat: -21.7944, lng: -48.1756 },
  'SAO CARLOS': { lat: -22.0175, lng: -47.8908 },
  'BAURU': { lat: -22.3147, lng: -49.0606 },
  'FRANCA': { lat: -20.5386, lng: -47.4008 },
  'MARILIA': { lat: -22.2139, lng: -49.9458 },
  'PRESIDENTE PRUDENTE': { lat: -22.1256, lng: -51.3889 },
  'TAUBATE': { lat: -23.0264, lng: -45.5558 },
  'LIMEIRA': { lat: -22.5647, lng: -47.4017 },
  'SUZANO': { lat: -23.5425, lng: -46.3108 },
  'MOGI DAS CRUZES': { lat: -23.5206, lng: -46.1856 },
  'ITAPECERICA DA SERRA': { lat: -23.7172, lng: -46.8492 },
  'COTIA': { lat: -23.6039, lng: -46.9189 },
  'DIADEMA': { lat: -23.6865, lng: -46.6234 },
  'MAUA': { lat: -23.6678, lng: -46.4614 },
  'HORTOLANDIA': { lat: -22.8583, lng: -47.2200 },
  'SUMARE': { lat: -22.8206, lng: -47.2669 },
  'RIO CLARO': { lat: -22.4114, lng: -47.5614 },
  'CAJAMAR': { lat: -23.3564, lng: -46.8778 },
  'CUBATAO': { lat: -23.8950, lng: -46.4253 },
  'SAO JOSE DO RIO PRETO': { lat: -20.8114, lng: -49.3758 },
  'JACAREI': { lat: -23.3056, lng: -45.9658 },
  'ARACATUBA': { lat: -21.2089, lng: -50.4328 },
  'BOTUCATU': { lat: -22.8858, lng: -48.4450 },
  'JAU': { lat: -22.2964, lng: -48.5589 },
  'BRAGANCA PAULISTA': { lat: -22.9528, lng: -46.5419 },
  'ITU': { lat: -23.2642, lng: -47.2992 },
  'PAULINIA': { lat: -22.7611, lng: -47.1539 },
  'SERTAOZINHO': { lat: -21.1350, lng: -47.9892 },
  'SANTA BARBARA D OESTE': { lat: -22.7539, lng: -47.4139 },
  'MOGI GUACU': { lat: -22.3708, lng: -46.9428 },
  'PINDAMONHANGABA': { lat: -22.9247, lng: -45.4614 },
  'GUARATINGUETA': { lat: -22.8164, lng: -45.1928 },
  'CARAGUATATUBA': { lat: -23.6228, lng: -45.4125 },
  'PRAIA GRANDE': { lat: -24.0058, lng: -46.4028 },

  // Santa Catarina
  'JARAGUA DO SUL': { lat: -26.4850, lng: -49.0800 },
  'JOINVILLE': { lat: -26.3045, lng: -48.8487 },
  'BLUMENAU': { lat: -26.9194, lng: -49.0661 },
  'ITAJAI': { lat: -26.9078, lng: -48.6619 },
  'CHAPECO': { lat: -27.1004, lng: -52.6152 },
  'CRICIUMA': { lat: -28.6775, lng: -49.3704 },
  'BALNEARIO CAMBORIU': { lat: -26.9926, lng: -48.6353 },
  'BRUSQUE': { lat: -27.0978, lng: -48.9106 },
  'LAGES': { lat: -27.8156, lng: -50.3261 },
  'TUBARAO': { lat: -28.4742, lng: -49.0069 },
  'SAO JOSE': { lat: -27.6136, lng: -48.6364 },
  'PALHOCA': { lat: -27.6450, lng: -48.6678 },
  'CONCORDIA': { lat: -27.2336, lng: -52.0258 },
  'SAO BENTO DO SUL': { lat: -26.2503, lng: -49.3786 },
  'TIJUCAS': { lat: -27.2414, lng: -48.6347 },

  // Rio Grande do Sul
  'CAXIAS DO SUL': { lat: -29.1683, lng: -51.1794 },
  'CANOAS': { lat: -29.9179, lng: -51.1836 },
  'NOVO HAMBURGO': { lat: -29.6800, lng: -51.1300 },
  'PASSO FUNDO': { lat: -28.2612, lng: -52.4083 },
  'PELOTAS': { lat: -31.7654, lng: -52.3376 },
  'SANTA MARIA': { lat: -29.6842, lng: -53.8069 },
  'RIO GRANDE': { lat: -32.0350, lng: -52.0986 },
  'BENTO GONCALVES': { lat: -29.1717, lng: -51.5189 },
  'CARLOS BARBOSA': { lat: -29.2978, lng: -51.5036 },
  'SAO LEOPOLDO': { lat: -29.7603, lng: -51.1475 },
  'GRAVATAI': { lat: -29.9422, lng: -50.9928 },
  'ERECHIM': { lat: -27.6339, lng: -52.2689 },
  'SANTA CRUZ DO SUL': { lat: -29.7189, lng: -52.4264 },
  'URUGUAIANA': { lat: -29.7547, lng: -57.0883 },

  // Paraná
  'LONDRINA': { lat: -23.3045, lng: -51.1696 },
  'MARINGA': { lat: -23.4210, lng: -51.9331 },
  'CASCAVEL': { lat: -24.9578, lng: -53.4595 },
  'PONTA GROSSA': { lat: -25.0994, lng: -50.1583 },
  'SAO JOSE DOS PINHAIS': { lat: -25.5347, lng: -49.2064 },
  'FOZ DO IGUACU': { lat: -25.5478, lng: -54.5881 },
  'PARANAGUA': { lat: -25.5206, lng: -48.5092 },
  'TOLEDO': { lat: -24.7136, lng: -53.7431 },
  'ARAUCARIA': { lat: -25.5928, lng: -49.4089 },
  'TELEMACO BORBA': { lat: -24.3239, lng: -50.6158 },
  'CAMPO MOURAO': { lat: -24.0439, lng: -52.3789 },
  'GUARAPUAVA': { lat: -25.3950, lng: -51.4625 },
  'APUCARANA': { lat: -23.5514, lng: -51.4614 },
  'UMUARAMA': { lat: -23.7664, lng: -53.3250 },
  'PATO BRANCO': { lat: -26.2289, lng: -52.6708 },
  'FRANCISCO BELTRAO': { lat: -26.0811, lng: -53.0550 },

  // Rio de Janeiro
  'DUQUE DE CAXIAS': { lat: -22.7858, lng: -43.3117 },
  'MACAE': { lat: -22.3768, lng: -41.7869 },
  'NITEROI': { lat: -22.8833, lng: -43.1036 },
  'VOLTA REDONDA': { lat: -22.5231, lng: -44.1042 },
  'BARRA MANSA': { lat: -22.5442, lng: -44.1714 },
  'RESENDE': { lat: -22.4689, lng: -44.4467 },
  'CAMPOS DOS GOYTACAZES': { lat: -21.7544, lng: -41.3244 },
  'PETROPOLIS': { lat: -22.5050, lng: -43.1789 },
  'ANGRA DOS REIS': { lat: -23.0067, lng: -44.3181 },
  'NOVA IGUACU': { lat: -22.7558, lng: -43.4508 },
  'SAO GONCALO': { lat: -22.8269, lng: -43.0539 },
  'CABO FRIO': { lat: -22.8794, lng: -42.0189 },
  'TERESOPOLIS': { lat: -22.4125, lng: -42.9664 },

  // Bahia & Nordeste
  'CAMACARI': { lat: -12.6975, lng: -38.3242 },
  'FEIRA DE SANTANA': { lat: -12.2664, lng: -38.9663 },
  'VITORIA DA CONQUISTA': { lat: -14.8661, lng: -40.8394 },
  'ILHEUS': { lat: -14.7889, lng: -39.0494 },
  'ITABUNA': { lat: -14.7939, lng: -39.2789 },
  'JUAZEIRO': { lat: -9.4167, lng: -40.5033 },
  'LAURO DE FREITAS': { lat: -12.8944, lng: -38.3272 },
  'SIMOES FILHO': { lat: -12.7864, lng: -38.4039 },
  'BARREIRAS': { lat: -12.1528, lng: -44.9961 },
  'LUIS EDUARDO MAGALHAES': { lat: -12.0958, lng: -45.7958 },
  'ALAGOINHAS': { lat: -12.1356, lng: -38.4192 },
  'JEQUIE': { lat: -13.8575, lng: -40.0839 },
  'CAMPINA GRANDE': { lat: -7.2247, lng: -35.8817 },
  'CARUARU': { lat: -8.2833, lng: -35.9667 },
  'PETROLINA': { lat: -9.3892, lng: -40.5028 },
  'JABOATAO DOS GUARARAPES': { lat: -8.1131, lng: -35.0150 },
  'CABO DE SANTO AGOSTINHO': { lat: -8.2833, lng: -35.0333 },
  'BELO JARDIM': { lat: -8.3347, lng: -36.4258 },
  'JUAZEIRO DO NORTE': { lat: -7.2133, lng: -39.3150 },
  'SOBRAL': { lat: -3.6892, lng: -40.3481 },
  'MARACANAU': { lat: -3.8767, lng: -38.6256 },
  'CAUCAIA': { lat: -3.7389, lng: -38.6489 },
  'EUSEBIO': { lat: -3.8914, lng: -38.4558 },
  'MOSSORO': { lat: -5.1878, lng: -37.3442 },
  'IMPERATRIZ': { lat: -5.5264, lng: -47.4917 },
  'ARAPIRACA': { lat: -9.7550, lng: -36.6608 },

  // Centro-Oeste & Norte
  'ANAPOLIS': { lat: -16.3268, lng: -48.9534 },
  'RIO VERDE': { lat: -17.7925, lng: -50.9192 },
  'APARECIDA DE GOIANIA': { lat: -16.8239, lng: -49.2439 },
  'ITUMBIARA': { lat: -18.4144, lng: -49.2164 },
  'CATALAO': { lat: -18.1658, lng: -47.9464 },
  'JATAI': { lat: -17.8814, lng: -51.7144 },
  'SINOP': { lat: -11.8608, lng: -55.5097 },
  'RONDONOPOLIS': { lat: -16.4708, lng: -54.6356 },
  'SORRISO': { lat: -12.5447, lng: -55.7236 },
  'LUCAS DO RIO VERDE': { lat: -13.0567, lng: -55.9114 },
  'VARZEA GRANDE': { lat: -15.6467, lng: -56.1325 },
  'DOURADOS': { lat: -22.2231, lng: -54.8064 },
  'TRES LAGOAS': { lat: -20.7850, lng: -51.7058 },
  'PARAUAPEBAS': { lat: -6.0683, lng: -49.9042 },
  'MARABA': { lat: -5.3686, lng: -49.1178 },
  'SANTAREM': { lat: -2.4431, lng: -54.7083 },
  'BARCARENA': { lat: -1.5058, lng: -48.6214 },
  'ARAGUAINA': { lat: -7.1925, lng: -48.2047 },
  'GURUPI': { lat: -11.7292, lng: -49.0686 },
  'JI-PARANA': { lat: -10.8828, lng: -61.9458 },
  'ARIQUEMES': { lat: -9.9133, lng: -63.0408 },
  'VILHENA': { lat: -12.7406, lng: -60.1458 },
};

export const STATE_CAPITAL_COORDINATES: Record<string, { lat: number; lng: number }> = {
  SP: { lat: -23.5505, lng: -46.6333 },
  RJ: { lat: -22.9068, lng: -43.1729 },
  MG: { lat: -19.9167, lng: -43.9345 },
  PR: { lat: -25.4284, lng: -49.2733 },
  SC: { lat: -27.5954, lng: -48.5480 },
  RS: { lat: -30.0346, lng: -51.2177 },
  BA: { lat: -12.9777, lng: -38.5016 },
  PE: { lat: -8.0476, lng: -34.8770 },
  CE: { lat: -3.7319, lng: -38.5267 },
  DF: { lat: -15.7975, lng: -47.8919 },
  GO: { lat: -16.6869, lng: -49.2648 },
  ES: { lat: -20.3155, lng: -40.3128 },
  AM: { lat: -3.1190, lng: -60.0217 },
  PA: { lat: -1.4558, lng: -48.4902 },
  MT: { lat: -15.6014, lng: -56.0979 },
  MS: { lat: -20.4697, lng: -54.6201 },
  MA: { lat: -2.5307, lng: -44.3068 },
  PB: { lat: -7.1195, lng: -34.8450 },
  RN: { lat: -5.7945, lng: -35.2110 },
  AL: { lat: -9.6658, lng: -35.7351 },
  SE: { lat: -10.9472, lng: -37.0731 },
  PI: { lat: -5.0920, lng: -42.8038 },
  RO: { lat: -8.7619, lng: -63.9039 },
  TO: { lat: -10.2491, lng: -48.3243 },
  AC: { lat: -9.9749, lng: -67.8243 },
  AP: { lat: 0.0389, lng: -51.0664 },
  RR: { lat: 2.8235, lng: -60.6758 },
};

export function normalizeCityName(city: string): string {
  return (city || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Obtém coordenadas para município e UF com precisão oficial do IBGE
 */
export function getCoordinatesForCity(city: string, uf: string, cnpjSeed = ''): { lat: number; lng: number } {
  const cleanCnpj = cnpjSeed ? cnpjSeed.replace(/\D/g, '') : '';
  if (cleanCnpj && VERIFIED_COMPANY_COORDINATES[cleanCnpj]) {
    return VERIFIED_COMPANY_COORDINATES[cleanCnpj];
  }

  const cleanUf = (uf || '').toUpperCase().trim();
  const normCity = normalizeCityName(city);
  const normCompactCity = (city || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9]/g, '');
  const cityUfKey = `${normCompactCity}_${cleanUf}`;

  // 1. Catálogo oficial de todos os 5.571 municípios do Brasil (IBGE)
  const allCoords = brazilianMunicipalitiesCoords as unknown as Record<string, [number, number]>;
  if (allCoords[cityUfKey]) {
    return { lat: allCoords[cityUfKey][0], lng: allCoords[cityUfKey][1] };
  }
  if (allCoords[normCompactCity]) {
    return { lat: allCoords[normCompactCity][0], lng: allCoords[normCompactCity][1] };
  }

  // 2. Base rápida de capitais e polos regionais
  let baseCoords = BRAZILIAN_CITY_COORDINATES[normCity];

  // 3. Fallback para capital estadual apenas se o município for desconhecido
  if (!baseCoords) {
    baseCoords = STATE_CAPITAL_COORDINATES[cleanUf] || { lat: -15.7975, lng: -47.8919 };
  }

  return baseCoords;
}

/**
 * Cálculo de distância em quilômetros usando a Fórmula de Haversine
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Cache em memória e armazenamento persistente de geolocalização de alta precisão
const GEO_CACHE = new Map<string, { lat: number; lng: number }>();

/**
 * Consulta de precisão geográfica utilizando exclusivamente Cidade, Estado e CEP
 * Evita quaisquer problemas ou falhas associados a nomes de ruas ou números.
 */
export async function fetchPreciseCoordinates(params: {
  cep?: string;
  municipio: string;
  uf: string;
  cnpj?: string;
  signal?: AbortSignal;
}): Promise<{ lat: number; lng: number }> {
  const cleanCnpj = (params.cnpj || '').replace(/\D/g, '');
  if (cleanCnpj && VERIFIED_COMPANY_COORDINATES[cleanCnpj]) {
    return VERIFIED_COMPANY_COORDINATES[cleanCnpj];
  }

  const cleanCep = (params.cep || '').replace(/\D/g, '');
  const cleanMun = normalizeCityName(params.municipio || '');
  const cleanUf = (params.uf || '').toUpperCase().trim();
  const cacheKey = cleanCep.length === 8 
    ? `cep_${cleanCep}`
    : `loc_${cleanMun}_${cleanUf}`;

  if (GEO_CACHE.has(cacheKey)) {
    return GEO_CACHE.get(cacheKey)!;
  }

  // Verifica cache em localStorage
  try {
    const stored = localStorage.getItem(`prospec_geo_${cacheKey}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number' && !isNaN(parsed.lat)) {
        GEO_CACHE.set(cacheKey, parsed);
        return parsed;
      }
    }
  } catch {
    // ignora restrição de quota
  }

  const saveToCache = (coords: { lat: number; lng: number }) => {
    GEO_CACHE.set(cacheKey, coords);
    try {
      localStorage.setItem(`prospec_geo_${cacheKey}`, JSON.stringify(coords));
    } catch {
      // ignora quota
    }
  };

  // 1. Consulta BrasilAPI CEP v2 por CEP
  if (cleanCep.length === 8 && !params.signal?.aborted) {
    const cepUrls = [
      `/api/cep/${cleanCep}`,
      `https://brasilapi.com.br/api/cep/v2/${cleanCep}`,
    ];

    for (const url of cepUrls) {
      if (params.signal?.aborted) break;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2200);
        const combinedSignal = params.signal || controller.signal;

        const res = await fetch(url, {
          signal: combinedSignal,
          headers: { 'Accept': 'application/json' },
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const rawLat = data.location?.coordinates?.latitude;
          const rawLng = data.location?.coordinates?.longitude;

          if (rawLat !== undefined && rawLng !== undefined) {
            const lat = parseFloat(String(rawLat));
            const lng = parseFloat(String(rawLng));

            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              const coords = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
              saveToCache(coords);
              return coords;
            }
          }
        }
      } catch {
        // Tenta próximo
      }
    }
  }

  // 2. Consulta Nominatim por Código Postal (CEP)
  if (cleanCep.length === 8 && !params.signal?.aborted) {
    const nomCepUrls = [
      `/api/nominatim/search?format=json&postalcode=${cleanCep}&country=Brazil&limit=1`,
      `https://nominatim.openstreetmap.org/search?format=json&postalcode=${cleanCep}&country=Brazil&limit=1`,
    ];

    for (const url of nomCepUrls) {
      if (params.signal?.aborted) break;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        const combinedSignal = params.signal || controller.signal;

        const res = await fetch(url, { 
          signal: combinedSignal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'ZethusProspec/2.0 (contato@zethusprospec.com.br)',
          }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const results = await res.json();
          if (Array.isArray(results) && results.length > 0) {
            const lat = parseFloat(results[0].lat);
            const lng = parseFloat(results[0].lon);
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              const coords = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
              saveToCache(coords);
              return coords;
            }
          }
        }
      } catch {
        // Tenta próximo
      }
    }
  }

  // 3. Consulta direta no catálogo oficial de 5.571 municípios do Brasil (IBGE)
  const normCompactCity = (params.municipio || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9]/g, '');
  const cityUfKey = `${normCompactCity}_${cleanUf}`;
  const allCoords = brazilianMunicipalitiesCoords as unknown as Record<string, [number, number]>;
  if (allCoords[cityUfKey]) {
    const coords = { lat: allCoords[cityUfKey][0], lng: allCoords[cityUfKey][1] };
    saveToCache(coords);
    return coords;
  }
  if (allCoords[normCompactCity]) {
    const coords = { lat: allCoords[normCompactCity][0], lng: allCoords[normCompactCity][1] };
    saveToCache(coords);
    return coords;
  }

  // 4. Consulta expressa na tabela de referência
  if (cleanMun && BRAZILIAN_CITY_COORDINATES[cleanMun]) {
    const coords = BRAZILIAN_CITY_COORDINATES[cleanMun];
    saveToCache(coords);
    return coords;
  }

  // 4. Consulta Nominatim por Município e Estado (quando cidade nova não está na tabela estática)
  if (params.municipio && cleanUf && !params.signal?.aborted) {
    const nomCityUrls = [
      `/api/nominatim/search?format=json&city=${encodeURIComponent(params.municipio)}&state=${encodeURIComponent(cleanUf)}&country=Brazil&limit=1`,
      `https://nominatim.openstreetmap.org/search?format=json&city=${encodeURIComponent(params.municipio)}&state=${encodeURIComponent(cleanUf)}&country=Brazil&limit=1`,
    ];

    for (const url of nomCityUrls) {
      if (params.signal?.aborted) break;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        const combinedSignal = params.signal || controller.signal;

        const res = await fetch(url, { 
          signal: combinedSignal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'ZethusProspec/2.0 (contato@zethusprospec.com.br)',
          }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const results = await res.json();
          if (Array.isArray(results) && results.length > 0) {
            const lat = parseFloat(results[0].lat);
            const lng = parseFloat(results[0].lon);
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              const coords = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
              saveToCache(coords);
              return coords;
            }
          }
        }
      } catch {
        // Tenta próximo
      }
    }
  }

  // 5. Base municipal de referência por Cidade e UF
  const fallback = getCoordinatesForCity(params.municipio, params.uf, params.cnpj);
  saveToCache(fallback);
  return fallback;
}

/**
 * Regiões Oficiais do Brasil e seus respectivos Estados (UF)
 */
export const REGIOES_BRASIL: Record<string, string[]> = {
  'Sudeste': ['SP', 'RJ', 'MG', 'ES'],
  'Sul': ['PR', 'SC', 'RS'],
  'Nordeste': ['BA', 'PE', 'CE', 'MA', 'PB', 'RN', 'AL', 'PI', 'SE'],
  'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
  'Norte': ['AM', 'PA', 'RO', 'TO', 'AC', 'AP', 'RR'],
};

export const LISTA_REGIOES = Object.keys(REGIOES_BRASIL);

export function getRegiaoFromUf(uf: string): string | null {
  const ufUpper = (uf || '').toUpperCase().trim();
  for (const [regiao, ufs] of Object.entries(REGIOES_BRASIL)) {
    if (ufs.includes(ufUpper)) {
      return regiao;
    }
  }
  return null;
}


