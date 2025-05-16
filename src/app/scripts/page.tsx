"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import React from 'react';

export default function ScriptsPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1B4B6C] via-[#142F47] to-[#1A1A24] text-white relative">
      {/* Arka plan efektleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient circles */}
        <div className="absolute top-0 -left-20 w-[400px] h-[400px] bg-[#00E5CC]/5 rounded-full filter blur-[80px] opacity-60"></div>
        <div className="absolute -top-20 right-20 w-[300px] h-[300px] bg-[#8B6FFF]/5 rounded-full filter blur-[80px] opacity-60"></div>
        <div className="absolute bottom-20 -right-20 w-[350px] h-[350px] bg-[#F59E0B]/5 rounded-full filter blur-[80px] opacity-40"></div>
        <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-[#10B981]/5 rounded-full filter blur-[80px] opacity-50"></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] animate-slow-pulse"></div>
      </div>
      
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
              {/* Scriptler Button */}
              <Link
                href="/scripts"
                className="rounded-full bg-gradient-to-r from-[#8B6FFF] to-[#00E5CC] px-6 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-[#00B4A2]/30 transition-all duration-300 hover:scale-105 flex items-center space-x-2 relative overflow-hidden group"
              >
                <span className="z-10 relative flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Scriptlər
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-start mb-10 mt-2">
          <Link
            href="/"
            className="group flex items-center space-x-3 px-7 py-3 rounded-xl bg-[#142F47]/40 backdrop-blur-md border-2 border-[#00B4A2]/20 hover:border-[#00E5CC]/40 shadow-lg hover:shadow-[0_0_25px_rgba(0,180,162,0.3)] transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00E5CC]/10 to-[#8B6FFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00B4A2]/20 group-hover:bg-[#00B4A2]/40 transition-colors duration-300">
              <svg className="w-5 h-5 text-[#00E5CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span className="font-medium text-base text-white group-hover:text-[#00E5CC] transition-colors duration-300 relative z-10">Ana Səhifəyə Qayıt</span>
          </Link>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
            Scriptlər
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF]"></div>
        </motion.div>

        {/* Scripts Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 bg-gradient-to-r from-[#0A1A2F]/80 to-[#142F47]/80 p-8 rounded-2xl border border-[#00B4A2]/20 backdrop-blur-sm shadow-xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 gap-8 relative z-10">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#00E5CC] flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                GİS Skriptləri
              </h2>
              <p className="text-gray-300 mb-6">
                Bu bölmədə faydalı GİS və xəritə skriptləri tapacaqsınız. Bu skriptləri öz layihələrinizdə istifadə edə bilərsiniz.
              </p>
              
              {/* Script cards will go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Şablon kodlar kaldırıldı */}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 