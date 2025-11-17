"use client";

import { useEffect, useRef, useState, memo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as turf from '@turf/turf';

// Leaflet-draw'ın browser-only modüllerini import ediyoruz
import 'leaflet-draw';

// Leaflet ikonlarının CSS ile çalışması için gereken düzeltme
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Stil fonksiyonları
const getStyleForType = (type: string) => {
  switch (type) {
    case 'buffer':
      return { color: '#8B6FFF', fillColor: '#8B6FFF', fillOpacity: 0.2, weight: 2 };
    case 'intersection':
      return { color: '#FF4D4D', fillColor: '#FF4D4D', fillOpacity: 0.4, weight: 2 };
    case 'union':
      return { color: '#00E5CC', fillColor: '#00E5CC', fillOpacity: 0.3, weight: 2 };
    case 'polygon':
      return { color: '#4D8CFF', fillColor: '#4D8CFF', fillOpacity: 0.2, weight: 2 };
    case 'polyline':
      return { color: '#F59E0B', weight: 3, dashArray: '5, 5' };
    case 'marker':
      return { color: '#FF0000' };
    case 'rectangle':
      return { color: '#10B981', fillColor: '#10B981', fillOpacity: 0.2, weight: 2 };
    default:
      return { color: '#3388FF', fillColor: '#3388FF', fillOpacity: 0.2, weight: 2 };
  }
};

// Harita bileşeni props
interface MapComponentProps {
  onDrawCreated: (e: any) => void;
  drawnItems: any[];
  activeCalculation: string | null;
  onGeometryInfo?: (info: any) => void; // Geometri bilgilerini ana bileşene iletmek için callback
}

// React.memo ile gereksiz render'ları önlüyoruz
const MapComponent = memo(function MapComponent({ onDrawCreated, drawnItems, activeCalculation, onGeometryInfo }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsLayerRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const activeCalcRef = useRef<string | null>(null); // Aktif hesaplama referansı
  const drawHandlerRef = useRef<any>(null); // Çizim aracı referansı
  const isInitializedRef = useRef(false);
  const mapReadyRef = useRef(false); // Haritanın hazır olup olmadığını takip etmek için yeni ref
  const [selectionModeActive, setSelectionModeActive] = useState(false); // Seçim modu aktif mi?
  const selectedLayersRef = useRef<L.Layer[]>([]); // Seçili katmanları tutacak referans
  const selectedLayerInfoRef = useRef<any>(null); // Seçili katman bilgisini tutacak referans

  // Popup için geometri bilgilerini formatla
  const formatGeometryInfo = (geoJSON: any) => {
    try {
      if (!geoJSON || !geoJSON.geometry) return "Geometri məlumatı əldə olunmadı";

      const geometryType = geoJSON.geometry.type;
      let infoText = '';

      switch (geometryType) {
        case 'Polygon':
        case 'MultiPolygon':
          const area = turf.area(geoJSON);
          infoText = `<b>Geometri növü:</b> ${geometryType}<br/><b>Sahə:</b> ${area < 10000 ? area.toFixed(2) + ' m²' : (area / 1000000).toFixed(4) + ' km²'}`;
          break;
        case 'LineString':
        case 'MultiLineString':
          const length = turf.length(geoJSON, { units: 'kilometers' });
          infoText = `<b>Geometri növü:</b> ${geometryType}<br/><b>Uzunluq:</b> ${length < 1 ? (length * 1000).toFixed(2) + ' m' : length.toFixed(3) + ' km'}`;
          break;
        case 'Point':
          const coords = geoJSON.geometry.coordinates;
          infoText = `<b>Geometri növü:</b> ${geometryType}<br/><b>Koordinatlar:</b> ${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`;
          break;
        default:
          infoText = `<b>Geometri növü:</b> ${geometryType}`;
      }

      // Özellikler varsa ekle
      if (geoJSON.properties && Object.keys(geoJSON.properties).length > 0) {
        const propDetails = Object.entries(geoJSON.properties)
          .filter(([key]) => key !== 'type' && key !== '_id')
          .map(([key, value]) => `<b>${key}:</b> ${value}`)
          .join('<br/>');

        if (propDetails) {
          infoText += `<br/><br/><b>Xüsusiyyətlər:</b><br/>${propDetails}`;
        }
      }

      return infoText;
    } catch (error) {
      console.error("Geometri məlumatı formatlanarkən xəta:", error);
      return "Geometri məlumatı əldə olunmadı";
    }
  };

  // Map komponentinin ilk yüklenişinde Leaflet'i ayarla - sadece bir kez çalışsın
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Leaflet ikonlarını düzelt
    fixLeafletIcons();

    // Daire butonunu anında gizlemek için CSS kuralı ekle
    const style = document.createElement('style');
    style.textContent = '.leaflet-draw-draw-circle { display: none !important; }';
    document.head.appendChild(style);

    // Edit butonu için özel JavaScript kodu ekle
    const script = document.createElement('script');
    script.textContent = `
      // Leaflet Draw edit butonunun düzgün çalışması için özel kod
      // Bu kod, her 500ms'de bir edit butonunu kontrol edecek
      (function() {
        let checkEditButton = setInterval(function() {
          const editButton = document.querySelector('.leaflet-draw-edit-edit');
          if (!editButton) return;
          
          // Eğer düzenleme butonunda sorun varsa, düzelt
          if (editButton.classList.contains('leaflet-disabled') && document.querySelector('.leaflet-draw-toolbar')) {
            const featureGroup = window.drawnItemsFeatureGroup;
            if (featureGroup && featureGroup.getLayers().length > 0) {
              editButton.classList.remove('leaflet-disabled');
              editButton.setAttribute('href', '#');
              editButton.setAttribute('title', 'Qatları redaktə et');
              editButton.style.pointerEvents = 'auto';
            }
          }
        }, 500);
        
        // Sayfadan ayrılırken interval'i temizle
        window.addEventListener('beforeunload', function() {
          if (checkEditButton) clearInterval(checkEditButton);
        });
      })();
    `;
    document.head.appendChild(script);

    try {
      // Harita DOM elementi var mı kontrol et
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }

      // Harita oluştur
      const map = L.map('map', {
        center: [40.409264, 49.867092], // Bakü merkezi
        zoom: 13,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          })
        ]
      });

      // Referansları kaydet
      mapRef.current = map;

      // CSS ayarlarını yapılandır - Leaflet kontrollerinin z-index değerlerini artır
      // Bu ayar, kontrollerin panelin altında kalmamasını sağlar
      const adjustLeafletControlStyles = () => {
        // Leaflet draw kontrollerinin stili
        const drawControlsCSS = document.createElement('style');
        drawControlsCSS.innerHTML = `
          .leaflet-draw-toolbar.leaflet-bar { z-index: 1000 !important; }
          .leaflet-draw-actions { z-index: 1010 !important; }
          .leaflet-control-zoom { z-index: 1000 !important; }
          .leaflet-control-attribution { z-index: 990 !important; }
          .leaflet-draw-tooltip { z-index: 1020 !important; }
          .leaflet-popup { z-index: 1030 !important; }
          .leaflet-bar { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }
          .leaflet-bar a { background-color: #0A1A2F !important; color: #00E5CC !important; border-color: #00B4A2 !important; }
          .leaflet-bar a:hover { background-color: #142F47 !important; }
          .leaflet-control-zoom-in, .leaflet-control-zoom-out { border-bottom: 1px solid #00B4A2 !important; }
          .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-polyline,
          .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-polygon,
          .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-rectangle,
          .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-marker,
          .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-edit,
          .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-remove { background-color: #0A1A2F !important; }
          .leaflet-draw-actions a { background-color: #0A1A2F !important; color: #00E5CC !important; }
          .leaflet-draw-actions a:hover { background-color: #142F47 !important; }
          
          /* Düzenleme butonunun işlevselliğini iyileştir */
          a.leaflet-draw-edit-edit:not(.leaflet-disabled) {
            pointer-events: auto !important;
            cursor: pointer !important;
            opacity: 1 !important;
          }
          
          /* Daire butonunu ve ilgili öğeleri tamamen gizle */
          .leaflet-draw-draw-circle,
          a.leaflet-draw-draw-circle,
          .leaflet-draw-toolbar-button-enabled.leaflet-draw-draw-circle { 
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
          }
        `;
        document.head.appendChild(drawControlsCSS);
      };

      // CSS ayarlarını uygula
      adjustLeafletControlStyles();

      // Çizilen nesneleri tutacak katmanı oluştur
      const drawnItemsLayer = new L.FeatureGroup();
      map.addLayer(drawnItemsLayer);

      // Referansı kaydet
      drawnItemsLayerRef.current = drawnItemsLayer;

      // Global pencere nesnesine erişim sağla (script için)
      (window as any).drawnItemsFeatureGroup = drawnItemsLayer;

      // Çizim kontrollerini ayarla
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: getStyleForType('polygon')
          },
          polyline: {
            shapeOptions: getStyleForType('polyline')
          },
          rectangle: {
            shapeOptions: getStyleForType('rectangle')
          },
          circle: false, // Açıkça false olarak ayarlıyoruz
          marker: {}, // Boş obje ile marker ayarları
          circlemarker: false // Circle marker (nokta) devre dışı bırakılıyor
        },
        edit: {
          // Editör özelliklerini düzgün sağlamak için boş layer ekliyoruz
          featureGroup: drawnItemsLayer,
          // Düzenleme araçlarını etkinleştiriyoruz
          edit: {
            selectedPathOptions: {
              dashArray: '10, 10',
              fill: true,
              fillColor: '#fe57a1',
              fillOpacity: 0.1,
              weight: 3
            }
          },
          remove: true
        }
      });

      // Referansı kaydet
      drawControlRef.current = drawControl;

      // Doğrudan DOM olarak kontrolü eklemek yerine, 
      // harita hazır olduğunda ekleyelim
      map.whenReady(() => {
        try {
          map.addControl(drawControl);

          // Edit butonunun başlangıç durumunu ayarla - başlangıçta drawnItems yoksa devre dışı bırak
          setTimeout(() => {
            const editButton = document.querySelector('.leaflet-draw-edit-edit');
            if (editButton) {
              if (drawnItems && drawnItems.length > 0) {
                // Katmanlar varsa, etkinleştir
                editButton.classList.remove('leaflet-disabled');
                editButton.setAttribute('title', 'Qatları redaktə et');
                (editButton as HTMLElement).style.pointerEvents = 'auto';
              } else {
                // Katmanlar yoksa, devre dışı bırak
                editButton.classList.add('leaflet-disabled');
                editButton.setAttribute('title', 'Redaktə ediləcək qat yoxdur');
                (editButton as HTMLElement).style.pointerEvents = 'none';
              }
            }

            // Editör kontrolünü manual olarak hazırla
            if (drawnItemsLayerRef.current && drawnItems && drawnItems.length > 0) {
              // Önceki düzenleme kontrolünü temizle ve yeniden oluştur
              map.removeControl(drawControl);

              // Yeni kontrol oluştur
              const newDrawControl = new L.Control.Draw({
                draw: {
                  polygon: {
                    allowIntersection: false,
                    showArea: true,
                    shapeOptions: getStyleForType('polygon')
                  },
                  polyline: {
                    shapeOptions: getStyleForType('polyline')
                  },
                  rectangle: {
                    shapeOptions: getStyleForType('rectangle')
                  },
                  circle: false,
                  marker: {},
                  circlemarker: false
                },
                edit: {
                  featureGroup: drawnItemsLayerRef.current,
                  edit: {
                    selectedPathOptions: {
                      dashArray: '10, 10',
                      fill: true,
                      fillColor: '#fe57a1',
                      fillOpacity: 0.1,
                      weight: 3
                    }
                  },
                  remove: true
                }
              });

              // Kontrolü ekle ve referansı güncelle
              map.addControl(newDrawControl);
              drawControlRef.current = newDrawControl;
            }
          }, 100);

          // Haritanın yüklendiğini belirt
          console.log('Map is ready');
          mapReadyRef.current = true;
        } catch (error) {
          console.error('Error adding draw control:', error);
        }
      });

      // Çizim tamamlandığında olayı yakala
      map.on(L.Draw.Event.CREATED, (e: any) => {
        try {
          // Yeni oluşturulan katmana popup ekle
          if (e.layer) {
            try {
              // GeoJSON'a dönüştür
              const geoJSON = e.layer.toGeoJSON();

              // Tipini geoJSON'a ekle
              if (geoJSON && geoJSON.properties) {
                geoJSON.properties.type = e.layerType;
              }

              // Popup içeriğini oluştur
              const popupContent = formatGeometryInfo(geoJSON);

              // Popup'ı bağla
              e.layer.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup',
                autoPan: true
              });

              // Tıklama olayını ekle (seçim modu kapalıysa)
              e.layer.on('click', (event: any) => {
                if (!selectionModeActive) {
                  e.layer.openPopup();
                  // Olayın ilerlemesini durdur
                  L.DomEvent.stopPropagation(event);
                }
              });
            } catch (popupError) {
              console.error('Error adding popup to new layer:', popupError);
            }
          }

          drawnItemsLayer.addLayer(e.layer);
          onDrawCreated(e);
        } catch (error) {
          console.error('Error handling draw created event:', error);
        }
      });

      // Düzenleme olaylarını yakala
      map.on(L.Draw.Event.EDITED, (e: any) => {
        try {
          // Düzenlenen katmanları işle
          console.log('Layers edited:', e.layers);

          // Düzenlenen her katmana yeni popup ekle
          e.layers.eachLayer((layer: any) => {
            try {
              // GeoJSON'a dönüştür
              const geoJSON = layer.toGeoJSON();

              // Popup içeriğini güncelle
              const popupContent = formatGeometryInfo(geoJSON);

              // Eski popup'ı kaldır ve yenisini ekle
              if (layer.getPopup()) {
                layer.unbindPopup();
              }

              // Yeni popup ekle
              layer.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup',
                autoPan: true
              });

              // Tıklama olayını yeniden düzenle (seçim modu kapalıysa)
              layer.off('click');
              layer.on('click', (evt: any) => {
                if (!selectionModeActive) {
                  layer.openPopup();
                  L.DomEvent.stopPropagation(evt);
                }
              });
            } catch (popupError) {
              console.error('Error updating popup for edited layer:', popupError);
            }
          });
        } catch (error) {
          console.error('Error handling edit event:', error);
        }
      });

      // Silme olayını yakala - kontrollü bir şekilde
      map.on(L.Draw.Event.DELETED, (e: any) => {
        try {
          console.log('Layers deleted event triggered');

          // Silinen katmanları işle
          let deletedCount = 0;
          e.layers.eachLayer(() => {
            deletedCount++;
          });

          console.log(`Deleted ${deletedCount} layers from map`);

          // Önemli değişiklik: Leaflet-draw silme olayı tetiklendiğinde
          // drawnItemsLayer'dan geometriler zaten silinmiş oluyor
          // Bu noktada ana bileşene bir "temizleme" işareti göndermemiz gerekiyor

          // Ana bileşene silme işlemini bildir - çok önemli
          // drawnItems'ı komple sıfırlamak en garantili yöntemdir
          if (onGeometryInfo) {
            onGeometryInfo({
              text: `${deletedCount} geometri uğurla silindi`,
              deleted: true,
              count: deletedCount,
              // Bu özel flag ile tüm geometrilerin silinmesini istiyoruz
              clearAllGeometries: true
            });
          }
        } catch (error) {
          console.error('Error handling delete event:', error);
        }
      });

      // Düzenlemeye başlama olayı
      map.on(L.Draw.Event.EDITSTART, (e: any) => {
        try {
          console.log('Edit started');
        } catch (error) {
          console.error('Error handling edit start event:', error);
        }
      });

      // Düzenlemeyi durdurma olayı
      map.on(L.Draw.Event.EDITSTOP, (e: any) => {
        try {
          console.log('Edit stopped');
        } catch (error) {
          console.error('Error handling edit stop event:', error);
        }
      });

      // Haritanın tekrar render edilmesini önleme için event listeners ekleyin
      map.on('zoomend', () => {
        // Boş callback - sadece event'leri yakalamak için
      });

      map.on('dragend', () => {
        // Boş callback - sadece event'leri yakalamak için
      });

      // Temizleme işlemi
      return () => {
        if (map) {
          // Önce tüm çizim işleyicilerini temizle
          if (drawHandlerRef.current) {
            try {
              drawHandlerRef.current.disable();
            } catch (e) {
              console.error('Error disabling draw handler:', e);
            }
            drawHandlerRef.current = null;
          }

          // Window nesnesinden referansı temizle
          if ((window as any).drawnItemsFeatureGroup) {
            (window as any).drawnItemsFeatureGroup = null;
          }

          // Haritayı kaldır
          map.remove();

          // Referansları temizle
          mapRef.current = null;
          drawnItemsLayerRef.current = null;
          drawControlRef.current = null;
          isInitializedRef.current = false;
          mapReadyRef.current = false;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []); // Boş bağımlılık dizisi - sadece bir kez çalışsın

  // Aktif hesaplama değiştiğinde sadece çizim aracını değiştir, haritayı yeniden oluşturma
  useEffect(() => {
    // Önceki aktif çizim aracını devre dışı bırak
    if (drawHandlerRef.current) {
      try {
        drawHandlerRef.current.disable();
      } catch (e) {
        console.error('Error disabling draw handler:', e);
      }
      drawHandlerRef.current = null;
    }

    // Eğer harita referansı veya kontrol referansı yoksa veya aktif hesaplama aynıysa işlem yapma
    if (!mapRef.current || !drawControlRef.current || !mapReadyRef.current || activeCalcRef.current === activeCalculation) {
      activeCalcRef.current = activeCalculation;
      return;
    }

    activeCalcRef.current = activeCalculation;

    // Çizim aracını gecikmeyle etkinleştir (haritanın tam olarak hazır olmasını beklemek için)
    setTimeout(() => {
      if (!mapRef.current || !drawControlRef.current || !mapReadyRef.current) return;

      try {
        // Tüm mevcut araçları temizle
        if (drawHandlerRef.current) {
          drawHandlerRef.current.disable();
          drawHandlerRef.current = null;
        }

        // Aktif hesaplama aracına göre uygun çizim aracını etkinleştir
        if (activeCalculation === 'area') {
          // Alan hesaplama için polygon çizimini etkinleştir
          drawHandlerRef.current = new (L.Draw as any).Polygon(mapRef.current,
            (drawControlRef.current as any).options.draw.polygon);
          drawHandlerRef.current.enable();
        } else if (activeCalculation === 'distance') {
          // Mesafe hesaplama için polyline çizimini etkinleştir
          drawHandlerRef.current = new (L.Draw as any).Polyline(mapRef.current,
            (drawControlRef.current as any).options.draw.polyline);

          // Polyline çizim aracına kapalı çizgi oluşturma yeteneği ekle
          if (drawHandlerRef.current && mapRef.current) {
            const map = mapRef.current; // Referansı al

            // Başlangıç noktasını ve belirteci için referanslar
            let startPoint: L.LatLng | null = null;
            let startMarker: L.CircleMarker | null = null;

            // İlk vertexin eklendiği anı yakalamak için
            const originalVertexAdded = drawHandlerRef.current._vertexAdded;
            drawHandlerRef.current._vertexAdded = function (latlng: L.LatLng) {
              // İlk vertex eklendiğinde (ilk noktayı kaydet)
              if (!startPoint && this._poly) {
                console.log('İlk vertex kaydedildi:', latlng);
                startPoint = latlng;

                // İlk vertex için görünür bir marker oluştur
                if (map && !startMarker) {
                  startMarker = L.circleMarker(latlng, {
                    radius: 8,
                    color: '#ff4500',
                    fillColor: '#ff4500',
                    fillOpacity: 0.5,
                    weight: 2,
                    interactive: true // Tıklanabilir olmasını sağlar
                  }).addTo(map);

                  // Marker'a tıklandığında çizimi tamamla
                  startMarker.on('click', () => {
                    // En az 2 nokta varsa ve çizim hala aktifse
                    if (this._enabled && this._poly && this._markers.length >= 2) {
                      console.log('Başlangıç marker\'ına tıklandı, çizim tamamlanıyor');

                      // Son noktayı ilk noktaya ayarla
                      const latLngs = this._poly.getLatLngs();
                      if (Array.isArray(latLngs) && latLngs.length > 0) {
                        latLngs[latLngs.length - 1] = startPoint;
                        this._poly.setLatLngs(latLngs);
                        this._poly.redraw();
                      }

                      // Çizimi tamamla
                      this.completeShape();

                      // Marker'ı temizle
                      if (map && startMarker) {
                        map.removeLayer(startMarker);
                        startMarker = null;
                      }
                    }
                  });
                }
              }

              // Orijinal fonksiyonu çağır
              return originalVertexAdded.call(this, latlng);
            };

            // Tıklama işleyicisini genişlet
            const originalClick = drawHandlerRef.current._onClick;
            if (originalClick) {
              drawHandlerRef.current._onClick = function (e: L.LeafletMouseEvent) {
                // Eğer başlangıç noktası varsa ve en az 2 nokta çizilmişse
                if (startPoint && this._markers && this._markers.length >= 2) {
                  const clickPoint = e.latlng;

                  // Başlangıç noktası ve tıklama noktasının ekran koordinatlarını al
                  const startPointScreen = map.latLngToContainerPoint(startPoint);
                  const clickPointScreen = map.latLngToContainerPoint(clickPoint);

                  // İki nokta arasındaki mesafeyi hesapla (piksel cinsinden)
                  const distance = startPointScreen.distanceTo(clickPointScreen);

                  // Eğer tıklama başlangıç noktasına yeterince yakınsa
                  if (distance < 50) { // 50 piksel eşik değeri (artırıldı)
                    console.log('Polyline kapatılıyor: başlangıç noktasına yakın tıklama');

                    // Son noktayı tam olarak başlangıç noktasına ayarla
                    const latLngs = this._poly.getLatLngs();
                    if (Array.isArray(latLngs) && latLngs.length > 0) {
                      latLngs[latLngs.length - 1] = startPoint;
                      this._poly.setLatLngs(latLngs);
                      this._poly.redraw();
                    }

                    // Çizimi tamamla
                    this.completeShape();

                    // Marker'ı temizle
                    if (map && startMarker) {
                      map.removeLayer(startMarker);
                      startMarker = null;
                    }

                    // İşlemi durdur
                    return;
                  }
                }

                // Yakınlık koşulu sağlanmadıysa, normal işlevi çağır
                return originalClick.call(this, e);
              };
            }

            // Çizim iptal edildiğinde veya tamamlandığında temizleme yap
            const cleanupMarker = () => {
              if (map && startMarker) {
                map.removeLayer(startMarker);
                startMarker = null;
                startPoint = null;
              }
            };

            // Çizim durdurma ve iptal olaylarını dinle
            map.once('draw:drawstop', cleanupMarker);
            map.once('draw:drawcancel', cleanupMarker);

            // Fare hareketini izle ve başlangıç noktasına yakınsa vurgula
            const originalMouseMove = drawHandlerRef.current._onMouseMove;
            if (originalMouseMove) {
              drawHandlerRef.current._onMouseMove = function (e: L.LeafletMouseEvent) {
                // Orijinal fonksiyonu çağır
                originalMouseMove.call(this, e);

                // Başlangıç noktası yoksa ve henüz en az 2 nokta yoksa işlem yapma
                if (!startPoint || !this._markers || this._markers.length < 2) return;

                const currentPoint = e.latlng;
                const startPointScreen = map.latLngToContainerPoint(startPoint);
                const currentPointScreen = map.latLngToContainerPoint(currentPoint);

                // Mesafe kontrolü
                const distance = startPointScreen.distanceTo(currentPointScreen);

                // Eğer fare başlangıç noktasının yakınındaysa
                if (distance < 50) {
                  // Başlangıç marker'ını vurgula
                  if (startMarker) {
                    startMarker.setStyle({
                      radius: 10,
                      color: '#ff0000',
                      fillColor: '#ff0000',
                      fillOpacity: 0.7,
                      weight: 3
                    });

                    // İpucu mesajını güncelle
                    if (this._tooltip) {
                      this._tooltip.updateContent({ text: 'Çəkilişi başa çatdırmaq üçün ilk nöqtəyə klikləyin' });
                    }
                  }
                } else {
                  // Normal görünüme döndür
                  if (startMarker) {
                    startMarker.setStyle({
                      radius: 8,
                      color: '#ff4500',
                      fillColor: '#ff4500',
                      fillOpacity: 0.5,
                      weight: 2
                    });
                  }
                }
              };
            }
          }

          drawHandlerRef.current.enable();
        }
        // Diğer hesaplamalar için özel bir çizim aracını etkinleştirmiyoruz
      } catch (error) {
        console.error('Error enabling draw tool:', error);
      }
    }, 500); // 500ms gecikme ekledik - daha uzun süre bekleyerek haritanın tamamen yüklenmesini sağlıyoruz
  }, [activeCalculation]);

  // Seçim modunu aç/kapat
  const toggleSelectionMode = () => {
    try {
      if (!mapRef.current || !drawnItemsLayerRef.current) return;

      const newSelectionMode = !selectionModeActive;
      setSelectionModeActive(newSelectionMode);

      // Seçim modu aktifse seçme işlemlerini hazırla, değilse temizle
      if (newSelectionMode) {
        // Haritadaki tüm katmanları seçilebilir yap
        drawnItemsLayerRef.current.eachLayer((layer: any) => {
          // Katmanı tıklanabilir yap
          if (layer && layer.on) {
            // Eğer varsa eski event listener'ları kaldır
            layer.off('click');

            // Popup'ları kapat
            if (layer.closePopup) {
              layer.closePopup();
            }

            // Seçme olayını ekle
            layer.on('click', (e: any) => {
              // Çoklu seçim için Ctrl tuşu kullanılabilir
              const isMultiSelect = e.originalEvent && (e.originalEvent.ctrlKey || e.originalEvent.metaKey);

              // Eğer çoklu seçim değilse önceki seçimleri temizle
              if (!isMultiSelect) {
                // Önceki seçimleri temizle
                clearSelection();
              }

              // Layer zaten seçili mi kontrol et
              const alreadySelected = selectedLayersRef.current.includes(layer);

              if (alreadySelected) {
                // Zaten seçiliyse seçimden kaldır
                selectedLayersRef.current = selectedLayersRef.current.filter(l => l !== layer);
                if (layer.setStyle) {
                  // Katmanın orijinal stilini geri yükle
                  const originalType = (layer as any).feature?.properties?.type || 'default';
                  layer.setStyle(getStyleForType(originalType));
                }
              } else {
                // Değilse seçime ekle
                selectedLayersRef.current.push(layer);
                if (layer.setStyle) {
                  // Seçilen katmanın stilini değiştir
                  layer.setStyle({
                    color: '#FF4500',
                    weight: 4,
                    opacity: 1,
                    fillOpacity: 0.5,
                    fillColor: '#FF8C00',
                    dashArray: '5, 5'
                  });
                }
              }

              // Geometri bilgisini hesapla ve callback ile ilet
              if (selectedLayersRef.current.length === 1 && onGeometryInfo) {
                const selectedLayer = selectedLayersRef.current[0];
                if (selectedLayer) {
                  try {
                    const geoJSON = (selectedLayer as any).toGeoJSON();
                    const geometryType = geoJSON.geometry.type;

                    let infoText = '';

                    switch (geometryType) {
                      case 'Polygon':
                      case 'MultiPolygon':
                        const area = turf.area(geoJSON);
                        infoText = `Polygon | Sahə: ${area < 10000 ? area.toFixed(2) + ' m²' : (area / 1000000).toFixed(4) + ' km²'}`;
                        break;
                      case 'LineString':
                      case 'MultiLineString':
                        const length = turf.length(geoJSON, { units: 'kilometers' });
                        infoText = `Xətt | Uzunluq: ${length < 1 ? (length * 1000).toFixed(2) + ' m' : length.toFixed(3) + ' km'}`;
                        break;
                      case 'Point':
                        const coords = geoJSON.geometry.coordinates;
                        infoText = `Nöqtə | Koordinatlar: ${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`;
                        break;
                      default:
                        infoText = `Geometri növü: ${geometryType}`;
                    }

                    // Bilgiyi ana bileşene gönder
                    selectedLayerInfoRef.current = {
                      text: infoText,
                      geoJSON: geoJSON,
                      type: geometryType
                    };
                    onGeometryInfo(selectedLayerInfoRef.current);
                  } catch (error) {
                    console.error('Error calculating geometry info:', error);
                  }
                }
              } else if (selectedLayersRef.current.length > 1 && onGeometryInfo) {
                // Çoklu seçim durumunda bilgi
                onGeometryInfo({
                  text: `${selectedLayersRef.current.length} geometri seçildi`,
                  count: selectedLayersRef.current.length,
                  type: 'multiple'
                });
              } else if (selectedLayersRef.current.length === 0 && onGeometryInfo) {
                // Seçim temizlendiğinde bilgiyi temizle
                onGeometryInfo(null);
              }

              // Olayın haritada ilerlemesini durdur
              L.DomEvent.stopPropagation(e);
            });

            // Hover efekti ekle
            layer.on('mouseover', function () {
              if (!selectedLayersRef.current.includes(layer) && layer.setStyle) {
                layer.setStyle({
                  weight: 3,
                  opacity: 1
                });
              }
            });

            layer.on('mouseout', function () {
              if (!selectedLayersRef.current.includes(layer) && layer.setStyle) {
                const originalType = (layer as any).feature?.properties?.type || 'default';
                layer.setStyle(getStyleForType(originalType));
              }
            });
          }
        });
      } else {
        // Seçim modunu kapattığımızda tüm seçimleri temizle
        clearSelection();

        // Tüm event listener'ları temizle ve popup fonksiyonlarını geri yükle
        drawnItemsLayerRef.current.eachLayer((layer: any) => {
          if (layer && layer.off) {
            // Eski listener'ları temizle
            layer.off('click');
            layer.off('mouseover');
            layer.off('mouseout');

            // GeoJSON katmanlarını yeniden oluşturmak yerine sadece popup davranışını yeniden ayarla
            if (layer.eachLayer) {
              layer.eachLayer((sublayer: any) => {
                if (sublayer && sublayer.on) {
                  // Eski tıklama olaylarını temizle
                  sublayer.off('click');

                  // Tıklama olayını yeniden ekle
                  sublayer.on('click', (e: any) => {
                    // Popup zaten bağlanmış olmalı, sadece açılmasını sağla
                    sublayer.openPopup();
                    // Olayın ilerlemesini durdur
                    L.DomEvent.stopPropagation(e);
                  });
                }
              });
            }
          }
        });

        // Geometri bilgisini temizle
        if (onGeometryInfo) {
          onGeometryInfo(null);
        }
      }
    } catch (error) {
      console.error('Error toggling selection mode:', error);
    }
  };

  // Seçimi temizle
  const clearSelection = () => {
    if (selectedLayersRef.current.length > 0 && drawnItemsLayerRef.current) {
      // Seçili katmanların stilini geri yükle
      selectedLayersRef.current.forEach(layer => {
        if (layer && (layer as any).setStyle) {
          const originalType = ((layer as any).feature?.properties?.type) || 'default';
          (layer as any).setStyle(getStyleForType(originalType));
        }
      });

      // Seçili katmanları temizle
      selectedLayersRef.current = [];
      selectedLayerInfoRef.current = null;
    }
  };

  // Seçili geometrileri sil
  const deleteSelectedGeometries = () => {
    try {
      if (!mapRef.current || !drawnItemsLayerRef.current) return;

      if (selectedLayersRef.current.length > 0) {
        // Silinen geometrilerin bilgilerini topla
        const selectedFeatures = selectedLayersRef.current.map(layer => {
          try {
            return {
              id: (layer as any).feature._id || null,
              feature: (layer as any).feature || null
            };
          } catch (e) {
            return { id: null, feature: null };
          }
        }).filter(item => item.feature !== null);

        // Her seçili katmanı sil
        selectedLayersRef.current.forEach(layer => {
          if (drawnItemsLayerRef.current) {
            drawnItemsLayerRef.current.removeLayer(layer);
          }
        });

        // Temizle
        selectedLayersRef.current = [];
        selectedLayerInfoRef.current = null;

        // Bilgiyi temizle ve silme işlemini ana bileşene bildir
        if (onGeometryInfo) {
          onGeometryInfo({
            text: `${selectedFeatures.length} geometri uğurla silindi`,
            deleted: true,
            count: selectedFeatures.length,
            // Ana bileşene hangi katmanların silindiğini bildir
            deletedFeatures: selectedFeatures.map(item => item.feature)
          });
        }
      }
    } catch (error) {
      console.error('Error deleting selected geometries:', error);
    }
  };

  // drawnItems değiştiğinde haritayı güncelle, ancak tekrar render'ı önle
  useEffect(() => {
    if (!mapRef.current || !drawnItemsLayerRef.current || !mapReadyRef.current) return;

    try {
      console.log(`Updating map with ${drawnItems.length} geometries`);

      // Seçim modunu devre dışı bırak
      setSelectionModeActive(false);

      // Seçimleri temizle
      clearSelection();

      // Mevcut çizimleri temizle
      drawnItemsLayerRef.current.clearLayers();
      console.log('Cleared all layers from map');

      // drawnItems boşsa hiç bir şey ekleme ve çık
      if (drawnItems.length === 0) {
        console.log('No geometries to add, exiting early');
        return;
      }

      // Şimdi ayrı bir işlemde çizimleri ekle (animasyon çerçevesiyle zamanlama sorunlarını önlüyoruz)
      requestAnimationFrame(() => {
        if (!drawnItemsLayerRef.current) return;

        try {
          console.log(`Adding ${drawnItems.length} geometries to map`);

          // Her çizimi haritaya ekle
          drawnItems.forEach((item, index) => {
            if (!item || !item.data) {
              console.log(`Item ${index} is invalid, skipping`);
              return;
            }

            try {
              console.log(`Adding item ${index}, type: ${item.type}`);

              // GeoJSON'ı klonla
              const geoJSON = structuredClone(item.data);

              // Tipini geoJSON'a ekle (daha sonra stil için kullanabiliriz)
              if (!geoJSON.properties) {
                geoJSON.properties = {};
              }
              geoJSON.properties.type = item.type;

              // ÖNEMLİ: GeoJSON'ı doğrudan özel katmanlara dönüştür (Leaflet Draw ile uyumlu)
              let layer;

              if (geoJSON.geometry.type === "Polygon") {
                const coords = geoJSON.geometry.coordinates[0].map((c: number[]) => [c[1], c[0]]);
                layer = L.polygon(coords, getStyleForType(item.type));
              }
              else if (geoJSON.geometry.type === "LineString") {
                const coords = geoJSON.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
                layer = L.polyline(coords, getStyleForType(item.type));
              }
              else if (geoJSON.geometry.type === "Point") {
                const coords = geoJSON.geometry.coordinates;
                layer = L.marker([coords[1], coords[0]]);
              }
              else {
                // Diğer tipler için genel GeoJSON kullan
                layer = L.geoJSON(geoJSON, {
                  style: getStyleForType(item.type)
                });
              }

              // Orijinal özellikler ve metadataları ekle
              if (layer) {
                // Orijinal feature verisini ekle
                layer.feature = geoJSON;

                // Popup ekle
                const popupContent = formatGeometryInfo(geoJSON);
                layer.bindPopup(popupContent, {
                  maxWidth: 300,
                  className: 'custom-popup',
                  autoPan: true
                });

                // Click olayını ekle
                layer.on('click', (e) => {
                  if (!selectionModeActive) {
                    layer.openPopup();
                    L.DomEvent.stopPropagation(e);
                  }
                });

                // Editlenebilir yap ve drawnItems'a ekle
                drawnItemsLayerRef.current?.addLayer(layer);
                console.log(`Added item ${index} to map`);
              }
            } catch (itemError) {
              console.error(`Error adding item ${index} to layer:`, itemError);
            }
          });

          console.log('All geometries added to map');

          // Seçim modu aktifse katmanları tekrar seçilebilir yap
          if (selectionModeActive) {
            toggleSelectionMode();
          }
        } catch (error) {
          console.error('Error updating drawn items:', error);
        }
      });
    } catch (error) {
      console.error('Error clearing layers:', error);
    }
  }, [drawnItems]);

  // Edit butonunun etkinleştirilmesi için useEffect
  useEffect(() => {
    // Harita hazır değilse işlem yapma
    if (!mapReadyRef.current) return;

    // Kısa bir gecikme ile uygula (DOM hazır olsun)
    const timer = setTimeout(() => {
      try {
        // Edit butonunu bul
        const editButton = document.querySelector('.leaflet-draw-edit-edit');
        if (!editButton) return;

        // Eğer drawnItems varsa ve içinde öğe varsa, edit butonunu etkinleştir
        if (drawnItems && drawnItems.length > 0) {
          editButton.classList.remove('leaflet-disabled');
          editButton.setAttribute('title', 'Qatları redaktə et');
          // href özniteliğini ekle - önemli
          editButton.setAttribute('href', '#');
        } else {
          // Aksi takdirde devre dışı bırak
          editButton.classList.add('leaflet-disabled');
          editButton.setAttribute('title', 'Redaktə ediləcək qat yoxdur');
        }
      } catch (error) {
        console.error('Edit butonu güncellenirken hata:', error);
      }
    }, 300);

    // Cleanup
    return () => clearTimeout(timer);
  }, [drawnItems, mapReadyRef.current]);

  // Kontrol butonlarını içeren bölüm
  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full rounded-xl overflow-hidden"></div>

      {/* Edit butonunun doğru çalışması için CSS düzeltmeleri */}
      <style jsx global>{`
        .leaflet-draw-edit-edit:not(.leaflet-disabled) {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
      `}</style>

      {/* Popup stil tanımlaması */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background-color: rgba(10, 26, 47, 0.9);
          color: white;
          border-radius: 8px;
          border: 1px solid #00B4A2;
          backdrop-filter: blur(8px);
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px 16px;
          font-size: 14px;
          line-height: 1.6;
        }
        .custom-popup .leaflet-popup-tip {
          background-color: rgba(10, 26, 47, 0.9);
          border: 1px solid #00B4A2;
        }
        .custom-popup b {
          color: #00E5CC;
        }
        
        /* Edit butonu düzeltmeleri */
        .leaflet-draw-edit-edit {
          cursor: pointer !important;
        }
        
        .leaflet-draw-edit-edit:not(.leaflet-disabled) {
          pointer-events: auto !important;
          opacity: 1 !important;
        }
        
        .leaflet-draw-edit-edit.leaflet-disabled {
          cursor: default !important;
          opacity: 0.5 !important;
        }
        
        /* Daire butonu ve ilgili elementleri gizle */
        .leaflet-draw-draw-circle,
        .leaflet-draw-toolbar a.leaflet-draw-draw-circle,
        .leaflet-draw-toolbar-button-enabled.leaflet-draw-draw-circle {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          overflow: hidden !important;
        }
      `}</style>

      {/* Kontrol butonları */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        {/* Seçim modu düğmesi */}
        <button
          onClick={toggleSelectionMode}
          className={`p-2 rounded-lg shadow-lg flex items-center justify-center transition-all ${selectionModeActive
              ? 'bg-[#FF4500] text-white border-2 border-white'
              : 'bg-white text-[#142F47] hover:bg-gray-100'
            }`}
          title={selectionModeActive ? 'Seçim rejimini bağla' : 'Geometrləri seç'}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span className="ml-1 text-xs font-medium">
              Geometri seçimi
            </span>
          </div>
        </button>

        {selectionModeActive && selectedLayersRef.current.length > 0 && (
          <button
            onClick={deleteSelectedGeometries}
            className="p-2 rounded-lg bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all flex items-center justify-center"
            title="Seçilmiş geometrləri sil"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="ml-1 text-xs font-medium">Sil</span>
          </button>
        )}
      </div>
    </div>
  );
});

// Bileşen display name'i (React DevTools için)
MapComponent.displayName = 'MapComponent';

export default MapComponent; 