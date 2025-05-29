"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import * as turf from '@turf/turf';
import Link from 'next/link';

// Leaflet bileşenlerini dinamik olarak içe aktarıyoruz (SSR sorunlarını önlemek için)
const MapComponent = dynamic(
  () => import('./components/MapComponent').then(mod => {
    console.log('MapComponent loaded successfully');
    return mod;
  }).catch(err => {
    console.error("Failed to load MapComponent:", err);
    return () => <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-500">Harita yüklenemedi</div>;
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#142F47] text-[#00E5CC]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#00E5CC] border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p>Harita yükleniyor...</p>
        </div>
      </div>
    )
  }
);

// Hesaplama araçları ikonu
const CalculationIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export default function GeographicCalculationsPage() {
  // Aktif hesaplama aracını takip ediyoruz
  const [activeCalculation, setActiveCalculation] = useState<string | null>(null);
  
  // Haritada çizilen geometrileri saklıyoruz
  const [drawnItems, setDrawnItems] = useState<any[]>([]);
  
  // Hesaplama sonuçlarını saklıyoruz
  const [calculationResult, setCalculationResult] = useState<string | null>(null);
  
  // Tampon bölge mesafesi
  const [bufferDistance, setBufferDistance] = useState<number>(1);

  // Hata durumunu izleme
  const [error, setError] = useState<string | null>(null);
  
  // Seçilen geometri bilgisini saklama
  const [selectedGeometryInfo, setSelectedGeometryInfo] = useState<any | null>(null);

  // Yan paneli açıp kapamayı takip ediyoruz
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Harita üzerindeki çizim verilerini yönetiyoruz - useCallback ile optimize edildi
  const handleDrawCreated = useCallback((e: any) => {
    try {
      // Circle tipindeki çizimleri filtrele ve işleme
      if (e.layerType === 'circle') {
        console.log('Circle çizimi engellendi');
        return; // Circle çizimlerini işleme
      }

      const { layerType, layer } = e;
      const geoJSON = layer.toGeoJSON();
      setDrawnItems(prevItems => [...prevItems, { type: layerType, data: geoJSON }]);
    } catch (err: any) {
      console.error("Draw creation error:", err);
      setError(`Çizim oluşturma hatası: ${err.message || 'Bilinmeyen hata'}`);
    }
  }, []);
  
  // Çizim temizleme - useCallback ile optimize edildi
  const clearDrawings = useCallback(() => {
    try {
      console.log('Clearing all drawings manually');
      // Çizimleri temizle ve state'i sıfırla
      setDrawnItems([]);
      setCalculationResult(null);
      setError(null);
      // Seçilen geometri bilgilerini sıfırla
      setSelectedGeometryInfo(null);
    } catch (err: any) {
      console.error("Clear drawings error:", err);
      setError(`Çizimleri temizleme hatası: ${err.message || 'Bilinmeyen hata'}`);
    }
  }, []);
  
  // Alan hesaplama fonksiyonu - useCallback ile optimize edildi
  const calculateArea = useCallback(() => {
    try {
      if (drawnItems.length === 0) {
        setCalculationResult("Lütfen bir alan çizin");
        return;
      }
      
      // Sadece polygon tipinde çizilmiş öğeleri filtrele
      const polygons = drawnItems.filter(item => 
        item.type === 'polygon' || 
        (item.data.geometry && item.data.geometry.type === 'Polygon')
      );
      
      if (polygons.length === 0) {
        setCalculationResult("Alan hesaplaması için bir çokgen çizmelisiniz");
        return;
      }
      
      // Her çokgen için alan hesapla
      const areas = polygons.map((item, index) => {
        const area = turf.area(item.data);
        return {
          id: index + 1,
          area: area < 10000 ? `${area.toFixed(2)} m²` : `${(area / 1000000).toFixed(4)} km²`
        };
      });
      
      const resultText = areas.map(a => `Alan ${a.id}: ${a.area}`).join('\n');
      setCalculationResult(resultText);
    } catch (err: any) {
      console.error("Area calculation error:", err);
      setError(`Alan hesaplama hatası: ${err.message || 'Bilinmeyen hata'}`);
      setCalculationResult("Hesaplama sırasında bir hata oluştu");
    }
  }, [drawnItems]);

  // Diğer hesaplama fonksiyonları benzer şekilde try-catch bloklarıyla sarmalanmalı
  // Kısaltma için burada sadece birkaçını gösteriyorum
  
  // Mesafe hesaplama fonksiyonu - useCallback ile optimize edildi
  const calculateDistance = useCallback(() => {
    try {
      if (drawnItems.length === 0) {
        setCalculationResult("Lütfen bir çizgi çizin");
        return;
      }
      
      // Sadece çizgi tipinde çizilmiş öğeleri filtrele
      const lines = drawnItems.filter(item => 
        item.type === 'polyline' || 
        (item.data.geometry && item.data.geometry.type === 'LineString')
      );
      
      if (lines.length === 0) {
        setCalculationResult("Mesafe hesaplaması için bir çizgi çizmelisiniz");
        return;
      }
      
      // Her çizgi için mesafe hesapla
      const distances = lines.map((item, index) => {
        const length = turf.length(item.data, { units: 'kilometers' });
        return {
          id: index + 1,
          distance: length < 1 ? `${(length * 1000).toFixed(2)} m` : `${length.toFixed(3)} km`
        };
      });
      
      const resultText = distances.map(d => `Mesafe ${d.id}: ${d.distance}`).join('\n');
      setCalculationResult(resultText);
    } catch (err: any) {
      console.error("Distance calculation error:", err);
      setError(`Mesafe hesaplama hatası: ${err.message || 'Bilinmeyen hata'}`);
      setCalculationResult("Hesaplama sırasında bir hata oluştu");
    }
  }, [drawnItems]);
  
  // Tampon bölge oluşturma fonksiyonu - useCallback ile optimize edildi
  const createBuffer = useCallback(() => {
    try {
      if (drawnItems.length === 0) {
        setCalculationResult("Lütfen bir geometri çizin");
        return;
      }
      
      const lastItem = drawnItems[drawnItems.length - 1];
      const buffered = turf.buffer(lastItem.data, bufferDistance, { units: 'kilometers' });
      
      setDrawnItems(prevItems => [...prevItems, { type: 'buffer', data: buffered }]);
      setCalculationResult(`${bufferDistance} km tampon bölge oluşturuldu`);
    } catch (err: any) {
      console.error("Buffer creation error:", err);
      setError(`Tampon bölge oluşturma hatası: ${err.message || 'Bilinmeyen hata'}`);
      setCalculationResult("Tampon bölge oluşturulurken bir hata oluştu");
    }
  }, [drawnItems, bufferDistance]);
  
  // Kesişim analizi fonksiyonu - useCallback ile optimize edildi
  const calculateIntersection = useCallback(() => {
    try {
      if (drawnItems.length < 2) {
        setCalculationResult("Kesişim için en az iki geometri çizmelisiniz");
        return;
      }
      
      const geometry1 = drawnItems[drawnItems.length - 2].data;
      const geometry2 = drawnItems[drawnItems.length - 1].data;
      
      // Geometri tipi kontrolü ekleyerek hata mesajını iyileştiriyoruz
      const isPolygon1 = geometry1.geometry && 
        (geometry1.geometry.type === 'Polygon' || geometry1.geometry.type === 'MultiPolygon');
      const isPolygon2 = geometry2.geometry && 
        (geometry2.geometry.type === 'Polygon' || geometry2.geometry.type === 'MultiPolygon');
      
      if (!isPolygon1 || !isPolygon2) {
        setCalculationResult("Kesişim analizi için iki çokgen (polygon) geometri gereklidir.");
        return;
      }
      
      const intersection = turf.intersect(geometry1, geometry2);
      
      if (!intersection) {
        setCalculationResult("Geometriler kesişmiyor");
        return;
      }
      
      setDrawnItems(prevItems => [...prevItems, { type: 'intersection', data: intersection }]);
      
      // Kesişim alanını hesapla
      const intersectionArea = turf.area(intersection);
      const formattedArea = intersectionArea < 10000 
        ? `${intersectionArea.toFixed(2)} m²` 
        : `${(intersectionArea / 1000000).toFixed(4)} km²`;
        
      setCalculationResult(`Kesişim alanı: ${formattedArea}`);
    } catch (err: any) {
      console.error("Intersection calculation error:", err);
      setError(`Kesişim hesaplama hatası: ${err.message || 'Bilinmeyen hata'}`);
      setCalculationResult("Kesişim hesaplanamadı. Geometri tiplerini kontrol edin.");
    }
  }, [drawnItems]);
  
  // Birleşim analizi fonksiyonu - useCallback ile optimize edildi
  const calculateUnion = useCallback(() => {
    try {
      if (drawnItems.length < 2) {
        setCalculationResult("Birleşim için en az iki geometri çizmelisiniz");
        return;
      }
      
      // Son iki çizilen geometriyi al
      const feature1 = drawnItems[drawnItems.length - 2].data;
      const feature2 = drawnItems[drawnItems.length - 1].data;
      
      // Geometri tipi kontrolü ekleyerek hata mesajını iyileştiriyoruz
      const isPolygon1 = feature1.geometry && 
        (feature1.geometry.type === 'Polygon' || feature1.geometry.type === 'MultiPolygon');
      const isPolygon2 = feature2.geometry && 
        (feature2.geometry.type === 'Polygon' || feature2.geometry.type === 'MultiPolygon');
      
      if (!isPolygon1 || !isPolygon2) {
        setCalculationResult("Birleşim analizi için iki çokgen (polygon) geometri gereklidir.");
        return;
      }
      
      // Birleştir - spread operatörü yerine doğrudan parametreler
      const union = turf.union(feature1, feature2);
      
      if (!union) {
        setCalculationResult("Geometriler birleştirilemedi");
        return;
      }
      
      setDrawnItems(prevItems => [...prevItems, { type: 'union', data: union }]);
      
      // Birleşim alanını hesapla
      const unionArea = turf.area(union);
      const formattedArea = unionArea < 10000 
        ? `${unionArea.toFixed(2)} m²` 
        : `${(unionArea / 1000000).toFixed(4)} km²`;
        
      setCalculationResult(`Birleşim alanı: ${formattedArea}`);
    } catch (err: any) {
      console.error("Union calculation error:", err);
      setError(`Birleşim hesaplama hatası: ${err.message || 'Bilinmeyen hata'}`);
      setCalculationResult("Birleşim hesaplanamadı. Geometri tiplerini kontrol edin.");
    }
  }, [drawnItems]);

  // Hesaplama fonksiyonu - hesaplama tipine göre doğru fonksiyonu çağırır
  const performCalculation = useCallback(() => {
    try {
      if (activeCalculation === 'area') calculateArea();
      else if (activeCalculation === 'distance') calculateDistance();
    } catch (err: any) {
      console.error("Performance calculation error:", err);
      setError(`Hesaplama hatası: ${err.message || 'Bilinmeyen hata'}`);
    }
  }, [activeCalculation, calculateArea, calculateDistance]);
  
  // Hesaplama tipini ayarlama - optimizasyon için memoize edildi
  const handleSetActiveCalculation = useCallback((type: string) => {
    try {
      setActiveCalculation(prev => prev === type ? null : type);
      // Hata durumunu temizle
      if (error) setError(null);
    } catch (err: any) {
      console.error("Set calculation type error:", err);
      setError(`Hesaplama tipi ayarlama hatası: ${err.message || 'Bilinmeyen hata'}`);
    }
  }, [error]);
  
  // Geometri bilgilerini işleyecek callback fonksiyonu
  const handleGeometryInfo = useCallback((info: any) => {
    setSelectedGeometryInfo(info);
    if (!info) {
      // Bilgi yoksa temizle
      return;
    }
    
    if (info && info.deleted) {
      // Silme işlemi gerçekleşti, bilgi ver
      setCalculationResult(`${info.count} geometri başarıyla silindi`);
      
      // Leaflet-draw'ın Delete layers butonu kullanıldığında tüm geometrileri temizle
      if (info.clearAllGeometries) {
        console.log('Clearing all geometries from state');
        // Tüm geometrileri sıfırla
        setDrawnItems([]);
        return;
      }
      
      // Eğer silinmiş geometriler bilgisi varsa, bunları drawnItems'dan kaldır
      if (info.deletedFeatures && Array.isArray(info.deletedFeatures)) {
        // Silinen geometrileri drawnItems'dan kaldır
        setDrawnItems(prevItems => {
          // Silinmiş özelliklerin ID'lerini veya özelliklerini karşılaştırarak kaldır
          return prevItems.filter(item => {
            // Her silinmiş özellik için kontrol et
            for (const deletedFeature of info.deletedFeatures) {
              if (!deletedFeature || !item.data) continue;
              
              try {
                // Geometri tipini kontrol et
                const itemType = item.data.geometry?.type;
                const deletedType = deletedFeature.geometry?.type;
                
                // Koordinatları al
                const itemCoords = JSON.stringify(item.data.geometry?.coordinates || []);
                const deletedCoords = JSON.stringify(deletedFeature.geometry?.coordinates || []);
                
                // Tip ve koordinatlar aynıysa, bu öğeyi sil
                if (itemType === deletedType && itemCoords === deletedCoords) {
                  return false;
                }
                
                // Alternativ olarak, tüm GeoJSON'u karşılaştır
                if (JSON.stringify(deletedFeature) === JSON.stringify(item.data)) {
                  return false;
                }
              } catch (e) {
                console.error("Geometri karşılaştırma hatası:", e);
              }
            }
            // Bu öğe silinmemiş, filtreden geçir
            return true;
          });
        });
      }
      
      return;
    }
    
    if (info && info.text) {
      // Seçilen geometrinin bilgisini sonuç bölümünde göster
      setCalculationResult(info.text);
    }
  }, []);
  
  // Yan paneli açıp kapatma
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Sayfa yükleme etkisi: Tam ekran harita için CSS ayarı
  useEffect(() => {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    
    return () => {
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.style.margin = '';
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-[#1B4B6C] via-[#142F47] to-[#1A1A24] text-white relative overflow-hidden">
      {/* Arka plan efektleri - scripts/page.tsx'den alındı */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 -left-20 w-[400px] h-[400px] bg-[#00E5CC]/5 rounded-full filter blur-[100px] opacity-50 animate-pulse"></div>
        <div className="absolute -top-20 right-20 w-[300px] h-[300px] bg-[#8B6FFF]/5 rounded-full filter blur-[100px] opacity-50 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 -right-20 w-[350px] h-[350px] bg-[#F59E0B]/5 rounded-full filter blur-[100px] opacity-40 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-[#10B981]/5 rounded-full filter blur-[100px] opacity-50 animate-pulse animation-delay-6000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] animate-slow-pulse"></div>
      </div>
      
      {/* Üst başlık çubuğu */}
      <header className="bg-[#0A1A2F]/80 backdrop-blur-sm z-20 shadow-lg py-3 px-4 flex items-center justify-between border-b border-[#00B4A2]/20">
        <Link
          href="/scripts"
          className="flex items-center space-x-2 text-[#00E5CC] hover:text-white hover:bg-[#00B4A2]/30 py-1 px-2 rounded-md transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Scriptlərə Qayıt</span>
        </Link>
        
        <h1 className="text-xl font-bold text-center flex-1 text-transparent bg-clip-text bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF] drop-shadow-[0_0_8px_rgba(0,180,162,0.3)]">
          Coğrafi Hesaplama Aracı
        </h1>
        
        <button 
          onClick={toggleSidebar}
          className="text-[#00E5CC] hover:text-white hover:bg-[#00B4A2]/30 p-1.5 rounded-md transition-all duration-200"
          title={sidebarOpen ? "Yan Paneli Gizle" : "Yan Paneli Göster"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d={sidebarOpen ? "M4 6h16M4 12h16m-7 6h7" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </header>
      
      {/* Ana içerik - İki sütunlu düzen */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sol taraf: Yan panel (sabit genişlik) */}
        <div 
          className={`h-full bg-[#0A1A2F]/80 backdrop-blur-sm shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto custom-scrollbar border-r border-[#00B4A2]/20 ${sidebarOpen ? 'w-80 opacity-100 p-4' : 'w-0 opacity-0 p-0 overflow-hidden'}`}
        >
          { sidebarOpen && (
            <>
              {/* Hesaplama araçları */}
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-[#142F47]/70 to-[#0A1A2F]/70 p-4 rounded-xl border border-[#00B4A2]/30 shadow-xl">
                  <h2 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF] flex items-center">
                    <CalculationIcon />
                    <span className="ml-2">Hesaplama Araçları</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      { id: 'area', label: 'Alan Hesapla', icon: <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg> },
                      { id: 'distance', label: 'Mesafe Ölç', icon: <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" /></svg> },
                    ].map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => handleSetActiveCalculation(tool.id)}
                        className={`py-2.5 px-4 rounded-lg text-left flex items-center space-x-3 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1A2F] ${activeCalculation === tool.id ? 'bg-gradient-to-r from-[#00E5CC] to-[#00B4A2] text-white shadow-md ring-2 ring-[#00E5CC]' : 'bg-[#0A1A2F]/60 text-gray-300 hover:bg-[#00B4A2]/20 hover:text-white'}`}
                      >
                        {tool.icon}
                        <span className="text-sm font-medium">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-5 pt-5 border-t border-[#00B4A2]/30">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={performCalculation}
                        disabled={!activeCalculation}
                        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A1A2F] ${activeCalculation ? 'bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#008C7D] text-white hover:shadow-[0_0_15px_rgba(0,229,204,0.5)]' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                      >
                        Hesapla
                      </button>
                      
                      <button
                        onClick={clearDrawings}
                        className="w-full py-2.5 rounded-lg text-sm font-medium bg-[#1A1A24]/70 border border-[#00B4A2]/40 text-gray-300 hover:bg-[#1F2937] hover:text-white hover:border-[#00E5CC]/60 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#00B4A2] focus:ring-offset-2 focus:ring-offset-[#0A1A2F]"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Sonuç bölümü */}
                {(calculationResult || (selectedGeometryInfo && selectedGeometryInfo.text)) && (
                  <div className="bg-gradient-to-br from-[#142F47]/70 to-[#0A1A2F]/70 p-4 rounded-xl border border-[#00B4A2]/30 shadow-xl">
                    <h2 className="text-lg font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF]">
                      {selectedGeometryInfo && selectedGeometryInfo.text ? 'Geometri Bilgisi' : 'Sonuç'}
                    </h2>
                    <div className="bg-[#071525] border border-[#00B4A2]/50 rounded-lg p-3.5 font-mono text-sm text-gray-100 whitespace-pre-wrap break-words max-h-60 overflow-y-auto custom-scrollbar text-shadow-sm">
                      {calculationResult || (selectedGeometryInfo && selectedGeometryInfo.text)}
                    </div>
                    
                    {selectedGeometryInfo && selectedGeometryInfo.type === 'multiple' && (
                      <div className="mt-3 text-gray-400 text-xs space-y-1">
                        <p className="flex items-center"><svg className="w-3 h-3 mr-1.5 text-[#00E5CC]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>Birden fazla geometri seçildi. Silmek için haritadaki çöp kutusunu kullanın.</p>
                        <p className="flex items-center"><svg className="w-3 h-3 mr-1.5 text-[#00E5CC]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>Tek geometri bilgisi için CTRL olmadan tıklayın.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Hata mesajı */}
                {error && (
                  <div className="bg-red-700/20 border border-red-500/60 rounded-xl p-4 shadow-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mr-2.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-red-300 text-md">Bir Hata Oluştu</h3>
                        <p className="mt-1 text-sm text-red-300/90">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Sağ taraf: Harita (kalan alan) */}
        <div className="flex-1 relative">
          {/* Yan panel açma düğmesi */}
          {!sidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="absolute top-4 left-4 z-40 bg-[#0A1A2F] p-2 rounded-full shadow-lg border border-[#00B4A2]/30 text-[#00E5CC] hover:bg-[#142F47] transition-colors"
              aria-label="Yan Paneli Aç"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {/* Harita */}
          <div className="h-full">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-[#142F47] text-[#00E5CC]">
                <div className="text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-[#00E5CC] border-t-transparent rounded-full mb-4 mx-auto"></div>
                  <p>Harita yükleniyor...</p>
                </div>
              </div>
            }>
              {/* @ts-ignore - Tip hatalarını görmezden gel */}
              <MapComponent 
                onDrawCreated={handleDrawCreated}
                drawnItems={drawnItems}
                activeCalculation={activeCalculation}
                onGeometryInfo={handleGeometryInfo}
              />
            </Suspense>
          </div>
          
          {/* Geometri seçme modu bilgi kutusu */}
          {selectedGeometryInfo && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#142F47]/90 text-white px-3 py-1.5 rounded-lg shadow-lg border border-[#00B4A2]/30 text-sm max-w-md text-center z-30">
              <p>
                {selectedGeometryInfo.type === 'multiple' 
                  ? `${selectedGeometryInfo.count} geometri seçildi. Silmek için çöp kutusu simgesini kullanın.`
                  : 'Geometri bilgileri yan panelde gösteriliyor.'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Kullanım kılavuzu ipucu */}
      <div className="absolute bottom-4 right-4 z-30 opacity-0 animate-fadeInUp animation-delay-2000" style={{animationDelay: '2s', animationFillMode: 'forwards'}}>
        <div className="bg-[#0A1A2F]/80 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-[#00B4A2]/40 text-xs text-gray-200 hover:shadow-[#00E5CC]/20 transition-shadow">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-[#00E5CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sol üstteki araçları kullanarak çizim yapabilirsiniz.</span>
          </div>
        </div>
      </div>
    </div>
  );
} 