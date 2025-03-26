'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

// Leaflet'i sadece client tarafında import et
let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
}

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

interface SetBoundsToResultsProps {
  results: PoiResult[];
}

export function SetBoundsToResults({ results }: SetBoundsToResultsProps) {
  const map = useMap();
  const [isMapReady, setIsMapReady] = useState(false);

  // Haritanın hazır olup olmadığını kontrol et
  useEffect(() => {
    if (!map) return;

    // Harita DOM elemanlarının yüklenmesini bekle
    const checkMapReady = () => {
      try {
        // Leaflet'in iç özelliklerine erişmek için any tipini kullanıyoruz
        const leafletMap = map as any;
        
        // Haritanın DOM elementlerinin yüklenip yüklenmediğini kontrol et
        if (map && typeof map.getContainer === 'function' && leafletMap._container && leafletMap._mapPane) {
          setIsMapReady(true);
        } else {
          // Hala hazır değilse, kısa bir süre sonra tekrar dene
          setTimeout(checkMapReady, 100);
        }
      } catch (error) {
        console.error("Harita hazırlık kontrolünde hata:", error);
        // Hata durumunda bir süre sonra tekrar dene
        setTimeout(checkMapReady, 200);
      }
    };

    checkMapReady();
  }, [map]);

  // Harita hazır olduğunda ve sonuçlar varsa sınırları ayarla
  useEffect(() => {
    if (!isMapReady || !results || results.length === 0) return;

    try {
      // Map ve fitBounds metodunun varlığını kontrol et
      if (!map || !map.fitBounds) return;

      // Haritanın DOM içinde olduğunu kontrol et
      if (!map.getContainer() || !map.getContainer().parentElement) return;

      // Tüm sonuçların sınırlarını al
      // @ts-ignore - Leaflet tiplemesi ile ilgili sorun
      const bounds = new L.LatLngBounds();
      
      // Tüm sonuçları bounds'a ekle
      results.forEach(result => {
        if (result.lat && result.lon) {
          bounds.extend([result.lat, result.lon]);
        }
      });

      // Sınırların geçerli olduğundan emin ol
      if (bounds.isValid()) {
        // Haritanın DOM'da tam olarak hazır olması için kısa bir gecikme ekle
        setTimeout(() => {
          try {
            map.fitBounds(bounds, {
              padding: [50, 50],
              maxZoom: 15,
              animate: true,
              duration: 0.5
            });
          } catch (e) {
            console.error("fitBounds hatası:", e);
          }
        }, 300);
      } else {
        // Eğer geçerli sınırlar bulunamazsa, varsayılan görünüme dön
        setTimeout(() => {
          try {
            map.setView([40.1431, 47.5769], 7);
          } catch (e) {
            console.error("setView hatası:", e);
          }
        }, 300);
      }
    } catch (error) {
      console.error("Harita sınırları ayarlanırken hata oluştu:", error);
    }
  }, [map, results, isMapReady]);

  // Bu bileşen herhangi bir şey render etmiyor, sadece haritayı düzenliyor
  return null;
} 