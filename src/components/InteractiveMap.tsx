import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Maximize2, 
  MapPin, 
  Building,
  Moon,
  Map as MapIcon,
  Satellite
} from 'lucide-react';
import { Supplier } from '../types/supplier';
import { getCoordinatesForCity } from '../services/geoCoordinates';

interface InteractiveMapProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSelectSupplier: (supplier: Supplier) => void;
  onOpenDetails: (supplier: Supplier) => void;
  userLocation: { lat: number; lng: number } | null;
  isVisible?: boolean;
}

type MapTheme = 'dark' | 'osm' | 'satellite';

/**
 * Criação sob demanda (lazy) do HTML do popup apenas quando o usuário clica no pin.
 * Evita alocar milhares de nós DOM desnecessários na inicialização.
 */
function createSupplierPopupContent(supplier: Supplier, onOpenDetails: (s: Supplier) => void): HTMLElement {
  let color = '#10b981'; // Emerald
  if (supplier.situacaoCadastral === 'BAIXADA') {
    color = '#f43f5e'; // Rose
  } else if (supplier.situacaoCadastral === 'SUSPENSA') {
    color = '#f59e0b'; // Amber
  } else if (supplier.analiseFinanceira.nivelRisco === 'CRITICO') {
    color = '#a855f7'; // Purple
  } else if (supplier.analiseFinanceira.scoreGeral < 65) {
    color = '#f59e0b'; // Amber
  }

  const popupHtml = document.createElement('div');
  popupHtml.className = 'p-3.5 bg-slate-900 text-slate-100 rounded-xl min-w-[260px] max-w-[310px] shadow-2xl';
  popupHtml.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${color}; letter-spacing: 0.5px;">
          ${supplier.situacaoCadastral}
        </span>
        <span style="font-size: 9px; padding: 1px 4px; border-radius: 4px; background: rgba(59, 130, 246, 0.15); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); font-weight: 600;">
          ${supplier.tipoEstabelecimento}
        </span>
      </div>
      <span style="font-size: 11px; font-weight: 700; font-family: monospace; color: #94a3b8;">
        Score: <strong style="color: ${color};">${supplier.analiseFinanceira.scoreGeral}</strong>/100
      </span>
    </div>
    <div style="margin-bottom: 4px;">
      <span style="display: inline-block; font-size: 9px; padding: 1px 5px; border-radius: 4px; background: rgba(15, 23, 42, 0.8); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: 600;">
        ${supplier.regimeTributario}
      </span>
    </div>
    <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 2px 0; line-height: 1.3;">
      ${supplier.nomeFantasia || supplier.razaoSocial}
    </h4>
    <p style="font-size: 11px; color: #94a3b8; margin: 0 0 8px 0; line-height: 1.2;">
      ${supplier.razaoSocial}
    </p>
    <div style="background: rgba(2, 6, 23, 0.6); padding: 5px 8px; border-radius: 6px; font-family: monospace; font-size: 11px; color: #93c5fd; margin-bottom: 6px;">
      CNPJ: ${supplier.formattedCnpj}
    </div>
    <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px; line-height: 1.4;">
      <div style="display: flex; align-items: flex-start; gap: 6px;">
        <span style="font-size: 13px; line-height: 1.2;">📍</span>
        <div>
          <div style="color: #f1f5f9; font-weight: 600; font-size: 12px;">
            ${supplier.endereco.municipio} - ${supplier.endereco.uf}
          </div>
          <div style="color: #94a3b8; font-size: 10px; font-family: monospace; margin-top: 2px;">
            CEP: ${supplier.endereco.cep || 'Não informado'}
          </div>
        </div>
      </div>
    </div>
    ${supplier.contato?.email ? `
      <div style="font-size: 10px; color: #93c5fd; font-family: monospace; margin-bottom: 8px; background: rgba(59, 130, 246, 0.1); padding: 3px 6px; border-radius: 6px; border: 1px solid rgba(59, 130, 246, 0.2); word-break: break-all;">
        ✉️ ${supplier.contato.email}
      </div>
    ` : ''}
    <button 
      type="button" 
      class="zethus-btn-dossie" 
      data-supplier-id="${supplier.id}" 
      style="width: 100%; padding: 7px 12px; background: #2563eb; color: #ffffff; font-size: 11px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"
    >
      Abrir Dossiê Completo
    </button>
  `;

  L.DomEvent.disableClickPropagation(popupHtml);
  L.DomEvent.disableScrollPropagation(popupHtml);

  const btnEl = popupHtml.querySelector<HTMLButtonElement>('.zethus-btn-dossie');
  if (btnEl) {
    L.DomEvent.disableClickPropagation(btnEl);
    btnEl.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onOpenDetails(supplier);
    };
  }

  popupHtml.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('.zethus-btn-dossie');
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      onOpenDetails(supplier);
    }
  });

  return popupHtml;
}

/**
 * Cria o marcador visual individual para uma empresa
 */
function createSingleSupplierIcon(supplier: Supplier): L.DivIcon {
  let color = '#10b981'; // Emerald
  let glowColor = 'rgba(16, 185, 129, 0.4)';

  if (supplier.situacaoCadastral === 'BAIXADA') {
    color = '#f43f5e'; // Rose
    glowColor = 'rgba(244, 63, 94, 0.4)';
  } else if (supplier.situacaoCadastral === 'SUSPENSA') {
    color = '#f59e0b'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
  } else if (supplier.analiseFinanceira.nivelRisco === 'CRITICO') {
    color = '#a855f7'; // Purple
    glowColor = 'rgba(168, 85, 247, 0.4)';
  } else if (supplier.analiseFinanceira.scoreGeral < 65) {
    color = '#f59e0b'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.4)';
  }

  const markerHtml = `
    <div class="supplier-pin-inner" style="position: relative; width: 28px; height: 28px; cursor: pointer;">
      <div style="width: 100%; height: 100%; background: ${color}; border: 2px solid #0f172a; border-radius: 50%; box-shadow: 0 3px 8px ${glowColor}; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 10px; font-weight: 700; font-family: monospace;">
        ${supplier.analiseFinanceira.scoreGeral}
      </div>
    </div>
  `;

  return L.divIcon({
    className: `supplier-pin-${supplier.id}`,
    html: markerHtml,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  suppliers,
  selectedSupplier,
  onSelectSupplier,
  onOpenDetails,
  userLocation,
  isVisible = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const onOpenDetailsRef = useRef(onOpenDetails);
  onOpenDetailsRef.current = onOpenDetails;
  const suppliersRef = useRef(suppliers);
  suppliersRef.current = suppliers;

  useEffect(() => {
    // Fallback global para abertura imediata do Dossiê a partir do mapa
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__zethusOpenDossier = (supplierId: string) => {
      const match = suppliersRef.current.find(
        s => String(s.id) === String(supplierId) || String(s.cnpj) === String(supplierId)
      );
      if (match) {
        onOpenDetailsRef.current(match);
      }
    };
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__zethusOpenDossier;
    };
  }, []);

  const [mapTheme, setMapTheme] = useState<MapTheme>(() => {
    try {
      const saved = localStorage.getItem('zethus_map_theme') as MapTheme;
      if (saved === 'dark' || saved === 'osm' || saved === 'satellite') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'dark';
  });

  const handleThemeChange = (theme: MapTheme) => {
    setMapTheme(theme);
    try {
      localStorage.setItem('zethus_map_theme', theme);
    } catch {
      // ignore
    }
  };

  // Tile URLs confiáveis, gratuitos e sem watermark de API Key
  const tileUrls: Record<MapTheme, { url: string; attribution: string; maxZoom?: number; maxNativeZoom?: number }> = {
    dark: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; World Dark Gray Base',
      maxZoom: 19,
      maxNativeZoom: 16,
    },
    osm: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      maxNativeZoom: 19,
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; High-Resolution Satellite',
      maxZoom: 19,
      maxNativeZoom: 18,
    },
  };

  // Inicializa mapa Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centro inicial do Brasil com flags de alta performance
      const map = L.map(mapContainerRef.current, {
        center: [-15.7801, -47.9292],
        zoom: 4,
        zoomControl: false,
        preferCanvas: true,
        wheelDebounceTime: 60,
      });

      // Zoom control no canto superior direito
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Adiciona camada base otimizada
      const tile = L.tileLayer(tileUrls[mapTheme].url, {
        attribution: tileUrls[mapTheme].attribution,
        maxZoom: 19,
        subdomains: 'abcd',
        keepBuffer: 3,
        updateWhenIdle: true,
        updateWhenZooming: false,
      }).addTo(map);

      tileLayerRef.current = tile;

      // Grupo para markers
      const markerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markerGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalida tamanho do mapa para garantir renderização perfeita quando a aba mobile é aberta
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const timer1 = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize({ pan: false });
    }, 50);
    const timer2 = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize({ pan: false });
    }, 180);
    const timer3 = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize({ pan: false });
    }, 400);
    const timer4 = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize({ pan: false });
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isVisible]);

  // ResizeObserver para detectar mudanças dinâmicas de viewport / aba mobile sem delay
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current && mapContainerRef.current) {
        const { offsetWidth, offsetHeight } = mapContainerRef.current;
        if (offsetWidth > 0 && offsetHeight > 0) {
          mapInstanceRef.current.invalidateSize({ pan: false });
        }
      }
    });

    resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Listener para redimensionamento de janela e orientação mobile
  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize({ pan: false });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Atualiza Camada Base quando muda o tema
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(tileUrls[mapTheme].url, {
      attribution: tileUrls[mapTheme].attribution,
      maxZoom: 19,
      maxNativeZoom: tileUrls[mapTheme].maxNativeZoom || 18,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [mapTheme]);

  // Atualiza Marcador da Localização do Usuário
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userLocation) {
      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
      }

      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; width: 24px; height: 24px; background: rgba(59, 130, 246, 0.35); border-radius: 50%; animation: pulse-ring 2s infinite;"></div>
            <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #2563eb; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `<div style="padding: 8px 12px; font-size: 12px; font-weight: 600; color: #60a5fa;">Sua Localização (Comprador)</div>`
        );

      userMarkerRef.current = marker;
    } else if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  const isInitialFitDone = useRef(false);
  const updateTimeoutRef = useRef<number | null>(null);

  // Renderiza Pins Individuais de Fornecedores no Mapa em suas localizações exatas
  const renderMarkers = () => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    markersLayer.clearLayers();
    markersMapRef.current.clear();

    const validSuppliers = suppliers.filter(
      (s) => s.endereco.latitude && s.endereco.longitude
    );

    // Renderiza Pins Individuais com dispersão sutil apenas para endereços estritamente sobrepostos
    const coordSeen = new Map<string, number>();
    validSuppliers.forEach((supplier) => {
      let origLat = supplier.endereco.latitude;
      let origLng = supplier.endereco.longitude;

      // Garante que empresas de municípios do interior fiquem exatamente em seus municípios de origem (ex: Veredinha, Lagoa dos Patos)
      const normMun = (supplier.endereco?.municipio || '').toUpperCase().trim();
      if (normMun && !normMun.includes('BELO HORIZONTE')) {
        const isNearBH = origLat && origLng && origLat >= -20.10 && origLat <= -19.75 && origLng >= -44.10 && origLng <= -43.75;
        if (!origLat || !origLng || isNearBH) {
          const exact = getCoordinatesForCity(supplier.endereco.municipio, supplier.endereco.uf, supplier.cnpj);
          if (exact) {
            origLat = exact.lat;
            origLng = exact.lng;
            supplier.endereco.latitude = origLat;
            supplier.endereco.longitude = origLng;
          }
        }
      }

      if (!origLat || !origLng) return;

      const coordKey = `${origLat.toFixed(4)},${origLng.toFixed(4)}`;
      const seenCount = coordSeen.get(coordKey) || 0;
      coordSeen.set(coordKey, seenCount + 1);

      let lat = origLat;
      let lng = origLng;
      if (seenCount > 0) {
        // Dispersão radial sutil para múltiplos fornecedores no mesmo endereço
        const angle = (seenCount * 2 * Math.PI) / 8;
        const radius = 0.00025 * Math.ceil(seenCount / 8);
        lat += radius * Math.cos(angle);
        lng += radius * Math.sin(angle);
      }

      const pinIcon = createSingleSupplierIcon(supplier);
      const marker = L.marker([lat, lng], { icon: pinIcon });

      marker.bindTooltip(
        `<div style="font-size: 11px; padding: 2px 4px; line-height: 1.3;">
          <strong style="color: #60a5fa;">📍 ${supplier.nomeFantasia || supplier.razaoSocial}</strong><br/>
          <span style="color: #cbd5e1;">${supplier.endereco.municipio} - ${supplier.endereco.uf}</span>
        </div>`,
        { direction: 'top', offset: [0, -10], opacity: 0.95 }
      );

      // GERAÇÃO DE POPUP LAZY: Cria o HTML apenas no momento do clique
      marker.bindPopup(() => createSupplierPopupContent(supplier, onOpenDetailsRef.current), {
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
        maxWidth: 320,
      });

      marker.on('click', () => {
        onSelectSupplier(supplier);
      });

      marker.addTo(markersLayer);
      markersMapRef.current.set(supplier.id, marker);
    });

    // Enquadra na primeira carga de fornecedores sem interromper a navegação posterior
    if (!isInitialFitDone.current && validSuppliers.length > 0) {
      const validPoints = validSuppliers.map(
        (s) => [s.endereco.latitude!, s.endereco.longitude!] as L.LatLngTuple
      );

      if (validPoints.length > 0) {
        isInitialFitDone.current = true;
        map.fitBounds(L.latLngBounds(validPoints), {
          padding: [50, 50],
          maxZoom: 13,
        });
      }
    }
  };

  // Agendador com throttle/debounce via requestAnimationFrame para evitar travamentos
  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        renderMarkers();
      });
    }, suppliers.length > 150 ? 120 : 30);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [suppliers]);

  // Efeito ao mudar o fornecedor selecionado: centraliza e abre popup
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedSupplier) return;
    const map = mapInstanceRef.current;
    const lat = selectedSupplier.endereco.latitude;
    const lng = selectedSupplier.endereco.longitude;
    if (!lat || !lng) return;

    map.setView([lat, lng], Math.max(map.getZoom(), 14), { animate: true });
    const marker = markersMapRef.current.get(selectedSupplier.id);
    if (marker) {
      marker.openPopup();
    }
  }, [selectedSupplier]);

  // Função para enquadrar todos os fornecedores no mapa
  const handleFitAll = () => {
    if (!mapInstanceRef.current || suppliers.length === 0) return;
    const bounds: L.LatLngExpression[] = suppliers
      .filter(s => s.endereco.latitude && s.endereco.longitude)
      .map(s => [s.endereco.latitude!, s.endereco.longitude!]);

    if (userLocation) {
      bounds.push([userLocation.lat, userLocation.lng]);
    }

    if (bounds.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(bounds), {
        padding: [60, 60],
        maxZoom: 15,
      });
    }
  };

  return (
    <div className="relative w-full h-full flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Header Bar with Map Controls */}
      <div className="bg-slate-900 border-b border-slate-800 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Seletor de Tipo de Mapa: Satélite | Ruas | Escuro */}
          <div 
            className="flex items-center bg-slate-950 p-1 border border-slate-700/80 rounded-xl shadow-inner"
            role="radiogroup"
            aria-label="Tipo de Mapa"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 hidden sm:inline">
              Modo do Mapa:
            </span>
            {/* Satélite */}
            <button
              type="button"
              onClick={() => handleThemeChange('satellite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                mapTheme === 'satellite'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Visualização por Satélite com fotos de alta resolução"
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satélite</span>
            </button>

            {/* Ruas */}
            <button
              type="button"
              onClick={() => handleThemeChange('osm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                mapTheme === 'osm'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Visualização de Ruas, Avenidas e Rodovias (OpenStreetMap)"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Ruas</span>
            </button>

            {/* Escuro */}
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                mapTheme === 'dark'
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title="Visualização Escura (Dark Mode) de alto contraste"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Escuro</span>
            </button>
          </div>

          {/* Enquadrar Todos */}
          <button
            type="button"
            onClick={handleFitAll}
            title="Ajustar visualização para enquadrar todos os fornecedores"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Enquadrar Fornecedores</span>
          </button>
        </div>

        {/* Contador Limpo de Fornecedores */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-medium text-slate-300 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
            {suppliers.length} {suppliers.length === 1 ? 'fornecedor no mapa' : 'fornecedores no mapa'}
          </span>
        </div>
      </div>

      {/* Área do Mapa Leaflet */}
      <div className="relative flex-1 w-full h-full min-h-[300px]">
        {/* Container do Mapa */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Overlay informativo quando sem fornecedores carregados */}
        {suppliers.length === 0 && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm"
            style={{ zIndex: 500 }}
          >
            <Building className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white mb-1">Mapa Georreferenciado</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consulte ou importe CNPJs para visualizar o posicionamento exato dos fornecedores com base nos dados oficiais da Receita Federal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
