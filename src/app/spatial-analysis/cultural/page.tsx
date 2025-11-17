"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { getDataWithCache, getCacheKey } from '@/lib/cache-manager';
import { startAutoRefreshService } from '@/lib/refresh-service';

// Leaflet CSS stillerini özelleştir 
// Bu stil, pop-up pencerelerin diğer elemanların üzerinde görünmesini sağlar
const leafletStyles = `
  .leaflet-popup {
    z-index: 1000 !important;
  }
  .leaflet-popup-content-wrapper, 
  .leaflet-popup-tip {
    background-color: #1f2937;
    color: white;
    box-shadow: 0 3px 14px rgba(0,0,0,0.4);
    border: 1px solid rgba(75, 85, 99, 0.5);
  }
  .leaflet-container {
    z-index: 1;
    font-family: inherit;
  }
  .leaflet-popup-content {
    margin: 8px 8px;
    line-height: 1.4;
    color: white;
    min-width: 200px;
  }
  .leaflet-popup-content p {
    margin: 4px 0;
  }
  .leaflet-popup-content a {
    color: white;
    text-decoration: none;
  }
  .leaflet-popup-content button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  .leaflet-popup-close-button {
    color: white !important;
  }
  
  /* Marker stilleri */
  .custom-marker {
    filter: hue-rotate(0deg);
  }
  .museum-marker {
    filter: hue-rotate(30deg);
  }
  .monument-marker {
    filter: hue-rotate(120deg);
  }
  .historic-marker {
    filter: hue-rotate(200deg);
  }
  
  /* Harita kontrol butonlarının daha görünür olması */
  .leaflet-control-zoom a {
    background-color: rgba(31, 41, 55, 0.8) !important;
    color: white !important;
    border-color: rgba(75, 85, 99, 0.5) !important;
  }
  .leaflet-control-zoom a:hover {
    background-color: rgba(55, 65, 81, 0.8) !important;
  }
  
  /* Popup'ların diğer içeriklerin üzerinde görünmesi için */
  .leaflet-pane {
    z-index: 400 !important;
  }
  .leaflet-overlay-pane {
    z-index: 400 !important;
  }
  .leaflet-shadow-pane {
    z-index: 500 !important;
  }
  .leaflet-marker-pane {
    z-index: 600 !important;
  }
  .leaflet-tooltip-pane {
    z-index: 650 !important;
  }
  .leaflet-popup-pane {
    z-index: 700 !important;
  }
  .leaflet-map-pane {
    z-index: 400 !important;
  }
  .leaflet-tile-pane {
    z-index: 200 !important;
  }
  
  /* Custom popup stili */
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 8px;
    padding: 0;
    background-color: #1f2937;
    border: 1px solid rgba(75, 85, 99, 0.5);
  }
  .custom-popup .leaflet-popup-content {
    margin: 0;
    min-width: 200px;
  }
`;

// Leaflet bileşenlerini dinamik olarak yükle (SSR sorunlarını önlemek için)
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

// SetBoundsToResults bileşenini dinamik olarak yükle
const DynamicSetBoundsToResults = dynamic(
  () => import('@/components/SetBoundsToResults').then((mod) => mod.SetBoundsToResults),
  { ssr: false }
);

// Dinamik harita bileşeni
const MapDisplay = dynamic(() => import('@/components/MapDisplay').then(mod => mod.MapDisplay), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-800/50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
    </div>
  )
});

// Leaflet ikonlarını SSR dışında yükle
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

