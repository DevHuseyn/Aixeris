"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import Image from 'next/image';

// Əlavə CSS stil
const datePickerStyles = {
  position: "relative" as const,
  zIndex: 9999
};

const calendarContainerStyles = `
  .react-datepicker-wrapper,
  .react-datepicker__portal,
  .react-datepicker-popper {
    z-index: 9999 !important;
  }
  .react-datepicker {
    font-family: inherit;
    border: none;
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -4px rgba(0, 0, 0, 0.06);
    border-radius: 1rem;
    font-size: 0.95rem;
  }
  .react-datepicker__header {
    background: linear-gradient(135deg, #6366F1, #4F46E5);
    border: none;
    padding-top: 1rem;
    border-radius: 1rem 1rem 0 0;
  }
  .react-datepicker__current-month {
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
  }
  .react-datepicker__day-name {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  .react-datepicker__day {
    width: 2.5rem;
    line-height: 2.5rem;
    margin: 0.2rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }
  .react-datepicker__day:hover {
    background-color: #E0E7FF;
    border-radius: 0.5rem;
  }
  .react-datepicker__day--selected {
    background: #4F46E5;
    border-radius: 0.5rem;
    font-weight: 600;
  }
  .react-datepicker__day--keyboard-selected {
    background: #818CF8;
    border-radius: 0.5rem;
  }
  .react-datepicker__navigation {
    top: 1rem;
  }
  .react-datepicker__navigation-icon::before {
    border-color: white;
  }
  .react-datepicker__year-dropdown,
  .react-datepicker__month-dropdown {
    background-color: white;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .react-datepicker__year-option:hover,
  .react-datepicker__month-option:hover {
    background-color: #E0E7FF;
  }
`;

// Xəritə komponenti dinamik olaraq yüklənir
const AzerbaijanMap = dynamic(
  () => import("@/components/ui/azerbaijan-map").then((mod) => mod.AzerbaijanMap),
  { ssr: false }
);

// Azərbaycanın sərhədləri
const AZERBAIJAN_BOUNDS = {
  minlatitude: 38.5,
  maxlatitude: 42.0,
  minlongitude: 44.7,
  maxlongitude: 51.0,
};

