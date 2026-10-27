import L from 'leaflet';
import { Supplier } from '../types/supplier';

export interface MapCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  suppliers: Supplier[];
  bounds: L.LatLngBounds;
  primaryCity: string;
  primaryUf: string;
  avgScore: number;
  hasCriticalRisk: boolean;
  hasInactive: boolean;
}

export interface ClusterResult {
  clusters: MapCluster[];
  singles: Supplier[];
}

/**
 * Algoritmo espacial O(N) de alta performance para agrupamento dinâmico em grade de pixels.
 * Reduz milhares de marcadores sobrepostos para poucas dezenas de clusters visuais,
 * mantendo a taxa de quadros (FPS) a 60 FPS com consumo mínimo de memória.
 */
export function clusterSuppliers(
  map: L.Map,
  suppliers: Supplier[],
  options?: {
    radiusPx?: number;
    maxZoom?: number;
    enabled?: boolean;
  }
): ClusterResult {
  const enabled = options?.enabled !== false;
  const radius = options?.radiusPx || 55;
  const maxZoom = options?.maxZoom || 13;
  const currentZoom = map.getZoom();

  const validSuppliers = suppliers.filter(
    (s) => s.endereco.latitude && s.endereco.longitude
  );

  // Se o clustering estiver desativado ou o zoom estiver muito aproximado (nível de rua/bairro),
  // exibe os marcadores individuais
  if (!enabled || currentZoom >= maxZoom || validSuppliers.length < 30) {
    return {
      clusters: [],
      singles: validSuppliers,
    };
  }

  // Agrupamento em grade espacial de pixels 2D
  const grid = new Map<string, Supplier[]>();

  for (let i = 0; i < validSuppliers.length; i++) {
    const s = validSuppliers[i];
    const lat = s.endereco.latitude!;
    const lng = s.endereco.longitude!;

    const point = map.latLngToLayerPoint([lat, lng]);
    const gx = Math.floor(point.x / radius);
    const gy = Math.floor(point.y / radius);
    const key = `${gx}:${gy}`;

    let bucket = grid.get(key);
    if (!bucket) {
      bucket = [];
      grid.set(key, bucket);
    }
    bucket.push(s);
  }

  const clusters: MapCluster[] = [];
  const singles: Supplier[] = [];

  let clusterIndex = 0;

  grid.forEach((bucket, key) => {
    if (bucket.length === 1) {
      singles.push(bucket[0]);
      return;
    }

    // Calcula centro geográfico médio e limites (bounds)
    let sumLat = 0;
    let sumLng = 0;
    let sumScore = 0;
    let hasCriticalRisk = false;
    let hasInactive = false;
    const latLngs: L.LatLng[] = [];

    const cityCounts = new Map<string, number>();

    for (let j = 0; j < bucket.length; j++) {
      const item = bucket[j];
      const lat = item.endereco.latitude!;
      const lng = item.endereco.longitude!;
      sumLat += lat;
      sumLng += lng;
      sumScore += item.analiseFinanceira.scoreGeral || 70;

      if (item.situacaoCadastral !== 'ATIVA') {
        hasInactive = true;
      }
      if (item.analiseFinanceira.nivelRisco === 'CRITICO') {
        hasCriticalRisk = true;
      }

      latLngs.push(L.latLng(lat, lng));

      const cityKey = `${item.endereco.municipio || ''}-${item.endereco.uf || ''}`;
      cityCounts.set(cityKey, (cityCounts.get(cityKey) || 0) + 1);
    }

    const count = bucket.length;
    const centerLat = sumLat / count;
    const centerLng = sumLng / count;
    const avgScore = Math.round(sumScore / count);

    // Cidade mais frequente no cluster
    let topCityKey = '';
    let topCityCount = 0;
    cityCounts.forEach((c, k) => {
      if (c > topCityCount) {
        topCityCount = c;
        topCityKey = k;
      }
    });

    const [primaryCity, primaryUf] = topCityKey.split('-');

    clusters.push({
      id: `cluster-${key}-${clusterIndex++}`,
      lat: centerLat,
      lng: centerLng,
      count,
      suppliers: bucket,
      bounds: L.latLngBounds(latLngs),
      primaryCity: primaryCity || bucket[0].endereco.municipio,
      primaryUf: primaryUf || bucket[0].endereco.uf,
      avgScore,
      hasCriticalRisk,
      hasInactive,
    });
  });

  return { clusters, singles };
}
