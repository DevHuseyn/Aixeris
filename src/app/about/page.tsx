"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import React from 'react';

export default function AboutPage() {
  const [activeCertificate, setActiveCertificate] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const certificates = [
    {
      id: 1,
      title: "ESRI ArcGIS Drone2Map",
      description: "Using Tile-Based Processing in ArcGIS Drone2Map",
      imagePath: "/certificates/esri-cert.jpg"
    }
  ];

  const openCertificate = (id: number) => {
    setActiveCertificate(id);
  };

  const closeCertificate = () => {
    setActiveCertificate(null);
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
        
        {/* GIS Elements */}
        <div className="absolute top-20 right-20 opacity-[0.03] w-64 h-64">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z" />
          </svg>
        </div>
        <div className="absolute bottom-40 left-20 opacity-[0.03] w-64 h-64">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M20.5,3l-0.16,0.03L15,5.1 9,3 3.36,4.9c-0.21,0.07 -0.36,0.25 -0.36,0.48V20.5c0,0.28 0.22,0.5 0.5,0.5l0.16,-0.03L9,18.9l6,2.1 5.64,-1.9c0.21,-0.07 0.36,-0.25 0.36,-0.48V3.5c0,-0.28 -0.22,-0.5 -0.5,-0.5zM15,19l-6,-2.11V5l6,2.11V19z" />
          </svg>
        </div>
        <div className="absolute top-80 left-40 opacity-[0.03] w-48 h-48">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M11,6H9V4h2V6z M15,4h-2v2h2V4z M9,14h2v-2H9V14z M19,14h2v-2h-2V14z M19,4h-2v2h2V4z M13,14h2v-2h-2V14z M19,10h2V8h-2V10z M19,18h2v-2h-2V18z M23,22H1v-0.01H1V2h22v20z M21,4H3v16h18V4z M11,10h2V8h-2V10z M7,10h2V8H7V10z M7,6h2V4H7V6z M7,14h2v-2H7V14z M7,18h2v-2H7V18z M11,18h2v-2h-2V18z M15,18h2v-2h-2V18z M15,10h2V8h-2V10z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-40 opacity-[0.03] w-56 h-56">
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M12,8c-2.21,0 -4,1.79 -4,4s1.79,4 4,4 4,-1.79 4,-4 -1.79,-4 -4,-4zM20.94,11c-0.46,-4.17 -3.77,-7.48 -7.94,-7.94L13,1h-2v2.06C6.83,3.52 3.52,6.83 3.06,11L1,11v2h2.06c0.46,4.17 3.77,7.48 7.94,7.94L11,23h2v-2.06c4.17,-0.46 7.48,-3.77 7.94,-7.94L23,13v-2h-2.06zM12,19c-3.87,0 -7,-3.13 -7,-7s3.13,-7 7,-7 7,3.13 7,7 -3.13,7 -7,7z"/>
          </svg>
        </div>
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
            Haqqımızda
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF]"></div>
        </motion.div>

        {/* Şəxsi Məlumat Bölməsi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16 bg-gradient-to-r from-[#0A1A2F]/80 to-[#142F47]/80 p-8 rounded-2xl border border-[#00B4A2]/20 backdrop-blur-sm shadow-xl relative overflow-hidden"
        >
          {/* GIS Sembolü Arka Planda */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 opacity-5">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z" />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">
            <div className="md:col-span-1">
              <div className="relative rounded-xl overflow-hidden border-2 border-[#00B4A2]/30 shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,180,162,0.3)]">
                <Image
                  src="/haqqimda.jpeg" 
                  alt="Hüseyn Hüseynli"
                  width={400}
                  height={500}
                  className="w-full object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-xl font-bold text-white">Hüseyn Hüseynli</h3>
                  <p className="text-[#00E5CC] flex items-center">
                    <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z" />
                    </svg>
                    GİS Mütəxəssisi və Komanda Lideri
                  </p>
                </div>
              </div>

              {/* İletişim Bilgileri - Yeni Eklendi */}
              <div className="mt-6 bg-[#0A1A2F]/70 rounded-xl p-5 border border-[#00B4A2]/20">
                <h3 className="text-lg font-semibold text-[#00E5CC] mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                  </svg>
                  Əlaqə
                </h3>
                <div className="space-y-3">
                  <a href="mailto:aixerisoffical@gmail.com" className="flex items-center text-gray-300 hover:text-[#00E5CC] transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path>
                    </svg>
                    aixerisoffical@gmail.com
                  </a>
                  <a href="https://www.linkedin.com/in/huseyn-huseynli-9a843a309/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-[#00E5CC] transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    Hüseyn Hüseynli
                  </a>
                  <a href="https://www.instagram.com/_huseynn._?igsh=dDh5cXFrdzNoanRi" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-[#00E5CC] transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    @_huseynn._
                  </a>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[#00E5CC] flex items-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  </svg>
                  Haqqımda
                </h2>
                <p className="text-gray-300 mb-4">
                  Salam! Mən Hüseyn Hüseynli, Coğrafi Məlumat Sistemləri (GİS) sahəsində ixtisaslaşmış xəritə və analiz mütəxəssisiyəm. Hal-hazırda ESRI, Yandex, Here, Apple və digər şirkətlərlə əməkdaşlıq edən 4Maps Bilgi Texnologiyaları MMC-də komanda lideri olaraq çalışıram. Karyerim boyunca GİS və məsafədən zondlama texnologiyalarından istifadə edərək biznes dünyasının coğrafi problemlərinə innovativ həllər inkişaf etdirməyi hədəfləmişəm.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#00E5CC]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path>
                  </svg>
                  Peşəkar Təcrübə
                </h3>
                <p className="text-gray-300 mb-4">
                  4Maps-da komanda lideri və GİS mühəndisi olaraq mobil xəritələmə layihələrini idarə edir, Nərimanov və Binəqədi ərazilərinin 3D şəhər modelinin yaradılmasında aktiv rol oynayır və müxtəlif məkan analizləri həyata keçirirəm. Əvvəllər Geodeziya və Kartoqrafiya MMC və İqtisad nazirliyi tabeliyində İTMİM -də təcrübəçi olaraq çalışmış, sahə ölçmələri və məlumat emalı təcrübəsi əldə etdim. GİS analizləri, 3D modelləşdirmə və fotogrammetrik işlər apararaq xəritələmə proseslərinə töhfə verir, məlumat vektorlaşdırma və kartoqrafik redaktə kimi mərhələlərdə vəzifələr yerinə yetirirəm.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#00E5CC]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path>
                  </svg>
                  Texniki Bacarıqlar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div className="bg-[#0A1A2F]/70 p-4 rounded-lg border border-[#00B4A2]/10 transform transition-all duration-300 hover:border-[#00E5CC]/30 hover:translate-y-[-4px]">
                    <p className="font-medium text-[#00E5CC] mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
                      </svg>
                      GİS Proqram Təminatı
                    </p>
                    <p className="text-gray-300">QGIS, ArcMap, ArcGIS və digər bir sıra ESRI proqramları</p>
                  </div>
                  <div className="bg-[#0A1A2F]/70 p-4 rounded-lg border border-[#00B4A2]/10 transform transition-all duration-300 hover:border-[#00E5CC]/30 hover:translate-y-[-4px]">
                    <p className="font-medium text-[#00E5CC] mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h18v8zM6 15h2v-2h2v-2H8V9H6v2H4v2h2z"></path>
                        <circle cx="14.5" cy="13.5" r="1.5"></circle>
                        <circle cx="18.5" cy="10.5" r="1.5"></circle>
                      </svg>
                      Xəritələmə Alətləri
                    </p>
                    <p className="text-gray-300">AutoCAD, MicroStation</p>
                  </div>
                  <div className="bg-[#0A1A2F]/70 p-4 rounded-lg border border-[#00B4A2]/10 transform transition-all duration-300 hover:border-[#00E5CC]/30 hover:translate-y-[-4px]">
                    <p className="font-medium text-[#00E5CC] mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,5v14h18V5H3z M7,7v2H5V7H7z M5,13v-2h2v2H5z M5,15h2v2H5V15z M19,17H9v-2h10V17z M19,13H9v-2h10V13z M19,9H9V7h10V9z"></path>
                      </svg>
                      3D Modelləşdirmə və Analiz
                    </p>
                    <p className="text-gray-300">3ds Max, FME, Drone2Map</p>
                  </div>
                  <div className="bg-[#0A1A2F]/70 p-4 rounded-lg border border-[#00B4A2]/10 transform transition-all duration-300 hover:border-[#00E5CC]/30 hover:translate-y-[-4px]">
                    <p className="font-medium text-[#00E5CC] mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path>
                      </svg>
                      Əlavə olaraq
                    </p>
                    <p className="text-gray-300">Google Earth Pro, Python (təməl səviyyədə), MS Office paketləri</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#00E5CC]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"></path>
                  </svg>
                  Təhsil
                </h3>
                <p className="text-gray-300 mb-4">
                  Bakı Dövlət Universitetindən Geodeziya və Xəritəçəkmə mühəndisliyi sahəsində bakalavr və Tətbiqi geodeziya sahəsində magistr dərəcələrini tamamladım. Akademik təhsilim, ərazi ölçmələri, məsafədən zondlama və coğrafi məlumatların analizi mövzularında möhkəm bir təməl yaratdı.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#00E5CC]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"></path>
                  </svg>
                  Maraq Sahələri və Gələcək Hədəflər
                </h3>
                <p className="text-gray-300">
                  Texnologiya və süni intellekt mövzularındakı yenilikləri coğrafi məlumat sistemləri ilə birləşdirməyə fokuslanıram. Aixeris platforması üzərindən bu sahələrdəki araşdırmaları paylaşır və layihələr inkişaf etdirirəm. Real vaxt zəlzələ izləmə və risk analizi kimi layihələrlə də maraqlanıram. Gələcəkdə Hollandiya və ya Almaniyada və ya digər GİS-in inkişaf etdiyi ölkələrdə magistratura/doktorantura təhsili alaraq elmi bilik bazamı artırmağı və sahibkar ruhum ilə beynəlxalq layihələrdə yer almağı hədəfləyirəm.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sertifikatlar və Nailiyyətlər */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-[#142F47]/80 to-[#0A1A2F]/80 p-8 rounded-2xl border border-[#00B4A2]/20 backdrop-blur-sm shadow-xl relative overflow-hidden">
            {/* GIS Araçları Arka Planda */}
            <div className="absolute -right-16 top-0 w-64 h-64 opacity-5">
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M9,3L5,6.99h3V14h2V6.99h3L9,3z M16,17.01V10h-2v7.01h-3L15,21l4-3.99H16z"/>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-[#00E5CC] flex items-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path>
              </svg>
              Sertifikatlar və Nailiyyətlər
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div 
                  key={cert.id}
                  className="bg-[#0A1A2F]/70 rounded-xl border border-[#00B4A2]/10 hover:border-[#00E5CC]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,180,162,0.15)] overflow-hidden cursor-pointer group transform hover:translate-y-[-8px]"
                  onClick={() => openCertificate(cert.id)}
                >
                  <div className="h-72 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F] to-transparent z-10"></div>
                    <Image
                      src={cert.imagePath}
                      alt={cert.title}
                      fill
                      className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                      <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                      <p className="text-sm text-gray-300">{cert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Certificate Modal */}
      {activeCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeCertificate}
              className="absolute -top-12 right-0 text-white hover:text-[#00E5CC] transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-[#0A1A2F] rounded-xl overflow-hidden border border-[#00B4A2]/20">
              <Image
                src={certificates.find(cert => cert.id === activeCertificate)?.imagePath || ''}
                alt="Certificate"
                width={1200}
                height={800}
                className="w-full h-auto"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 