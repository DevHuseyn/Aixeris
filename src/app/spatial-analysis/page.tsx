"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Harita tipini tanımlama
interface MapType {
  id: string;
  title: string;
  description: string;
  apiInfo?: string;
  features?: string[];
  dataStats?: string;
  updateInfo?: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  isAvailable: boolean;
}

// Harita tiplerini tanımlama
const mapTypes: MapType[] = [
  {
    id: "cultural",
    title: "Mədəniyyət məkanları",
    description: "Muzey, teatr və tarixi abidələr xəritədə göstərilir",
    apiInfo: "OpenStreetMap API və Overpass Turbo sorğuları istifadə edilir",
    features: [
      "Bakı şəhəri üzrə 200+ mədəni obyekt",
      "Filtrlənə bilən kateqoriyalar",
      "İnteraktiv sorğu funksiyası",
      "Detallı məlumat görüntüləmə"
    ],
    dataStats: "Son yeniləmə: 10.000+ məkan, 25+ kateqoriya",
    updateInfo: "Hər həftə məlumatlar yenilənir",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: "from-[#00E5CC] to-[#00B4A2]",
    path: "/spatial-analysis/cultural",
    isAvailable: true
  },
  {
    id: "earthquake",
    title: "Zəlzələ Xəritəsi",
    description: "Son zəlzələ məlumatları və təsir bölgələri xəritəsi",
    apiInfo: "USGS Earthquake API və GeoJSON formatında məlumatlar",
    features: [
      "Canlı məlumat yeniləmələri",
      "Maqnituda və dərinlik filtri",
      "Azərbaycan və qonşu ölkələr üzrə fokuslanma",
      "Tarixi zəlzələ məlumatları arxivi"
    ],
    dataStats: "Son 30 gün: 500+ zəlzələ olayı qeydə alınıb",
    updateInfo: "Hər 30 dəqiqədə avtomatik yenilənmə",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="white">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M6 13h2l3-9 3 18 3-12 3 6h2"
        />
      </svg>
    ),
    color: "from-[#FF3B30] to-[#C4302B]",
    path: "/earthquakes",
    isAvailable: true
  }
];

