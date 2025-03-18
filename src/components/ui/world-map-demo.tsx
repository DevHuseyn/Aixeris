"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import { useState } from 'react';

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
    description: "AI əsaslı real-time zəlzələ monitorinqi və risk təhlili sistemləri.",
    icon: "📊"
  }
];

export function WorldMapDemo() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                />
              </div>
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                AIXERIS
              </div>
            </div>
            
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="rounded-full bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF] px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-[#00B4A2]/30 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <span>Xəritələr</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Content */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0A1A2F] border border-[#00B4A2]/20 shadow-lg py-1 z-50">
                  <a
                    href="/earthquakes"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#00B4A2]/10 transition-colors duration-200"
                  >
                    Zəlzələ Xəritəsi
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
        <div className="relative min-h-[80vh] flex items-center">
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
                      href="/about"
                      className="rounded-full bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-[#00B4A2]/30 transition-all duration-300 hover:scale-105"
                    >
                      Haqqımızda
                    </a>
                    <a
                      href="/contact"
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="py-24 bg-gradient-to-b from-[#142F47]/50 via-[#1A1A24] to-[#142F47]/50">
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
                    {/* Placeholder for your photo */}
                    <div className="aspect-square w-full relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
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
                <div className="pt-4">
                  <a
                    href="/about"
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-[#00B4A2]/30 transition-all duration-300 hover:scale-105"
                  >
                    Daha Ətraflı
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
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
                href="https://instagram.com/your-username"
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
                href="https://youtube.com/your-channel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814c.23-.861.907-1.538 1.768-1.768C5.746 5 12 5 12 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                  />
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
    </div>
  );
} 