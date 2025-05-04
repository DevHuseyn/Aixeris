"use client";

import { useEffect, useState } from 'react';

// Arayüz tanımlamaları
interface CulturalMapProps {
  selectedCategories: string[];
  searchTerm: string;
}

export default function CulturalMap({ selectedCategories, searchTerm }: CulturalMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Sayfa yüklendiğinde yükleniyor durumunu kapat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="cultural-map-container relative h-[50vh] w-full max-w-4xl mx-auto z-10 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-600 dark:text-gray-300">Yükleniyor...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Mədəni Məkanlar Xəritəsi
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Harita geçici olarak kaldırıldı. Yakında tekrar hizmetinizde olacak.
          </p>
          
          <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-w-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Arama kriterleri: {searchTerm ? `"${searchTerm}"` : "Belirtilmemiş"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Seçili kategoriler: {selectedCategories.length > 0 
                ? selectedCategories.join(", ") 
                : "Tüm kategoriler"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 