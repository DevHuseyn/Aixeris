"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Harita tiplerini tanımlama
const mapTypes = [
  {
    id: "cultural",
    title: "Mədəniyyət məkanları",
    description: "Muzey, teatr və tarixi abidələr xəritədə göstərilir",
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
    id: "transport",
    title: "Nəqliyyat Sistemi",
    description: "İctimai nəqliyyat marşrutları və infrastruktur xəritəsi",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: "from-[#8B6FFF] to-[#6366F1]",
    path: "/spatial-analysis/transport",
    isAvailable: false
  },
  {
    id: "environment",
    title: "Ətraf Mühit",
    description: "Ətraf mühit göstəriciləri və təbiət qoruq sahələri xəritəsi",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-[#10B981] to-[#059669]",
    path: "/spatial-analysis/environment",
    isAvailable: false
  },
  {
    id: "tourism",
    title: "Turizm və Səyahət",
    description: "Turistik yerlər, otellər və istirahət mərkəzləri xəritəsi",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    color: "from-[#F59E0B] to-[#D97706]",
    path: "/spatial-analysis/tourism",
    isAvailable: false
  },
  {
    id: "business",
    title: "Biznes və İqtisadiyyat",
    description: "Sənaye zonaları, texnoparklar və biznes mərkəzləri xəritəsi",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "from-[#EF4444] to-[#DC2626]",
    path: "/spatial-analysis/business",
    isAvailable: false
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

  const handleMapClick = (mapType: any) => {
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
            className="text-2xl font-bold mb-8 text-center text-white relative inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative z-10">Hansı xəritəyə baxmaq istəyirsiniz?</span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#00E5CC]/0 via-[#00E5CC] to-[#00E5CC]/0"></span>
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-gray-300 text-sm mb-4">{mapType.description}</p>
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

        {/* Bilgilendirme Bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-[#0A1A2F]/70 backdrop-blur-md rounded-2xl p-8 mt-12 border border-[#00B4A2]/20 shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#00E5CC]/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8B6FFF]/5 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="md:w-1/4 flex justify-center">
              <div className="relative h-32 w-32 transform hover:scale-105 transition-all duration-300">
                <Image 
                  src="/aixeris-logo.svg" 
                  alt="Aixeris Logo"
                  width={128}
                  height={128}
                  className="drop-shadow-[0_0_10px_rgba(0,180,162,0.5)]"
                  unoptimized
                />
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-bold mb-4 text-[#00E5CC] relative inline-block">
                <span>OpenStreetMap API ilə Gücləndirilmiş Xəritələr</span>
                <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-[#00E5CC]/50 to-transparent"></span>
              </h3>
              <p className="text-gray-300 mb-4">
                Bütün xəritələrimiz OpenStreetMap API-dən istifadə edərək hazırlanmışdır. Bu, Azərbaycan və dünya üzrə ən dəqiq və 
                aktual məlumatları əldə etmənizi təmin edir. Seçdiyiniz xəritə növündən asılı olaraq müxtəlif təhlillər apara və 
                məlumatları filtrlə bilərsiniz.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#142F47] text-[#00E5CC] px-3 py-1 rounded-full text-xs border border-[#00E5CC]/20 shadow-sm hover:shadow-[#00E5CC]/20 hover:border-[#00E5CC]/30 transition-all duration-300 cursor-default">OpenStreetMap</span>
                <span className="bg-[#142F47] text-[#00E5CC] px-3 py-1 rounded-full text-xs border border-[#00E5CC]/20 shadow-sm hover:shadow-[#00E5CC]/20 hover:border-[#00E5CC]/30 transition-all duration-300 cursor-default">Leaflet</span>
                <span className="bg-[#142F47] text-[#00E5CC] px-3 py-1 rounded-full text-xs border border-[#00E5CC]/20 shadow-sm hover:shadow-[#00E5CC]/20 hover:border-[#00E5CC]/30 transition-all duration-300 cursor-default">GeoJSON</span>
                <span className="bg-[#142F47] text-[#00E5CC] px-3 py-1 rounded-full text-xs border border-[#00E5CC]/20 shadow-sm hover:shadow-[#00E5CC]/20 hover:border-[#00E5CC]/30 transition-all duration-300 cursor-default">Məkansal Analiz</span>
              </div>
            </div>
          </div>
        </motion.div>
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