// Azerbaycan rayonları
const regions = [
  { id: "baku", name: "Bakı" },
  { id: "ganja", name: "Gəncə" },
  { id: "sumgait", name: "Sumqayıt" },
  { id: "lankaran", name: "Lənkəran" },
  { id: "mingachevir", name: "Mingəçevir" },
  { id: "shirvan", name: "Şirvan" },
  { id: "nakhchivan", name: "Naxçıvan" },
  { id: "sheki", name: "Şəki" },
  { id: "yevlakh", name: "Yevlax" },
  { id: "khankendi", name: "Xankəndi" },
  { id: "agdam", name: "Ağdam" },
  { id: "fuzuli", name: "Füzuli" },
  { id: "shusha", name: "Şuşa" },
  { id: "agdash", name: "Ağdaş" },
  { id: "agjabadi", name: "Ağcabədi" },
  { id: "astara", name: "Astara" },
  { id: "balakan", name: "Balakən" },
  { id: "barda", name: "Bərdə" },
  { id: "beylagan", name: "Beyləqan" },
  { id: "bilasuvar", name: "Biləsuvar" },
  { id: "dashkasan", name: "Daşkəsən" },
  { id: "gabala", name: "Qəbələ" },
  { id: "gakh", name: "Qax" },
  { id: "gazakh", name: "Qazax" },
  { id: "goranboy", name: "Goranboy" },
  { id: "goychay", name: "Göyçay" },
  { id: "hajigabul", name: "Hacıqabul" },
  { id: "imishli", name: "İmişli" },
  { id: "ismailli", name: "İsmayıllı" },
  { id: "kalbajar", name: "Kəlbəcər" },
  { id: "kurdamir", name: "Kürdəmir" },
  { id: "lachin", name: "Laçın" },
  { id: "lerik", name: "Lerik" },
  { id: "masally", name: "Masallı" },
  { id: "neftchala", name: "Neftçala" },
  { id: "oghuz", name: "Oğuz" },
  { id: "qabala", name: "Qəbələ" },
  { id: "quba", name: "Quba" },
  { id: "qusar", name: "Qusar" },
  { id: "saatly", name: "Saatlı" },
  { id: "sabirabad", name: "Sabirabad" },
  { id: "salyan", name: "Salyan" },
  { id: "shamakhi", name: "Şamaxı" },
  { id: "shamkir", name: "Şəmkir" },
  { id: "shubra", name: "Şabran" },
  { id: "siazan", name: "Siyəzən" },
  { id: "tartar", name: "Tərtər" },
  { id: "tovuz", name: "Tovuz" },
  { id: "ujar", name: "Ucar" },
  { id: "yardimly", name: "Yardımlı" },
  { id: "zangilan", name: "Zəngilan" },
  { id: "zardab", name: "Zərdab" },
];

// Veri türleri (kategoriler)
const categories = [
  { id: "museum", name: "Muzeylər", icon: "🏛️" },
  { id: "landmark", name: "Tarixi Abidələr", icon: "🏰" },
  { id: "gallery", name: "Sənət Qalereyaları", icon: "🎨" },
  { id: "theater", name: "Teatrlar", icon: "🎭" },
  { id: "monument", name: "Heykəllər", icon: "🗿" },
  { id: "library", name: "Kitabxanalar", icon: "📚" },
  { id: "historical_site", name: "Tarixi Ərazilər", icon: "🏯" },
  { id: "cultural_center", name: "Mədəniyyət Mərkəzləri", icon: "🎪" },
];

// OpenStreetMap kategorilerinin OSM etiketlerine eşleştirilmesi
const categoryToOsmTag = {
  "museum": { key: "tourism", value: "museum" },
  "landmark": { key: "historic", value: "landmark|memorial|monument|archaeological_site|ruins|castle|fort" },
  "gallery": { key: "tourism", value: "gallery" },
  "theater": { key: "amenity", value: "theatre" },
  "monument": { key: "historic", value: "monument" },
  "library": { key: "amenity", value: "library" },
  "historical_site": { key: "historic", value: "archaeological_site" },
  "cultural_center": { key: "amenity", value: "arts_centre" },
};

// Sonuç elementi tipi
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

// Kategori görüntüleme adını belirle
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

// Liste öğesine tıklandığında haritayı o konuma odakla
const handleListItemClick = (result: any) => {
  if (typeof window === 'undefined') return;
  
  // Haritayı seçilen konuma odakla
  const event = new CustomEvent('zoomToLocation', {
    detail: {
      lat: result.lat,
      lng: result.lon
    }
  });
  
  // Event'i tetikle
  window.dispatchEvent(event);
};

