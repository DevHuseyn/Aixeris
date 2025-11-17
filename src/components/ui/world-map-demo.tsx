"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Link from 'next/link';

const features = [
  {
    title: "Zəlzələ Analizi",
    description: "USGS API ilə ən son zəlzələ məlumatlarına və analitikasına daxil olun, real vaxt məlumatlarını izləyin.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Mədəniyyət Məkanları",
    description: "OpenStreetMap API ilə Azərbaycandakı mədəniyyət məkanlarını, tarixi abidələri və muzeyləri kəşf edin.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: "Məkan Analizi",
    description: "Coğrafi məlumat sistemlərini üzərindən təhlillər apararaq məkansal naxışları və əlaqələri aşkarlayın.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  {
    title: "Təbii Fəlakət İzləmə",
    description: "Zəlzələ, daşqın və digər təbii fəlakətləri izləyin, keçmiş hadisələri analiz edin və risklərə görə məlumat əldə edin.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export function WorldMapDemo() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(!showContactModal);
  };

  const toggleComingSoonModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowComingSoonModal(!showComingSoonModal);
  };

  // Açılır pəncərəni xaricində klik ediləndə bağlamaq üçün
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1B4B6C] via-[#142F47] to-[#1A1A24] text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="fixed w-full z-50 bg-gradient-to-b from-[#0A1A2F]/90 to-transparent backdrop-blur-sm border-b border-[#00B4A2]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <Image
                  src="/aixeris-logo.svg"
                  alt="Aixeris Logo"
                  width={32}
                  height={32}
                  className="w-full h-full drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]"
                  unoptimized
                />
              </div>
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                AIXERIS
              </div>
            </div>

            {/* Buttons Container */}
            <div className="flex items-center space-x-4">
              {/* Alətlər Button */}
              <Link
                href="/scripts"
                className="rounded-full bg-gradient-to-r from-[#8B6FFF] to-[#00E5CC] px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-[#00B4A2]/30 transition-all duration-300 hover:scale-105 flex items-center space-x-2 relative overflow-hidden group"
              >
                <span className="z-10 relative flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Alətlər
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </Link>

              {/* Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="rounded-full bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF] px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-[#00B4A2]/30 transition-all duration-300 hover:scale-105 flex items-center space-x-2 relative overflow-hidden group"
                >
                  <span className="z-10 relative">Xəritələr</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 z-10 relative ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </button>

                {/* Dropdown Content */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0A1A2F] border border-[#00B4A2]/20 shadow-lg py-2 z-50">
                    <a
                      href="/spatial-analysis"
                      className="block px-4 py-3 text-sm text-gray-200 hover:bg-[#00B4A2]/10 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span className="text-[#00E5CC] bg-[#00B4A2]/10 p-1.5 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <div>
                        <div className="font-medium text-white">Məkan Analizi</div>
                        <div className="text-xs text-gray-400">Müxtəlif xəritələr mövcuddur</div>
                      </div>
                    </a>
                    <a
                      href="/analysis-tools"
                      className="block px-4 py-3 text-sm text-gray-200 hover:bg-[#00B4A2]/10 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span className="text-[#8B6FFF] bg-[#8B6FFF]/10 p-1.5 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <div>
                        <div className="font-medium text-white">Analiz İmkanları</div>
                        <div className="text-xs text-gray-400">Vizual & data alətləri</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] select-none pointer-events-none">
        <h1 className="text-[25vw] font-bold text-white whitespace-nowrap transform -rotate-12 tracking-tighter">
          AIXERIS
        </h1>
      </div>

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center pt-20 pb-24">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-5xl lg:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                      Aixeris
                    </h1>
                    <h2 className="text-3xl lg:text-5xl font-bold text-gray-50 drop-shadow-[0_0_10px_rgba(0,180,162,0.2)]">
                      Texnologiya və Məkan Zəkası
                    </h2>
                  </motion.div>

                  <motion.p
                    className="mt-6 text-xl leading-8 text-gray-200 max-w-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Texnoloji yenilikləri, süni intellekt araşdırmalarını və coğrafi məlumat
                    sistemlərini bir araya gətirən platforma. Gələcəyin texnologiyalarını
                    kəşf edin, AI təhlilləri ilə tanış olun və məkansal analiz həllərini
                    araşdırın.
                  </motion.p>

                  <motion.div
                    className="mt-8 flex flex-wrap gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Link
                      href="/about"
                      className="rounded-full px-8 py-4 text-base font-semibold text-white border-2 border-[#00B4A2] hover:border-[#00E5CC] hover:bg-[#00B4A2]/10 transition-all duration-300 hover:scale-105"
                    >
                      Haqqımızda
                    </Link>
                    <a
                      href="#"
                      onClick={toggleContactModal}
                      className="rounded-full px-8 py-4 text-base font-semibold text-white border-2 border-[#00B4A2] hover:border-[#00E5CC] hover:bg-[#00B4A2]/10 transition-all duration-300 hover:scale-105"
                    >
                      Əlaqə
                    </a>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Content - Logo Illustration */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] rounded-full transform rotate-6 blur-2xl opacity-20"></div>
                  <div className="relative bg-transparent rounded-full overflow-hidden border-4 border-[#00B4A2]/20 shadow-2xl p-8">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] opacity-10 rounded-full"></div>
                      <div className="relative z-10 flex items-center justify-center w-full h-full">
                        <Image
                          src="/aixeris-logo.svg"
                          alt="Aixeris Logo"
                          width={400}
                          height={400}
                          className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500 hover:rotate-[360deg] transition-all duration-[2000ms] drop-shadow-[0_0_15px_rgba(0,180,162,0.5)]"
                          priority
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* GIS Software Section */}
        <div className="py-24 bg-gradient-to-b from-[#142F47]/50 via-[#1A1A24] to-[#142F47]/50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-10 left-[10%] w-72 h-72 bg-[#00E5CC]/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-[#8B6FFF]/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#00B4A2]/10 rounded-full filter blur-3xl"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                  GİS Proqram Təminatları
                </h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto"
              >
                Məkan analizləri və xəritələmə üçün ən yaxşı açıq mənbə proqram təminatlarını yükləyin
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "8rem" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 mx-auto mt-6 bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF]"
              ></motion.div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {/* QGIS */}
              <motion.a
                href="https://www.qgis.org/en/site/forusers/download.html"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="flex flex-col items-center group relative"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 border border-[#00B4A2]/20 flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:border-[#00E5CC]/40 group-hover:shadow-xl group-hover:shadow-[#00B4A2]/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src="/Logo-icon/Qgis-icon.svg"
                    alt="QGIS Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain relative z-10 drop-shadow-md transition-all duration-300 group-hover:drop-shadow-lg"
                    unoptimized
                  />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#00E5CC] transition-colors">QGIS</h3>
                <p className="text-sm text-gray-400 text-center mt-1">Peşəkar GİS proqramı</p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#00E5CC] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </motion.a>

              {/* PostgreSQL */}
              <motion.a
                href="https://www.postgresql.org/download/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="flex flex-col items-center group relative"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 border border-[#00B4A2]/20 flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:border-[#00E5CC]/40 group-hover:shadow-xl group-hover:shadow-[#00B4A2]/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src="/Logo-icon/Postgresql-icon.svg"
                    alt="PostgreSQL Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain relative z-10 drop-shadow-md transition-all duration-300 group-hover:drop-shadow-lg"
                    unoptimized
                  />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#00E5CC] transition-colors">PostgreSQL</h3>
                <p className="text-sm text-gray-400 text-center mt-1">Güclü verilənlər bazası</p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#00E5CC] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </motion.a>

              {/* PostGIS */}
              <motion.a
                href="https://postgis.net/install/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="flex flex-col items-center group relative"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 border border-[#00B4A2]/20 flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:border-[#00E5CC]/40 group-hover:shadow-xl group-hover:shadow-[#00B4A2]/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src="/Logo-icon/Postgis-icon.png"
                    alt="PostGIS Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain relative z-10 drop-shadow-md transition-all duration-300 group-hover:drop-shadow-lg"
                    unoptimized
                  />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#00E5CC] transition-colors">PostGIS</h3>
                <p className="text-sm text-gray-400 text-center mt-1">Məkan verilənləri genişlənməsi</p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#00E5CC] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </motion.a>

              {/* GeoServer */}
              <motion.a
                href="http://geoserver.org/download/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="flex flex-col items-center group relative"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 border border-[#00B4A2]/20 flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:border-[#00E5CC]/40 group-hover:shadow-xl group-hover:shadow-[#00B4A2]/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src="/Logo-icon/Geoserver-icon.png"
                    alt="GeoServer Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain relative z-10 drop-shadow-md transition-all duration-300 group-hover:drop-shadow-lg"
                    unoptimized
                  />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#00E5CC] transition-colors">GeoServer</h3>
                <p className="text-sm text-gray-400 text-center mt-1">Məkan məlumatları serveri</p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#00E5CC] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </motion.a>

              {/* QField */}
              <motion.a
                href="https://qfield.org/get/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="flex flex-col items-center group relative"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 border border-[#00B4A2]/20 flex items-center justify-center mb-4 transform transition-all duration-300 group-hover:border-[#00E5CC]/40 group-hover:shadow-xl group-hover:shadow-[#00B4A2]/20 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src="/Logo-icon/Qfield-icon.png"
                    alt="QField Logo"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain relative z-10 drop-shadow-md transition-all duration-300 group-hover:drop-shadow-lg"
                    unoptimized
                  />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#00E5CC] transition-colors">QField</h3>
                <p className="text-sm text-gray-400 text-center mt-1">Mobil GİS həlli</p>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#00E5CC] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gradient-to-b from-[#142F47]/50 via-[#1A1A24] to-[#142F47]/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-[#0A1A2F]/50 rounded-xl p-6 border border-[#00B4A2]/20 hover:border-[#00B4A2]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#00B4A2]/10 group"
                >
                  <div className="text-[#00E5CC] bg-[#00B4A2]/10 p-3 rounded-lg inline-block group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="relative py-12 bg-gradient-to-t from-[#0A1A2F] to-transparent">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]"
            >
              AIXERIS
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-6"
            >
              <a
                href="https://www.linkedin.com/in/huseyn-huseynli-9a843a309/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/_huseynn._?igsh=dDh5cXFrdzNoanRi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-400 text-sm"
            >
              © {new Date().getFullYear()} Aixeris. Bütün hüquqlar qorunur.
            </motion.div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </footer>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={toggleContactModal}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0A1A2F] rounded-2xl border border-[#00B4A2]/20 p-8 shadow-2xl w-[90%] max-w-md mx-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF]">
                    Bizimlə Əlaqə
                  </h3>
                  <button
                    onClick={toggleContactModal}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <a
                    href="mailto:aixerisoffical@gmail.com"
                    className="flex items-center p-4 rounded-xl bg-[#142F47] hover:bg-[#1A3A58] transition-colors duration-200"
                  >
                    <span className="bg-[#00B4A2]/20 text-[#00E5CC] p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium text-white">E-poçt</div>
                      <div className="text-sm text-gray-300">aixerisoffical@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/huseyn-huseynli-9a843a309/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 rounded-xl bg-[#142F47] hover:bg-[#1A3A58] transition-colors duration-200"
                  >
                    <span className="bg-[#00B4A2]/20 text-[#00E5CC] p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium text-white">LinkedIn</div>
                      <div className="text-sm text-gray-300">Hüseyn Hüseynli</div>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/_huseynn._?igsh=dDh5cXFrdzNoanRi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 rounded-xl bg-[#142F47] hover:bg-[#1A3A58] transition-colors duration-200"
                  >
                    <span className="bg-[#00B4A2]/20 text-[#00E5CC] p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium text-white">Instagram</div>
                      <div className="text-sm text-gray-300">@_huseynn._</div>
                    </div>
                  </a>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoonModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={toggleComingSoonModal}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#0A1A2F] rounded-2xl border border-[#00B4A2]/20 p-8 shadow-2xl w-[90%] max-w-md mx-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF]">
                    Tezliklə
                  </h3>
                  <button
                    onClick={toggleComingSoonModal}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center py-8">
                  <div className="text-[#00E5CC] mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-lg mb-2">
                    Bu funksionallıq hələ hazırlanır
                  </p>
                  <p className="text-gray-400">
                    Biz daim xüsusiyyətləri təkmilləşdiririk və tezliklə sizə daha çox imkanlar təqdim edəcəyik
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 