'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SetBoundsToResults } from '@/components/SetBoundsToResults';
import dynamic from 'next/dynamic';

// Leaflet sadece client tarafında çalışır
let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  
  // İkonları base64 formatında doğrudan kullanmak için:
  delete L.Icon.Default.prototype._getIconUrl;
  
  // İkonları CDN üzerinden yükle
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Özel marker simgeleri (favicon kullan)
const getMarkerIcon = (category: string) => {
  if (typeof window === 'undefined' || !L) return null;

  // Default icon - CSS sınıf kullanarak stillendirme yapacağız
  return new L.Icon.Default();
};

// Etiketlerden kategori belirle
const getCategoryFromTags = (tags: any): string => {
  if (!tags) return 'other';
  if (tags.historic) return tags.historic;
  if (tags.tourism && tags.tourism === 'museum') return 'museum';
  if (tags.amenity && tags.amenity === 'place_of_worship') return 'place_of_worship';
  if (tags.monument) return 'monument';
  if (tags.archaeological_site) return 'archaeological_site';
  return 'other';
};

// Kategori gösterme adını belirle
const getCategoryDisplay = (category: string): string => {
  const categoryDisplayMap: { [key: string]: string } = {
    'museum': 'Muzey',
    'monument': 'Abidə',
    'memorial': 'Memorial',
    'archaeological_site': 'Arxeoloji Ərazi',
    'ruins': 'Xarabalıq',
    'castle': 'Qala',
    'heritage': 'Mədəni İrs',
    'place_of_worship': 'İbadət Yeri',
    'fort': 'İstehkam',
    'other': 'Digər'
  };
  
  return categoryDisplayMap[category] || category;
};

// PoiResult tipini tanımlıyoruz
interface PoiResult {
  id: number;
  type: string;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    [key: string]: string | undefined;
  };
}

interface MapDisplayProps {
  results: PoiResult[];
  isLoading: boolean;
  searchMessage: string;
}