// Benzersiz sonuçları almak için yardımcı fonksiyon
const getUniqueResults = (items: any[]) => {
  const uniqueIds = new Set();
  return items.filter(item => {
    const uniqueId = `${item.type}-${item.id}`;
    if (uniqueIds.has(uniqueId)) {
      return false;
    }
    uniqueIds.add(uniqueId);
    return true;
  });
};

export default function CulturalMapPage() {
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["museum"]);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [results, setResults] = useState<PoiResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [showSearchMessage, setShowSearchMessage] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [initialSearchPerformed, setInitialSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [resultsPerPage, setResultsPerPage] = useState<number>(100);
  const [allResults, setAllResults] = useState<PoiResult[]>([]);
  
  // Tüm kategorileri seçme fonksiyonu
  const selectAllCategories = () => {
    setSelectedCategories(Object.keys(categoryToOsmTag));
    setErrorMessage("");
  };
  
  // Kategori seçimini değiştirme
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(current => {
      // Eğer seçili olan kategoriyi kaldırmak istiyorsak ve bu tek seçili kategoriyse
      if (current.includes(categoryId) && current.length === 1) {
        setErrorMessage("Ən azı bir kateqoriya seçilməlidir!");
        return current; // Mevcut durumu değiştirmeden geri dön
      }
      
      setErrorMessage(""); // Hata mesajını temizle
      return current.includes(categoryId)
        ? current.filter(id => id !== categoryId)
        : [...current, categoryId];
    });
  };

  // Bölge seçimini değiştirme
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  // Filtreleri temizleme
  const clearFilters = () => {
    setSelectedRegion("");
    setSelectedCategories(["museum"]); // Temizlerken varsayılan kategoriyi seç
    setErrorMessage("");
  };

  // Region ID'den region adını al
  const getRegionName = (regionId: string): string => {
    // Önce bölge listesinde bu ID'yi bul
    const region = regions.find(r => r.id === regionId);
    if (region) return region.name;
    
    // Eğer bulamazsa, varsayılan değer olarak Azerbaycan döndür
    return "Azərbaycan";
  };

  // Sayfa yüklendiğinde ilk verileri yükleme - artık buradan otomatik arama kaldırıldı
  useEffect(() => {
    // Kullanıcı sayfaya girdiğinde otomatik veri yüklemesi yapmıyoruz
    // Sadece kategorilerin varsayılan değerlerini ayarlıyoruz - sadece müze seçili olacak
    setSelectedCategories(["museum"]);
    console.log("Varsayılan kategori ayarlandı: museum");
  }, []);

  // Otomatik yenileme için
  useEffect(() => {
    if (!autoRefresh || !initialSearchPerformed) return;
    
    // 30 dakikada bir yenileme yap (30 saniye yerine)
    const interval = setInterval(() => {
      handleSearch();
    }, 1800000); // 30 dakika = 30 * 60 * 1000 = 1800000 ms
    
    return () => clearInterval(interval);
  }, [autoRefresh, initialSearchPerformed, selectedRegion, selectedCategories]);

  // Arama mesajı gösterildiğinde 5 saniye sonra otomatik olarak gizleme
  useEffect(() => {
    if (searchMessage) {
      setShowSearchMessage(true);
      
      // 5 saniye sonra mesajı gizle
      const timer = setTimeout(() => {
        setShowSearchMessage(false);
      }, 5000); // 5 saniye
      
      // Temizleme işlevi
      return () => clearTimeout(timer);
    }
  }, [searchMessage]);

  // Arama işlemini gerçekleştir
  const handleSearch = async () => {
    setIsLoading(true);
    setResults([]);
    setCurrentPage(1);
    setSearchMessage('');
    setShowSearchMessage(false);
    
    // Arama işlemi yapıldığını işaretle
    setInitialSearchPerformed(true);

    // Kategori seçimi kontrolü
    if (selectedCategories.length === 0) {
      setSearchMessage("Zəhmət olmasa ən azı bir kateqoriya seçin.");
      setShowSearchMessage(true);
      setIsLoading(false);
      return;
    }

    try {
      // Hata ayıklama - istek parametrelerini göster
      console.log("Arama parametreleri:", {
        region: selectedRegion,
        categories: selectedCategories,
        toplam_kategori: selectedCategories.length
      });

      // Cache kullanarak veri getir
      const fetchOSMData = async () => {
        // Bakü için özel işlem
        if (selectedRegion === "baku") {
          console.log("Bakü verisi getiriliyor...");
          const bakuResults = await fetchBakuData();
          console.log("Bakü API sonuç sayısı:", bakuResults.length);
          return bakuResults;
        }
        
        // Normal sorgu için verileri getir
        console.log("Bölge verisi getiriliyor...");
        const regionResults = await fetchRegionData();
        console.log("Bölge API sonuç sayısı:", regionResults.length);
        return regionResults;
      };
      
      // Cache kullanarak verileri getir - autoRefresh modundaysa cache kullanma
      const cachedResults = await getDataWithCache(
        selectedRegion || "azerbaijan",
        selectedCategories,
        fetchOSMData,
        autoRefresh ? 0 : undefined // autoRefresh açıksa cache süresi 0
      );
      
      console.log("Toplam sonuç sayısı:", cachedResults.length);
      
      // Tüm sonuçları saklıyoruz
      setAllResults(cachedResults);
      
      // İlk sayfayı gösteriyoruz
      const startIndex = 0;
      const endIndex = Math.min(resultsPerPage, cachedResults.length);
      setResults(cachedResults.slice(startIndex, endIndex));
      
      if (cachedResults.length > 0) {
        // Sonuç mesajını göster
        const regionName = selectedRegion === "baku" 
          ? "Bakıda" 
          : selectedRegion 
            ? `${getRegionName(selectedRegion)} bölgəsində` 
            : "Azərbaycanda";
        
        const newSearchMessage = `${regionName} ${cachedResults.length} nəticə tapıldı.`;
        
        // Mesaj değiştiyse güncelle ve mesajı göster
        if (searchMessage !== newSearchMessage) {
          setSearchMessage(newSearchMessage);
          setShowSearchMessage(true);
        }
      } else {
        setSearchMessage("Seçilmiş filterlərə uyğun nəticə tapılmadı.");
        setShowSearchMessage(true);
      }
    } catch (error) {
      console.error("Veri alınamadı:", error);
      setSearchMessage("Məlumat əldə edərkən xəta baş verdi. Zəhmət olmasa daha sonra yenidən cəhd edin.");
      setShowSearchMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Normal bölge sorgusu için veri getirme fonksiyonu
  const fetchRegionData = async (): Promise<PoiResult[]> => {
    let regionQuery;
    
    if (!selectedRegion || selectedRegion === "") {
      // Tüm Azerbaycan için sorgu
      regionQuery = `area["name"="Azərbaycan"]["admin_level"="2"]->.searchArea;`;
    } else {
      // Seçilen bölge için sorgu
      // Farklı etiket kombinasyonlarını dene
      const regionName = getRegionName(selectedRegion);
      regionQuery = `
        (
          area["name"="${regionName}"];
          area["name:az"="${regionName}"];
          area["int_name"="${regionName}"];
        )->.searchArea;
      `;
    }

    // Seçilen kategorilere göre sorgu oluştur
    const categoryQueries = selectedCategories.map(catId => {
      const osmTag = categoryToOsmTag[catId as keyof typeof categoryToOsmTag];
      
      // Sorguyu değiştirelim - * kullanmak yerine her değeri OR işlemi ile ekleyelim
      if (osmTag.value.includes("|")) {
        // Birden fazla değeri OR ile bağla
        const values = osmTag.value.split("|");
        return values.map(val => `
          node["${osmTag.key}"="${val}"](area.searchArea);
          way["${osmTag.key}"="${val}"](area.searchArea);
          relation["${osmTag.key}"="${val}"](area.searchArea);
        `).join("");
      } else {
        // Tekli değer için normal sorgu
        return `
          node["${osmTag.key}"="${osmTag.value}"](area.searchArea);
          way["${osmTag.key}"="${osmTag.value}"](area.searchArea);
          relation["${osmTag.key}"="${osmTag.value}"](area.searchArea);
        `;
      }
    }).join("");

    const overpassQuery = `
      [out:json][timeout:30];
      ${regionQuery}
      (
        ${categoryQueries}
      );
      out body;
      >;
      out skel qt;
    `;

    console.log("Oluşturulan Overpass sorgusu:", overpassQuery);

    // Overpass API'sine sorgu gönder
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    console.log("API isteği gönderiliyor:", overpassUrl);
    
    const response = await fetch(overpassUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    console.log("API yanıtı alındı, durum kodu:", response.status);

    if (!response.ok) {
      throw new Error(`API isteği başarısız: ${response.status}`);
    }

    const data = await response.json();
    console.log("API'den alınan element sayısı:", data.elements?.length || 0);
    
    // Sonuçları işle ve filtreleri uygula
    let filteredResults = data.elements
      .map((element: any) => ({
        id: element.id,
        type: element.type,
        lat: element.lat || (element.center ? element.center.lat : undefined),
        lon: element.lon || (element.center ? element.center.lon : undefined),
        tags: element.tags || {}
      }))
      .filter((result: any) => result.lat && result.lon);
    
    // Benzersiz sonuçları al
    return getUniqueResults(filteredResults);
  };

  // Bakü için özel sorgu fonksiyonu
  const fetchBakuData = async (): Promise<PoiResult[]> => {
    try {
      // Bakü için coğrafi koordinat sınırları
      // Bakü şehrinin yaklaşık koordinatları: 40.3943, 49.8622
      // Bu koordinatların etrafında arama yap
      const bakuBbox = "40.2943,49.7622,40.4943,49.9622";
      
      // Overpass API sorgusu - doğrudan bbox kullanarak sorgu yap
      const query = `
        [out:json][timeout:25][bbox:${bakuBbox}];
        (
          ${selectedCategories.map(catId => {
            const osmTag = categoryToOsmTag[catId as keyof typeof categoryToOsmTag];
            
            // Sorguyu değiştirelim - * kullanmak yerine her değeri OR işlemi ile ekleyelim
            if (osmTag.value.includes("|")) {
              // Birden fazla değeri OR ile bağla
              const values = osmTag.value.split("|");
              return values.map(val => `
                node["${osmTag.key}"="${val}"];
                way["${osmTag.key}"="${val}"];
                relation["${osmTag.key}"="${val}"];
              `).join("");
            } else {
              // Tekli değer için normal sorgu
              return `
                node["${osmTag.key}"="${osmTag.value}"];
                way["${osmTag.key}"="${osmTag.value}"];
                relation["${osmTag.key}"="${osmTag.value}"];
              `;
            }
          }).join("")}
        );
        out body;
        >;
        out skel qt;
      `;

      // API'ye sorguyu gönder
      const overpassUrl = "https://overpass-api.de/api/interpreter";
      const response = await fetch(overpassUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      const data = await response.json();
      
      // Sonuçları işle ve filtreleri uygula - sadece koordinatları olmayanları filtrele
      let filteredResults = data.elements
        .map((element: any) => ({
          id: element.id,
          type: element.type,
          lat: element.lat || (element.center ? element.center.lat : undefined),
          lon: element.lon || (element.center ? element.center.lon : undefined),
          tags: element.tags || {}
        }))
        .filter((result: any) => result.lat && result.lon);
      
      // Benzersiz sonuçları al
      filteredResults = getUniqueResults(filteredResults);
      
      // Tüm sonuçları ve ilk sayfa verisini ayarla
      if (filteredResults.length === 0) {
        // Sonuç bulunamadı ise, daha geniş bir bbox ile tekrar dene
        const widerBakuBbox = "40.2443,49.7122,40.5443,50.0122";
        return await retryWithWiderArea(widerBakuBbox);
      }
      
      return filteredResults;
    } catch (error) {
      console.error("Bakü verileri alınamadı:", error);
      return [];
    }
  };

  // Daha geniş alan için yeniden sorgu yap
  const retryWithWiderArea = async (bbox: string): Promise<PoiResult[]> => {
    try {
      const categoryQueries = selectedCategories.map(catId => {
        const osmTag = categoryToOsmTag[catId as keyof typeof categoryToOsmTag];
        
        // Sorguyu değiştirelim - * kullanmak yerine her değeri OR işlemi ile ekleyelim
        if (osmTag.value.includes("|")) {
          // Birden fazla değeri OR ile bağla
          const values = osmTag.value.split("|");
          return values.map(val => `
            node["${osmTag.key}"="${val}"];
            way["${osmTag.key}"="${val}"];
            relation["${osmTag.key}"="${val}"];
          `).join("");
        } else {
          // Tekli değer için normal sorgu
          return `
            node["${osmTag.key}"="${osmTag.value}"];
            way["${osmTag.key}"="${osmTag.value}"];
            relation["${osmTag.key}"="${osmTag.value}"];
          `;
        }
      }).join("");

      const widerQuery = `
        [out:json][timeout:25][bbox:${bbox}];
        (
          ${categoryQueries}
        );
        out body;
        >;
        out skel qt;
      `;

      // API'ye sorguyu gönder
      const overpassUrl = "https://overpass-api.de/api/interpreter";
      const response = await fetch(overpassUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(widerQuery)}`,
      });

      if (!response.ok) {
        throw new Error(`API isteği başarısız: ${response.status}`);
      }

      const data = await response.json();
      
      // Sonuçları işle - sadece koordinatları olmayanları filtrele
      let filteredResults = data.elements
        .map((element: any) => ({
          id: element.id,
          type: element.type,
          lat: element.lat || (element.center ? element.center.lat : undefined),
          lon: element.lon || (element.center ? element.center.lon : undefined),
          tags: element.tags || {}
        }))
        .filter((result: any) => result.lat && result.lon);
      
      // Benzersiz sonuçları al
      return getUniqueResults(filteredResults);
    } catch (error) {
      console.error("Geniş Bakü alanı sorgulanırken hata oluştu:", error);
      return [];
    }
  };

  // Sayfa değiştirme fonksiyonu
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const startIndex = (pageNumber - 1) * resultsPerPage;
    const endIndex = Math.min(startIndex + resultsPerPage, allResults.length);
    setResults(allResults.slice(startIndex, endIndex));
  };

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(allResults.length / resultsPerPage);

  // Sonuçları indirme fonksiyonu
  const handleDownloadResults = () => {
    // İndirme için sonuçları hazırla
    const downloadData = allResults.map(result => ({
      ad: result.tags.name || 'Adsız',
      tip: getCategoryDisplay(getCategoryFromTags(result.tags)),
      enlik: result.lat,
      uzunluq: result.lon,
      etiketler: Object.entries(result.tags)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ')
    }));

    // CSV formatına çevir
    const csvContent = [
      // Başlık satırı
      ['Ad', 'Tip', 'Enlik', 'Uzunluq', 'Əlavə məlumatlar'].join(','),
      // Veri satırları
      ...downloadData.map(item => 
        [
          `"${item.ad}"`,
          `"${item.tip}"`,
          item.enlik,
          item.uzunluq,
          `"${item.etiketler}"`
        ].join(',')
      )
    ].join('\n');

    // Dosyayı indir
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'medeniyyet-mekanlari.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-16">
      {/* Özel Leaflet Stilleri */}
      <style jsx global>{leafletStyles}</style>
      
      {/* Hero bölümü */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#001220] to-[#00293d] opacity-90"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-90"></div>
        </div>
        
        <div className="relative py-8 border-b border-[#00B4A2]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl lg:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] to-[#00B4A2] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                  Azərbaycanın Mədəniyyət məkanları Xəritəsi
                </h1>
                <h2 className="text-sm lg:text-base text-gray-300 max-w-2xl mx-auto">
                  Azərbaycanın bütün bölgələrindəki mədəniyyət məkanlarını xəritədə kəşf edin
                </h2>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Ana içerik */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Geri dönmə düyməsi */}
        <div className="flex justify-start mb-4">
          <Link
            href="/spatial-analysis"
            className="group flex items-center space-x-3 px-7 py-3 rounded-xl bg-[#142F47]/40 backdrop-blur-md border-2 border-[#00B4A2]/20 hover:border-[#00E5CC]/40 shadow-lg hover:shadow-[0_0_25px_rgba(0,180,162,0.3)] transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00E5CC]/10 to-[#8B6FFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00B4A2]/20 group-hover:bg-[#00B4A2]/40 transition-colors duration-300">
              <svg className="w-5 h-5 text-[#00E5CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span className="font-medium text-base text-white group-hover:text-[#00E5CC] transition-colors duration-300 relative z-10">
              Ana Səhifəyə Qayıt
            </span>
          </Link>
        </div>

        {/* Bilgi Paneli */}
        <div className="mb-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              OpenStreetMap haqqında məlumat
            </h3>
            <button 
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className="text-gray-400 hover:text-white"
            >
              {showInfoPanel ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          {showInfoPanel && (
            <div className="mt-2 text-gray-300 text-xs">
              <p>Bu xəritə OpenStreetMap məlumatlarından istifadə edir. OpenStreetMap (OSM) dünya xəritəsini yaratmaq üçün açıq məlumatlarla işləyən bir layihədir.</p>
              <p className="mt-1">Xəritədə göstərilən məlumatlar real vaxt rejimində yenilənir və icma tərəfindən təmin edilir.</p>
            </div>
          )}
        </div>
        
        {/* Gelişmiş Filtreleme Bölümü */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Gəlişmiş Filtrləmə
            </h3>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-400 hover:text-white"
            >
              {showFilters ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
              </button>
          </div>
          
          {showFilters && (
            <div className="space-y-4">
              {/* Rayon Seçimi */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-1">Hansı rayonun məlumatlarını görmək istəyirsiniz?</label>
                <div className="relative">
                  <select
                    id="region"
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    className="block w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 backdrop-blur-sm text-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none pr-8"
                  >
                    <option value="">Bütün Azərbaycan</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {selectedRegion ? `${getRegionName(selectedRegion)} seçildi` : "Bütün Azərbaycan üzrə axtarış ediləcək"}
                </p>
              </div>
              
              {/* Kategori Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hansı növ məlumatların göstərilməsini istəyirsiniz?</label>
                <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                      className={`px-3 py-1.5 rounded-full flex items-center transition-all text-xs ${
                    selectedCategories.includes(category.id)
                      ? 'bg-blue-600/80 text-white'
                      : 'bg-gray-800/50 backdrop-blur-sm text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                      {selectedCategories.includes(category.id) && (
                        <span className="ml-1 flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Seçilmiş kateqoriyalar: {selectedCategories.length === 0 ? "Yoxdur" : 
                    selectedCategories.map(id => categories.find(c => c.id === id)?.name).join(", ")}
                </p>
                {errorMessage && (
                  <p className="mt-2 text-red-400 text-xs flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorMessage}
                  </p>
                )}
              </div>
              
              {/* Filtreleri Temizle ve Arama butonu */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Filtrləri sıfırla
                </button>
                <button
                  onClick={selectAllCategories}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Bütün Kateqoriyalar
                  </span>
                </button>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-gradient-to-r from-[#00B4A2] to-[#00E5CC] text-gray-900 text-sm font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  disabled={isLoading}
                >
                  <span className="flex items-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Axtarılır...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        Axtarış
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Harita Gösterimi */}
        <div className="mt-6">
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center px-3 py-1.5 rounded-full text-xs ${
                autoRefresh 
                  ? 'bg-green-600/40 text-green-300' 
                  : 'bg-gray-700/50 text-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {autoRefresh ? 'Avtomatik yeniləmə (30 dəq) aktiv' : 'Avtomatik yeniləmə deaktiv'}
            </button>
          </div>

          <div className="border border-gray-700/30 rounded-lg overflow-hidden h-[600px] relative">
            {/* Harita yükleniyor göstergesi */}
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                  <p className="mt-2 text-cyan-400 font-medium">Məlumatlar yüklənir...</p>
                </div>
              </div>
            )}
            
            {/* Arama sonucu mesajı - yavaşça kaybolur */}
            <div className="absolute top-4 left-0 right-0 mx-auto z-30 flex justify-center pointer-events-none">
              <div className={`px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-opacity duration-1000 ${
                showSearchMessage ? 'opacity-100' : 'opacity-0'
              } ${
                results.length > 0 ? 'bg-green-800/80 text-white' : 'bg-yellow-800/80 text-white'
              }`}>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p>{searchMessage}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* OpenStreetMap */}
            <MapDisplay 
              results={initialSearchPerformed ? results : []} 
              isLoading={isLoading}
              searchMessage={searchMessage}
            />
          </div>
        </div>

        {/* Sonuçlar Listesi - sadece arama yapıldıysa göster */}
        {initialSearchPerformed && allResults.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 100 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Tapılan Nəticələr ({allResults.length})
            </h2>
            
            {/* Sayfalama kontrolü */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mb-4 space-x-2">
                <button 
                  onClick={() => handlePageChange(1)} 
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  İlk
                </button>
                
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  &#8592; Əvvəlki
                </button>
                
                <span className="text-white px-3 py-1 bg-gray-800 rounded-md">
                  Səhifə {currentPage} / {totalPages}
                </span>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Növbəti &#8594;
                </button>
                
                <button 
                  onClick={() => handlePageChange(totalPages)} 
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Son
                </button>

                <button 
                  onClick={handleDownloadResults}
                  className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  CSV Yüklə
                </button>
              </div>
            )}
            
            {/* Geçerli sayfadaki sonuçları gösterme */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <div 
                  key={`list-item-${result.type}-${result.id}-${index}`} 
                  className="p-4 border border-gray-700/50 bg-gray-800/30 rounded-lg hover:shadow-lg hover:shadow-cyan-900/20 transition-shadow relative"
                >
                  <div>
                    <h3 className="font-bold truncate text-white">{result.tags.name}</h3>
                    <p className="text-sm text-gray-300 truncate">
                      {getCategoryDisplay(getCategoryFromTags(result.tags))}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.tags.heritage && (
                      <span className="text-xs bg-yellow-900/50 text-yellow-200 px-2 py-1 rounded inline-block">
                        Mədəni Miras
                      </span>
                    )}
                    {result.tags.historic && (
                      <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded inline-block">
                        Tarixi
                      </span>
                    )}
                    {result.tags.tourism && (
                      <span className="text-xs bg-green-900/50 text-green-200 px-2 py-1 rounded inline-block">
                        Turizm
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleListItemClick(result)}
                    className="absolute bottom-4 right-4 p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-all hover:scale-105 flex items-center gap-1.5 text-sm group"
                    title="Bu məkana yaxınlaş"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-rotate-12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM1.5 9a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M13.5 13.5l5 5-1.5 1.5-5-5 1.5-1.5z" clipRule="evenodd" />
                    </svg>
                    <span className="group-hover:text-blue-300">Zoom</span>
                  </button>
                </div>
              ))}
            </div>
            
            {/* Alt sayfalama kontrolü */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <span className="text-gray-400 text-sm">
                  Göstərilən: {(currentPage - 1) * resultsPerPage + 1} - {Math.min(currentPage * resultsPerPage, allResults.length)} / {allResults.length} nəticə
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 