export default function SpatialAnalysisPage() {
  const [selectedMapType, setSelectedMapType] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const router = useRouter();
  
  // İstemci tarafında çalıştığında parçacıkları göster
  useEffect(() => {
    setShowParticles(true);
  }, []);

  // Sabit parçacık pozisyonları
  const particlePositions = [
    { top: '10%', left: '20%', delay: '1s', duration: '15s' },
    { top: '80%', left: '15%', delay: '2s', duration: '17s' },
    { top: '30%', left: '75%', delay: '0.5s', duration: '12s' },
    { top: '60%', left: '85%', delay: '3s', duration: '14s' },
    { top: '40%', left: '50%', delay: '2.5s', duration: '16s' },
    { top: '70%', left: '30%', delay: '1.5s', duration: '13s' },
    { top: '20%', left: '60%', delay: '3.5s', duration: '18s' },
    { top: '85%', left: '45%', delay: '0.8s', duration: '11s' },
    { top: '15%', left: '90%', delay: '2.2s', duration: '19s' },
    { top: '50%', left: '10%', delay: '1.2s', duration: '14s' },
    { top: '75%', left: '70%', delay: '2.8s', duration: '13s' },
    { top: '35%', left: '25%', delay: '3.2s', duration: '15s' },
    { top: '65%', left: '55%', delay: '1.8s', duration: '16s' },
    { top: '25%', left: '40%', delay: '2.3s', duration: '12s' },
    { top: '55%', left: '80%', delay: '1.3s', duration: '18s' },
    { top: '90%', left: '35%', delay: '3.8s', duration: '17s' },
    { top: '45%', left: '65%', delay: '0.7s', duration: '14s' },
    { top: '5%', left: '45%', delay: '1.7s', duration: '13s' },
    { top: '95%', left: '25%', delay: '2.7s', duration: '15s' },
    { top: '30%', left: '5%', delay: '1.9s', duration: '16s' }
  ];

  const handleMapClick = (mapType: MapType) => {
    if (!mapType.isAvailable) {
      setPopupMessage("Çox yakında!");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } else {
      setSelectedMapType(mapType.id);
      // Kullanıcıyı ilgili harita sayfasına yönlendir
      router.push(mapType.path);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1B4B6C] via-[#142F47] to-[#1A1A24] text-white relative overflow-hidden">
      {/* Arka plan efektleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient circles */}
        <div className="absolute top-0 -left-20 w-[400px] h-[400px] bg-[#00E5CC]/5 rounded-full filter blur-[80px] opacity-60"></div>
        <div className="absolute -top-20 right-20 w-[300px] h-[300px] bg-[#8B6FFF]/5 rounded-full filter blur-[80px] opacity-60"></div>
        <div className="absolute bottom-20 -right-20 w-[350px] h-[350px] bg-[#F59E0B]/5 rounded-full filter blur-[80px] opacity-40"></div>
        <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-[#10B981]/5 rounded-full filter blur-[80px] opacity-50"></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] animate-slow-pulse"></div>
        
        {/* Particles - Only on client render */}
        {showParticles && (
          <div className="absolute inset-0">
            {particlePositions.map((pos, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-[#00E5CC]/50 rounded-full animate-float"
                style={{
                  top: pos.top,
                  left: pos.left,
                  animationDelay: pos.delay,
                  animationDuration: pos.duration,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 border-b border-[#00B4A2]/10 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#00E5CC]/10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-20 -left-12 w-52 h-52 bg-[#8B6FFF]/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                Məkan Analizi
              </h1>
              <h2 className="text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto">
                <span className="relative">
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00B4A2]/40 to-transparent"></span>
                  Coğrafi məlumat sistemləri və məkansal analiz platforması
                </span>
              </h2>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative gradient line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00B4A2]/20 to-transparent" />
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{popupMessage}</span>
          </div>
        </div>
      )}

      {/* Ana içerik */}
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Geri dönüş düğmesi */}
        <div className="mb-8">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center px-4 py-2 bg-[#0A1A2F]/50 backdrop-blur-sm text-white rounded-lg border border-[#00B4A2]/20 hover:bg-[#00B4A2]/10 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#00E5CC]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Ana Səhifə
          </Link>
        </div>

        {/* Harita Seçim Bölümü */}
        <div className="py-10">
          <motion.h3 
            className="text-2xl font-bold mb-2 text-center text-white relative inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative z-10">Hansı xəritəyə baxmaq istəyirsiniz?</span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#00E5CC]/0 via-[#00E5CC] to-[#00E5CC]/0"></span>
          </motion.h3>
          <div className="mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mapTypes.map((mapType, index) => (
              <motion.div
                key={mapType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group bg-[#0A1A2F]/70 backdrop-blur-md rounded-xl p-6 border border-[#00B4A2]/20 hover:shadow-xl hover:shadow-${mapType.color.split(' ')[1].replace('to-[', '').replace(']', '')}/10 hover:border-${mapType.color.split(' ')[1].replace('to-[', '').replace(']', '')}/30 transition-all duration-300 cursor-pointer ${selectedMapType === mapType.id ? 'ring-2 ring-[#00E5CC]' : ''}`}
                onClick={() => handleMapClick(mapType)}
              >
                <div className={`relative bg-gradient-to-br ${mapType.color} p-4 rounded-xl inline-flex items-center justify-center mb-4 text-white shadow-lg shadow-${mapType.color.split(' ')[1].replace('to-[', '').replace(']', '')}/20 group-hover:shadow-${mapType.color.split(' ')[1].replace('to-[', '').replace(']', '')}/30 transform group-hover:scale-105 transition-all duration-300`}>
                  {mapType.icon}
                  <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-white group-hover:text-[#00E5CC] transition-colors duration-300">{mapType.title}</h4>
                <p className="text-gray-300 text-sm mb-2">{mapType.description}</p>

                {/* API Info */}
                {mapType.apiInfo && (
                  <div className="bg-[#142F47] rounded-md p-2 mb-2">
                    <p className="text-gray-300 text-xs flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#00E5CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-[#00E5CC] font-medium mr-1">API:</span> {mapType.apiInfo}
                    </p>
                  </div>
                )}

                {/* Features */}
                {mapType.features && mapType.features.length > 0 && (
                  <div className="mb-2 pl-1">
                    <p className="text-[#00E5CC] text-xs font-medium mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Əsas xüsusiyyətlər:
                    </p>
                    <div className="grid grid-cols-2 gap-x-1 gap-y-1">
                      {mapType.features.map((feature, idx) => (
                        <p key={idx} className="text-gray-300 text-xs flex items-start">
                          <span className="text-[#00E5CC] mr-1 mt-0.5">•</span>{" "}
                          {feature}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data Stats & Update Info */}
                <div className="flex space-x-1 text-xs mb-2">
                  {mapType.dataStats && (
                    <div className="bg-[#142F47]/70 rounded-md py-1 px-2 flex-1">
                      <p className="text-gray-300 flex items-center text-xs">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#00E5CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {mapType.dataStats}
                      </p>
                    </div>
                  )}
                </div>
                
                {mapType.updateInfo && (
                  <div className="bg-[#142F47]/50 rounded-md py-1 px-2 mb-2">
                    <p className="text-gray-300 flex items-center text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-[#00E5CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {mapType.updateInfo}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  {mapType.isAvailable ? (
                    <Link 
                      href={mapType.path}
                      className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${mapType.color} text-white rounded-md text-sm font-medium shadow-md shadow-${mapType.color.split(' ')[1].replace('to-[', '').replace(']', '')}/20 group-hover:shadow-lg group-hover:shadow-${mapType.color.split(' ')[1].replace('to-[', '').replace(']', '')}/30 transform group-hover:translate-x-1 transition-all duration-300`}
                    >
                      Xəritəyə baxın
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMapClick(mapType);
                      }}
                      className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${mapType.color} text-white rounded-md text-sm font-medium shadow-md shadow-${mapType.color.split(' ')[1].replace('to-[', '').replace(']', '')}/20 group-hover:shadow-lg group-hover:shadow-${mapType.color.split(' ')[1].replace('to-[', '').replace(']', '')}/30 transform group-hover:translate-x-1 transition-all duration-300`}
                    >
                      Xəritəyə baxın
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                  {!mapType.isAvailable && (
                    <span className="text-yellow-400 text-sm">Çox yakında</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes slow-pulse {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.05; }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        .animate-slow-pulse {
          animation: slow-pulse 8s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
} 