// Marker gösterme yardımcı fonksiyonu
const MapMarkers = ({ results, map }: { results: PoiResult[], map: any }) => {
  // Zamanında marker oluşturulmasını sağlamak için kontrol edelim
  if (!results || results.length === 0 || !map) return null;

  // Marker'a tıklandığında belirli bir konuma zoom yapma
  const handleZoomToLocation = (lat: number, lon: number) => {
    if (map) {
      map.setView([lat, lon], 16, {
        animate: true,
        duration: 0.5
      });
    }
  };

  return (
    <>
      {results.map((result) => {
        // Kategori belirle
        const category = getCategoryFromTags(result.tags);
        const categoryClass = category === 'museum' ? 'museum-marker' : 
                              category === 'monument' || category === 'memorial' ? 'monument-marker' : 
                              'historic-marker';

        // Marker özelleştirme (ikon ve CSS sınıfı)
        return (
          <Marker
            key={`marker-${result.type}-${result.id}`}
            position={[result.lat, result.lon]}
          >
            <Popup className="custom-popup">
              <div className="text-sm p-2">
                <h3 className="font-bold text-white text-base mb-2">{result.tags.name || 'İsimsiz yer'}</h3>
                <p className="text-gray-200 mb-3">{getCategoryDisplay(category)}</p>
                
                <div className="flex gap-2 mt-3">
                  {/* Google Haritalarda Görüntüle Butonu */}
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lon}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-1.5 bg-red-600/60 hover:bg-red-500/60 text-white text-xs font-medium rounded flex items-center justify-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Google Xəritədə
                  </a>
                  
                  {/* Zoom Yapma Butonu */}
                  <button 
                    onClick={() => handleZoomToLocation(result.lat, result.lon)}
                    className="flex-1 px-3 py-1.5 bg-blue-600/60 hover:bg-blue-500/60 text-white text-xs font-medium rounded flex items-center justify-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Yaxınlaşdır
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

// MapEventHandler bileşeni ekstra olayları dinler
const MapEventHandler = () => {
  const map = useMap();
  
  // zoomToLocation olayını dinle
  useEffect(() => {
    if (!map) return;
    
    const handleZoomToLocation = (e: any) => {
      try {
        const { lat, lng, zoom = 16 } = e.detail;
        
        // Haritanın DOM elementlerinin tam olarak yüklendiğinden emin olalım
        if (map && map.getContainer()) {
          // Yeni konuma zoom yap
          setTimeout(() => {
            map.setView([lat, lng], zoom, {
              animate: true,
              duration: 0.5
            });
          }, 100);
        }
      } catch (error) {
        console.error('Konuma zoom yaparken hata:', error);
      }
    };
    
    // Olayı dinle
    window.addEventListener('zoomToLocation', handleZoomToLocation);
    
    // Temizleme fonksiyonu
    return () => {
      window.removeEventListener('zoomToLocation', handleZoomToLocation);
    };
  }, [map]);
  
  return null;
};

// MapDisplay bileşeni
export const MapDisplay = ({ results, isLoading, searchMessage }: {
  results: PoiResult[];
  isLoading: boolean;
  searchMessage: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapObj, setMapObj] = useState<LeafletMap | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [containerReady, setContainerReady] = useState(false);

  // Client tarafında mount edildiğini kontrol et
  useEffect(() => {
    // Tarayıcı tarafında çalıştığını kontrol et
    if (typeof window !== 'undefined') {
      setIsMounted(true);
      
      // DOM hazırlığını kontrol etmek için bir gecikme ekle
      setTimeout(() => {
        if (mapContainerRef.current) {
          setContainerReady(true);
        }
      }, 250);
    }
  }, []);

  // Konteyner DOM'a eklendikten sonra hazır olup olmadığını kontrol et
  useEffect(() => {
    if (!isMounted) return;
    
    const checkContainerReady = () => {
      if (mapContainerRef.current) {
        setContainerReady(true);
      } else {
        setTimeout(checkContainerReady, 100);
      }
    };
    
    checkContainerReady();
  }, [isMounted]);

  // Harita objesi hazır olduğunda
  const handleMapReady = (map: LeafletMap) => {
    if (map) {
      setMapObj(map);
      setIsMapInitialized(true);
    }
  };

  // Harita bileşeni hazır olduğunda hazırlık için bir bileşen
  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      if (map) {
        handleMapReady(map);
      }
    }, [map]);
    
    return null;
  };

  // Eğer tarayıcı tarafında değilse veya bileşen mount edilmediyse
  if (!isMounted) {
    return (
      <div ref={mapContainerRef} className="h-full w-full relative bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <p className="mt-2 text-cyan-400 font-medium">Xəritə yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainerRef} className="h-full w-full relative">
      {/* Yükleniyor göstergesi */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="mt-2 text-cyan-400 font-medium">Məlumatlar yüklənir...</p>
          </div>
        </div>
      )}
      
      {/* Harita - Sadece client tarafında, bileşen mount edildiğinde ve konteyner hazır olduğunda göster */}
      {isMounted && containerReady && (
        <MapContainer
          center={[40.1431, 47.5769]} // Azerbaycan'ın merkezi
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          {/* Harita konteyneri hazır olduğunda haritayı başlat */}
          <MapController />
          
          {/* Harita Altlığı */}
          <TileLayer
            attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Markerlerin oluşturulması - Sadece harita ve sonuçlar varsa */}
          {isMapInitialized && mapObj && results && results.length > 0 && (
            <MapMarkers results={results} map={mapObj} />
          )}
          
          {/* Sonuçlara göre haritayı odakla - Sadece harita ve sonuçlar varsa */}
          {isMapInitialized && mapObj && results && results.length > 0 && !isLoading && (
            <SetBoundsToResults results={results} />
          )}
          
          {/* Harita olaylarını dinleyen bileşen */}
          <MapEventHandler />
        </MapContainer>
      )}
    </div>
  );
} 