interface Earthquake {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    title: string;
  };
  geometry: {
    coordinates: number[];
  };
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <motion.div
      className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function ModernEarthquakesPage() {
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'analysis'>('results');
  const [mapType, setMapType] = useState<string>("Standart");

  // Zəlzələ yerini Azərbaycan dilinə tərcümə edən funksiya
  const translateLocation = (place: string) => {
    // İstiqamətləri tərcümə et
    const directions: { [key: string]: string } = {
      'N of': 'şimalında',
      'S of': 'cənubunda',
      'E of': 'şərqində',
      'W of': 'qərbində',
      'NE of': 'şimal-şərqində',
      'NW of': 'şimal-qərbində',
      'SE of': 'cənub-şərqində',
      'SW of': 'cənub-qərbində',
      'near': 'yaxınlığında',
      'Near': 'yaxınlığında'
    };

    const cities: { [key: string]: string } = {
      'Azerbaijan': 'Azərbaycan',
      'Baku': 'Bakı',
      'Ganja': 'Gəncə',
      'Qabala': 'Qəbələ',
      'Shamakhi': 'Şamaxı',
      'Lankaran': 'Lənkəran',
      'Shaki': 'Şəki',
      'Quba': 'Quba',
      'Mingachevir': 'Mingəçevir',
      'Nakhchivan': 'Naxçıvan',
      'Sumqayit': 'Sumqayıt',
      'Shirvan': 'Şirvan',
      'Khachmaz': 'Xaçmaz',
      'Yevlakh': 'Yevlax',
      'Agdam': 'Ağdam',
      'Agdash': 'Ağdaş',
      'Agsu': 'Ağsu',
      'Astara': 'Astara',
      'Beylagan': 'Beyləqan',
      'Bilasuvar': 'Biləsuvar',
      'Dashkasan': 'Daşkəsən',
      'Fizuli': 'Füzuli',
      'Gadabay': 'Gədəbəy',
      'Goranboy': 'Goranboy',
      'Goychay': 'Göyçay',
      'Goygol': 'Göygöl',
      'Imishli': 'İmişli',
      'Ismayilli': 'İsmayıllı',
      'Jabrayil': 'Cəbrayıl',
      'Jalilabad': 'Cəlilabad',
      'Kalbajar': 'Kəlbəcər',
      'Kurdamir': 'Kürdəmir',
      'Lachin': 'Laçın',
      'Lerik': 'Lerik',
      'Masally': 'Masallı',
      'Neftchala': 'Neftçala',
      'Oghuz': 'Oğuz',
      'Qazakh': 'Qazax',
      'Qobustan': 'Qobustan',
      'Qubadli': 'Qubadlı',
      'Qusar': 'Qusar',
      'Saatly': 'Saatlı',
      'Sabirabad': 'Sabirabad',
      'Salyan': 'Salyan',
      'Samukh': 'Samux',
      'Siazan': 'Siyəzən',
      'Tartar': 'Tərtər',
      'Tovuz': 'Tovuz',
      'Ujar': 'Ucar',
      'Yardimli': 'Yardımlı',
      'Zangilan': 'Zəngilan',
      'Zaqatala': 'Zaqatala',
      'Zardab': 'Zərdab'
    };

    // Şəhər adlarını tərcümə et
    let translatedPlace = place;
    Object.entries(cities).forEach(([eng, az]) => {
      translatedPlace = translatedPlace.replace(new RegExp(eng, 'g'), az);
    });

    // Məsafə və istiqaməti ayır (məsələn: "43 km SE of Qobustan, Azerbaijan")
    const match = translatedPlace.match(/(\d+)\s*km\s*(N|S|E|W|NE|NW|SE|SW)\s*of\s*([^,]+)/);
    
    if (match) {
      const [_, distance, direction, location] = match;
      return `${location}-dan ${distance} km ${directions[direction + ' of'] || ''} məsafədə`;
    }

    // "near" patternini yoxla
    const nearMatch = translatedPlace.match(/(near|Near)\s+([^,]+)/);
    if (nearMatch) {
      const [_, near, location] = nearMatch;
      return `${location} ${directions[near]} `;
    }

    // Əgər heç bir pattern uyğun gəlmirsə, tərcümə edilmiş mətni qaytar
    return translatedPlace.replace(/, Azerbaijan/g, '');
  };

  const analysisData = useMemo(() => {
    if (!earthquakes.length) return null;

    const magnitudeGroups = earthquakes.reduce((acc, eq) => {
      const mag = Math.floor(eq.properties.mag);
      acc[mag] = (acc[mag] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const magnitudeData = Object.entries(magnitudeGroups).map(([mag, count]) => ({
      magnitude: `${mag}.0-${mag}.9`,
      count
    }));

    const dailyGroups = earthquakes.reduce((acc, eq) => {
      const date = new Date(eq.properties.time).toLocaleDateString("az-AZ");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dailyData = Object.entries(dailyGroups).map(([date, count]) => ({
      date,
      count
    }));

    return {
      magnitudeData,
      dailyData
    };
  }, [earthquakes]);

  const fetchEarthquakes = async () => {
    setLoading(true);
    try {
      const url = new URL('https://earthquake.usgs.gov/fdsnws/event/1/query');
      url.searchParams.append('format', 'geojson');
      url.searchParams.append('starttime', startDate.toISOString());
      url.searchParams.append('endtime', endDate.toISOString());
      url.searchParams.append('minlatitude', AZERBAIJAN_BOUNDS.minlatitude.toString());
      url.searchParams.append('maxlatitude', AZERBAIJAN_BOUNDS.maxlatitude.toString());
      url.searchParams.append('minlongitude', AZERBAIJAN_BOUNDS.minlongitude.toString());
      url.searchParams.append('maxlongitude', AZERBAIJAN_BOUNDS.maxlongitude.toString());
      url.searchParams.append('orderby', 'time');

      console.log('API sorğusu:', url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP xətası: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data.features)) {
        console.error("Məlumat formatı düzgün deyil:", data);
        setEarthquakes([]);
        setHasSearched(true);
        return;
      }

      console.log('API cavabı:', data);

      // Bütün zəlzələləri götürək və birbaşa state-ə əlavə edək
      const allEarthquakes = data.features.map((feature: any) => ({
        id: feature.id,
        properties: {
          mag: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          url: feature.properties.url,
          title: feature.properties.title
        },
        geometry: {
          coordinates: feature.geometry.coordinates
        }
      }));

      console.log(`Tapılan ümumi zəlzələ sayı: ${allEarthquakes.length}`);
      console.log('Nümunə zəlzələ:', allEarthquakes[0]);

      setEarthquakes(allEarthquakes);
      setHasSearched(true);

    } catch (error) {
      console.error("Zəlzələ məlumatları yüklənərkən xəta baş verdi:", error);
      setEarthquakes([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1B4B6C] via-[#142F47] to-[#1A1A24] text-white">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 border-b border-[#00B4A2]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF] drop-shadow-[0_0_10px_rgba(0,180,162,0.3)]">
                Zəlzələ Xəritəsi
              </h1>
              <h2 className="text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto">
                Real-time zəlzələ monitorinqi və analiz sistemi
              </h2>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative gradient line */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00B4A2]/20 to-transparent" />
      </div>

      {/* Filtreleme Bölümü */}
      <div className="relative py-8 border-b border-[#00B4A2]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Geri dönmə düyməsi */}
          <div className="absolute left-4 top-4 z-10">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-[#0A1A2F]/50 backdrop-blur-sm text-white rounded-lg border border-[#00B4A2]/20 hover:bg-[#00B4A2]/10 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
            </a>
          </div>

          <div className="bg-[#0A1A2F]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#00B4A2]/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tarix Seçimi */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-200">Tarix Aralığı</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div style={datePickerStyles}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Başlanğıc
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => date && setStartDate(date)}
                      className="w-full px-4 py-2 rounded-lg border border-[#00B4A2]/20 bg-[#0A1A2F]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00B4A2] focus:border-transparent transition-all duration-200"
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                    />
                  </div>
                  <div style={datePickerStyles}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Son
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => date && setEndDate(date)}
                      className="w-full px-4 py-2 rounded-lg border border-[#00B4A2]/20 bg-[#0A1A2F]/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#00B4A2] focus:border-transparent transition-all duration-200"
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      minDate={startDate}
                    />
                  </div>
                </div>
              </div>

              {/* Xəritə Növü */}
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold text-gray-200">Xəritə Növü</h3>
                <div className="grid grid-cols-3 gap-2 h-[42px]">
                  <button
                    className={`px-2 rounded-lg border ${
                      mapType === "Standart"
                        ? "border-[#00E5CC] bg-[#00B4A2]/20 text-white"
                        : "border-[#00B4A2]/20 bg-[#0A1A2F]/50 text-white hover:bg-[#00B4A2]/10"
                    } transition-all duration-200 flex items-center justify-center`}
                    onClick={() => setMapType("Standart")}
                  >
                    Standart
                  </button>
                  <button
                    className={`px-2 rounded-lg border ${
                      mapType === "Peyk"
                        ? "border-[#00E5CC] bg-[#00B4A2]/20 text-white"
                        : "border-[#00B4A2]/20 bg-[#0A1A2F]/50 text-white hover:bg-[#00B4A2]/10"
                    } transition-all duration-200 flex items-center justify-center`}
                    onClick={() => setMapType("Peyk")}
                  >
                    Peyk
                  </button>
                  <button
                    className={`px-2 rounded-lg border ${
                      mapType === "Topoqrafik"
                        ? "border-[#00E5CC] bg-[#00B4A2]/20 text-white"
                        : "border-[#00B4A2]/20 bg-[#0A1A2F]/50 text-white hover:bg-[#00B4A2]/10"
                    } transition-all duration-200 flex items-center justify-center`}
                    onClick={() => setMapType("Topoqrafik")}
                  >
                    Topoqrafik
                  </button>
                </div>
              </div>

              {/* Axtarış Düyməsi */}
              <div className="flex h-[42px] mt-auto">
                <motion.button
                  onClick={fetchEarthquakes}
                  className="w-full bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF] text-white text-lg font-semibold px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Zəlzələləri Axtar
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{calendarContainerStyles}</style>
      
      {/* Əsas Məzmun */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <LoadingSpinner />
            <p className="text-gray-200 text-lg">Zəlzələ məlumatları yüklənir...</p>
          </div>
        ) : hasSearched ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              {/* Xəritə bölməsi */}
              <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="h-[600px]">
                  <AzerbaijanMap earthquakes={earthquakes} mapType={mapType} />
                </div>
              </div>
              
              {/* Nəticələr və Analiz bölməsi */}
              <div className="lg:col-span-2 bg-[#0A1A2F] rounded-2xl shadow-xl">
                <div className="flex border-b border-[#00B4A2]/20">
                  <button
                    className={`flex-1 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'results'
                        ? 'text-[#00E5CC] border-b-2 border-[#00E5CC]'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('results')}
                  >
                    Nəticələr
                  </button>
                  <button
                    className={`flex-1 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'analysis'
                        ? 'text-[#00E5CC] border-b-2 border-[#00E5CC]'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('analysis')}
                  >
                    Analiz
                  </button>
                </div>

                <div className="p-6 h-[500px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === 'results' ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        {earthquakes.map((earthquake) => (
                          <motion.div
                            key={earthquake.id}
                            className="bg-[#142F47] rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <h3 className="text-xl font-semibold text-white mb-3">
                              Maqnituda {earthquake.properties.mag} - {translateLocation(earthquake.properties.place)}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-400">Tarix</p>
                                <p className="text-lg font-semibold text-[#00E5CC]">
                                  {new Date(earthquake.properties.time).toLocaleString("az-AZ")}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const [lng, lat] = earthquake.geometry.coordinates;
                                document.dispatchEvent(
                                  new CustomEvent('zoomToEarthquake', {
                                    detail: { lat, lng }
                                  })
                                );
                              }}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#00E5CC] to-[#8B6FFF] text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM1.5 9a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M13.5 13.5l5 5-1.5 1.5-5-5 1.5-1.5z" clipRule="evenodd" />
                              </svg>
                              Yaxınlaşdır
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="analysis"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        {analysisData && (
                          <>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                              <motion.div
                                className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                whileHover={{ scale: 1.02, y: -5 }}
                              >
                                <h4 className="text-lg font-semibold mb-2">Ümumi Zəlzələ</h4>
                                <p className="text-4xl font-bold">{earthquakes.length}</p>
                              </motion.div>
                              <motion.div
                                className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                whileHover={{ scale: 1.02, y: -5 }}
                              >
                                <h4 className="text-lg font-semibold mb-2">Ən Yüksək Maqnituda</h4>
                                <p className="text-4xl font-bold">
                                  {Math.max(...earthquakes.map(eq => eq.properties.mag)).toFixed(1)}
                                </p>
                              </motion.div>
                              <motion.div
                                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                whileHover={{ scale: 1.02, y: -5 }}
                              >
                                <h4 className="text-lg font-semibold mb-2">Ən Aşağı Maqnituda</h4>
                                <p className="text-4xl font-bold">
                                  {Math.min(...earthquakes.map(eq => eq.properties.mag)).toFixed(1)}
                                </p>
                              </motion.div>
                              <motion.div
                                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                                whileHover={{ scale: 1.02, y: -5 }}
                              >
                                <div className="flex flex-col space-y-4">
                                  <div>
                                    <h4 className="text-lg font-semibold mb-2">Statistika</h4>
                                    <p className="text-purple-200 text-sm">Bütün məlumatları CSV formatında endirin</p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const csvContent = "data:text/csv;charset=utf-8," + 
                                        "ID,Maqnituda,Yer,Tarix,X,Y\n" +
                                        earthquakes.map((eq, index) => {
                                          const [lng, lat] = eq.geometry.coordinates;
                                          return `${index + 1},${eq.properties.mag},"${eq.properties.place}",${new Date(eq.properties.time).toLocaleString("az-AZ")},${lat},${lng}`;
                                        }).join("\n");
                                      const encodedUri = encodeURI(csvContent);
                                      const link = document.createElement("a");
                                      link.setAttribute("href", encodedUri);
                                      link.setAttribute("download", "zəlzələ_statistikası.csv");
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                    className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Statistikanı Endir
                                  </button>
                                </div>
                              </motion.div>
                            </div>

                            <motion.div 
                              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#00B4A2]/20"
                              whileHover={{ y: -5 }}
                            >
                              <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                                <span className="mr-2">📊</span>
                                Maqnitudaya görə paylanma
                              </h3>
                              <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={analysisData.magnitudeData}>
                                    <defs>
                                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00E5CC" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#00B4A2" stopOpacity={0.3}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis 
                                      dataKey="magnitude" 
                                      stroke="#E5E7EB"
                                      tick={{ fill: '#E5E7EB' }}
                                    />
                                    <YAxis 
                                      stroke="#E5E7EB"
                                      tick={{ fill: '#E5E7EB' }}
                                      label={{ 
                                        value: 'Zəlzələ sayı', 
                                        angle: -90, 
                                        position: 'insideLeft',
                                        fill: '#E5E7EB'
                                      }} 
                                    />
                                    <Tooltip 
                                      formatter={(value: any) => [`${value} zəlzələ`, 'Baş verən zəlzələ sayı']}
                                      labelFormatter={(label: number) => `Maqnituda: ${label}`}
                                      contentStyle={{
                                        backgroundColor: '#0A1A2F',
                                        borderRadius: '0.5rem',
                                        border: '1px solid rgba(0, 180, 162, 0.2)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                                        color: '#fff'
                                      }}
                                    />
                                    <Bar 
                                      dataKey="count" 
                                      name="Zəlzələ sayı" 
                                      fill="url(#barGradient)"
                                      radius={[4, 4, 0, 0]}
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </motion.div>

                            <motion.div 
                              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#00B4A2]/20"
                              whileHover={{ y: -5 }}
                            >
                              <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
                                <span className="mr-2">📈</span>
                                Günlük statistika
                              </h3>
                              <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={analysisData.dailyData}>
                                    <defs>
                                      <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8B6FFF" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.3}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis 
                                      dataKey="date" 
                                      stroke="#E5E7EB"
                                      tick={{ fill: '#E5E7EB' }}
                                      angle={-45}
                                      textAnchor="end"
                                      height={60}
                                    />
                                    <YAxis 
                                      stroke="#E5E7EB"
                                      tick={{ fill: '#E5E7EB' }}
                                      label={{ 
                                        value: 'Zəlzələ sayı', 
                                        angle: -90, 
                                        position: 'insideLeft',
                                        fill: '#E5E7EB'
                                      }} 
                                    />
                                    <Tooltip 
                                      formatter={(value: any) => [`${value} zəlzələ`, 'Baş verən zəlzələ sayı']}
                                      labelFormatter={(label: number) => `Tarix: ${label}`}
                                      contentStyle={{
                                        backgroundColor: '#0A1A2F',
                                        borderRadius: '0.5rem',
                                        border: '1px solid rgba(0, 180, 162, 0.2)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                                        color: '#fff'
                                      }}
                                    />
                                    <Bar 
                                      dataKey="count" 
                                      name="Zəlzələ sayı" 
                                      fill="url(#dailyGradient)"
                                      radius={[4, 4, 0, 0]}
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Zəlzələ məlumatları gözləyir
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Məlumatları görmək üçün yuxarıdakı tarixləri seçib axtarış düyməsinə basın
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 