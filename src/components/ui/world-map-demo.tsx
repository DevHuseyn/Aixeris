"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import React from 'react';

const features = [
  {
    title: "Texnoloji Yeniliklər",
    description: "Ən son texnoloji yenilikləri və trendləri kəşf edin, gələcəyin texnologiyalarını araşdırın.",
    icon: "💡"
  },
  {
    title: "Süni İntellekt",
    description: "Machine Learning, Deep Learning və AI tətbiqləri haqqında məqalələr və təhlillər.",
    icon: "🤖"
  },
  {
    title: "GIS & Məkan Analizi",
    description: "Coğrafi məlumat sistemləri, məkansal analiz və xəritələşdirmə həlləri.",
    icon: "🌍"
  },
  {
    title: "Zəlzələ İzləmə",
    description: "Real-time zəlzələ monitorinqi və hər yarım saatda avtomatik yenilənən məlumatlarla risk təhlili.",
    icon: "📊",
    link: "/earthquakes",
    linkText: "Xəritəyə baxın"
  }
];

export function WorldMapDemo() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Haqqımızda bölməsinə kaydırma funksiyası
  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Əlaqə modalını açıb-bağlama funksiyası
  const toggleContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(!showContactModal);
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
                    href="/earthquakes"
                    className="block px-4 py-3 text-sm text-gray-200 hover:bg-[#00B4A2]/10 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="text-lg">📊</span>
                    <div>
                      <div className="font-medium text-white">Zəlzələ Xəritəsi</div>
                      <div className="text-xs text-gray-400">Hər 30 dəqiqədə yenilənir</div>
                    </div>
                  </a>
                  <div className="border-t border-[#00B4A2]/10 my-1"></div>
                  <a
                    href="#"
                    className="block px-4 py-3 text-sm text-gray-200 hover:bg-[#00B4A2]/10 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="text-lg">🌍</span>
                    <div>
                      <div className="font-medium text-white">Məkan Analizi</div>
                      <div className="text-xs text-gray-400">Tezliklə əlavə olunacaq</div>
                    </div>
                  </a>
                </div>
              )}
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
                    <a
                      href="#about-section"
                      onClick={scrollToAbout}
                      className="rounded-full px-8 py-4 text-base font-semibold text-white border-2 border-[#00B4A2] hover:border-[#00E5CC] hover:bg-[#00B4A2]/10 transition-all duration-300 hover:scale-105"
                    >
                      Haqqımızda
                    </a>
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

        {/* About Section Anchor */}
        <div id="about-section" className="relative -top-24"></div>
        
        {/* About Section Content */}
        <div className="py-32 bg-gradient-to-b from-[#142F47]/50 via-[#1A1A24] to-[#142F47]/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Photo */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] rounded-2xl transform rotate-6 blur-2xl opacity-20"></div>
                  <div className="relative bg-[#0A1A2F]/50 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#00B4A2]/20 shadow-2xl">
                    {/* Real photo instead of placeholder */}
                    <div className="aspect-square w-full relative">
                      <Image
                        src="/haqqimda.jpeg"
                        alt="Aixeris Haqqında"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right side - About content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                  Haqqımızda
                </h2>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Biz texnologiya və məkan analizi sahəsində ixtisaslaşmış bir komandayıq. 
                  Süni intellekt və coğrafi məlumat sistemlərini birləşdirərək, 
                  innovativ həllər yaradırıq.
                </p>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Məqsədimiz müasir texnologiyaları istifadə edərək, 
                  cəmiyyətə faydalı və dəyərli məhsullar təqdim etməkdir.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gradient-to-b from-[#142F47]/50 to-[#1A1A24]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,180,162,0.3)] sm:text-4xl">
                Platformamızın Təklif Etdiyi Mövzular
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-200">
                Texnologiya, süni intellekt və coğrafi məlumat sistemləri sahəsində 
                ən son yeniliklər və araşdırmalar
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                {features.map((feature) => (
                  <motion.div 
                    key={feature.title}
                    className="flex flex-col bg-[#0A1A2F]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#00B4A2]/20 hover:border-[#00E5CC] transition-all duration-300 shadow-lg"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <dt className="text-3xl mb-4">{feature.icon}</dt>
                    <dt className="text-xl font-semibold leading-7 text-white drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                      {feature.title}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-200">
                      <p className="flex-auto">{feature.description}</p>
                      {feature.link && (
                        <div className="mt-4">
                          <a
                            href={feature.link}
                            className="inline-flex items-center text-sm font-medium text-[#00E5CC] hover:text-[#8B6FFF] transition-colors duration-300"
                          >
                            {feature.linkText}
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </dd>
                  </motion.div>
                ))}
              </dl>
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
                href="https://www.instagram.com/_hsynn._?igsh=eXZkZmFmenA2dnF3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

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
                    href="mailto:huseynlihuseynn02@gmail.com" 
                    className="flex items-center p-4 rounded-xl bg-[#142F47] hover:bg-[#1A3A58] transition-colors duration-200"
                  >
                    <span className="bg-[#00B4A2]/20 text-[#00E5CC] p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium text-white">E-poçt</div>
                      <div className="text-sm text-gray-300">huseynlihuseynn02@gmail.com</div>
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
                    href="https://www.instagram.com/_hsynn._?igsh=eXZkZmFmenA2dnF3" 
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
                      <div className="text-sm text-gray-300">@_hsynn._</div>
                    </div>
                  </a>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 