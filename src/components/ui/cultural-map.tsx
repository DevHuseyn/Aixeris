"use client";

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { Map as LeafletMap } from 'leaflet';

// Leaflet bileşenleri için client-side rendering kullan
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Arayüz tanımlamaları
interface CulturalMapProps {
  selectedCategories: string[];
  searchTerm: string;
}

// Məkan nöqtəsi interfeysi
interface CulturalPlace {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  description?: string;
}

export default function CulturalMap({ selectedCategories, searchTerm }: CulturalMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [culturalPlaces, setCulturalPlaces] = useState<CulturalPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<CulturalPlace[]>([]);
  const mapRef = useRef(null);
  
  // Örnek kültürel yerler - gerçek uygulamada bunları bir API'den alabilirsiniz
  useEffect(() => {
    // Kültürel yerlerin örnek verisi
    const samplePlaces: CulturalPlace[] = [
      {
        id: 1,
        name: "Şirvanşahlar Sarayı",
        category: "monument",
        lat: 40.3667,
        lng: 49.8352,
        description: "XV əsrdə Şirvanşahlar dövlətinin paytaxtı olmuş tarixi kompleks"
      },
      {
        id: 2,
        name: "Qız Qalası",
        category: "monument",
        lat: 40.3665,
        lng: 49.8372,
        description: "Bakının simvollarından biri olan qədim qala"
      },
      {
        id: 3,
        name: "Azərbaycan Milli İncəsənət Muzeyi",
        category: "museum",
        lat: 40.3729,
        lng: 49.8337,
        description: "Azərbaycanın ən böyük incəsənət muzeylərindən biri"
      },
      {
        id: 4,
        name: "Azərbaycan Xalçası və Xalq Tətbiqi Sənəti Dövlət Muzeyi",
        category: "museum",
        lat: 40.3705,
        lng: 49.8354,
        description: "Xalçaçılıq və tətbiqi sənət nümunələrinin sərgiləndiyi muzey"
      },
      {
        id: 5,
        name: "Heydər Əliyev Mərkəzi",
        category: "cultural_center",
        lat: 40.3956,
        lng: 49.8674,
        description: "Zaha Hadid tərəfindən layihələndirilmiş müasir memarlıq incilərdən biri"
      }
    ];
    
    setCulturalPlaces(samplePlaces);
    
    // Yükleniyor durumunu kapat
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsMapReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtreleme işlemi
  useEffect(() => {
    let filtered = [...culturalPlaces];
    
    // Kategorilere göre filtreleme
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(place => 
        selectedCategories.includes(place.category)
      );
    }
    
    // Arama terimine göre filtreleme
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(term) || 
        place.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredPlaces(filtered);
  }, [culturalPlaces, selectedCategories, searchTerm]);

  // Kategori adını Azerice göster
  const getCategoryName = (category: string): string => {
    switch(category) {
      case 'monument': return 'Abidə';
      case 'museum': return 'Muzey';
      case 'cultural_center': return 'Mədəniyyət Mərkəzi';
      case 'historical_site': return 'Tarixi Yer';
      case 'archaeology': return 'Arxeoloji Ərazi';
      default: return category;
    }
  };

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="cultural-map-container relative h-[60vh] md:h-[70vh] w-full max-w-5xl mx-auto z-10 rounded-lg overflow-hidden shadow-lg border border-[#00B4A2]/20 bg-[#0A1A2F]/80 backdrop-blur-sm">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0A1A2F]/80 z-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00E5CC] mb-3"></div>
            <p className="text-gray-300">Xəritə yüklənir...</p>
          </div>
        </div>
      ) : isMapReady ? (
        <div className="h-full w-full relative">
          <MapContainer
            center={[40.3947, 49.8397]} // Bakının koordinatları
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredPlaces.map((place) => (
              <Marker 
                key={place.id}
                position={[place.lat, place.lng]}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-base">{place.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{getCategoryName(place.category)}</p>
                    {place.description && (
                      <p className="text-sm mt-2">{place.description}</p>
                    )}
                    <div className="mt-3 text-xs">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 inline-block"
                      >
                        Google Xəritədə aç
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {filteredPlaces.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
              <div className="bg-white p-4 rounded-lg max-w-sm mx-4 text-center">
                <p className="text-gray-800">
                  Seçdiyiniz filtrlərə uyğun nəticə tapılmadı. Xahiş edirik başqa filtrlər seçin.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Mədəniyyət Məkanları Xəritəsi
          </h3>
          <p className="text-gray-400 mb-4">
            Xəritə müvəqqəti olaraq xidmətdən kənarlaşdırılıb. Tezliklə yenidən xidmətinizdə olacaq.
          </p>
          
          <div className="mt-4 bg-[#142F47] p-4 rounded-lg max-w-xl">
            <p className="text-sm text-gray-400">
              Axtarış meyarları: {searchTerm ? `"${searchTerm}"` : "Təyin olunmayıb"}
            </p>
            <p className="text-sm text-gray-400">
              Seçilmiş kateqoriyalar: {selectedCategories.length > 0 
                ? selectedCategories.map(c => getCategoryName(c)).join(", ") 
                : "Bütün kateqoriyalar"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 