"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const toolCollections = [
  {
    title: "Vizual Analiz Platformaları",
    description:
      "İnteraktiv xəritələr qurmaq, böyük verilənləri təhlil etmək və anında nəticələr görmək üçün brauzer əsaslı mühitlər.",
    accent: "from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6h16M4 12h10m-6 6h12"
        />
      </svg>
    ),
    tools: [
      { name: "kepler.gl", url: "https://kepler.gl", tagline: "3D animasiyalı şəhər analitikası" },
      { name: "deck.gl playground", url: "https://deck.gl/playground", tagline: "WebGL qat dizaynı" },
      { name: "Mapbox Studio", url: "https://studio.mapbox.com", tagline: "Tematik xəritə dizaynı" },
    ],
  },
  {
    title: "Geometriya və Transformasiya",
    description:
      "GeoJSON, SHP və digər formatlarla işləyən, hesablama və topologiya təmizləmə alətləri.",
    accent: "from-[#8B6FFF] via-[#5F52FF] to-[#00E5CC]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6v12m6-6H6"
        />
      </svg>
    ),
    tools: [
      { name: "geojson.io", url: "https://geojson.io", tagline: "Sürətli rəqəmsallaşdırma" },
      { name: "mapshaper", url: "https://mapshaper.org", tagline: "Topologiya & sadələşdirmə" },
      { name: "projection wizard", url: "https://projectionwizard.org", tagline: "Uyğun koordinat sistemi seçimi" },
    ],
  },
  {
    title: "Peyk və Raster Analizi",
    description:
      "Spektral analiz, NDVI və real vaxt peyk müşahidələri üçün vizual platformalar.",
    accent: "from-[#F59E0B] via-[#FF5E62] to-[#8B6FFF]",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 3v3m0 12v3m9-9h-3M6 12H3m14.949 4.95l-2.121-2.121M7.172 7.172L5.05 5.05m12.021.001l-2.121 2.12M7.172 16.828l-2.121 2.122"
        />
      </svg>
    ),
    tools: [
      { name: "Sentinel Hub EO Browser", url: "https://apps.sentinel-hub.com/eo-browser", tagline: "NDVI, dəyişiklik analizi" },
      { name: "NASA Worldview", url: "https://worldview.earthdata.nasa.gov", tagline: "Real vaxt peyk layları" },
      { name: "SkyMap Live", url: "https://sky-map.org", tagline: "Atmosfer və bulud izləmə" },
    ],
  },
];

const quickResources = [
  {
    name: "Earth Nullschool",
    description: "Külək, okean cərəyanları və hava göstəricilərinin animasiyası.",
    url: "https://earth.nullschool.net",
    tags: ["Hava", "Animasiya"],
  },
  {
    name: "Windy",
    description: "Külək, dalğa və radar məlumatları üçün çox qatlardan ibarət xəritə.",
    url: "https://www.windy.com",
    tags: ["Meteo", "Radar"],
  },
  {
    name: "OpenTopography",
    description: "LiDAR, DEM və yüksək dəqiqlikli relyef datasetləri.",
    url: "https://opentopography.org",
    tags: ["LiDAR", "DEM"],
  },
  {
    name: "Datawrapper",
    description: "İnteraktiv qrafik və xəritə vizualizasiyası üçün kodsuz platforma.",
    url: "https://www.datawrapper.de",
    tags: ["Vizualizasiya", "Paylaşım"],
  },
  {
    name: "GISGeography Toolset",
    description: "Ən yaxşı geo API-lər, formatlar və təlimatların toplusu.",
    url: "https://gisgeography.com",
    tags: ["Bələdçi", "Resurs"],
  },
  {
    name: "UNOSAT Live Maps",
    description: "Fövqəladə hallarda yayımlanan situasiya xəritələri.",
    url: "https://unosat.org/products",
    tags: ["Humanitar", "Situasiya"],
  },
];

const dataKits = [
  {
    title: "Açıq Data Kolleksiyası",
    items: [
      { label: "HDX Administrative Boundaries", url: "https://data.humdata.org/dataset", note: "Qlobal inzibati sərhəd shapefile-ları" },
      { label: "Natural Earth", url: "https://www.naturalearthdata.com", note: "Kartoqrafiya üçün qlobal qatlar" },
      { label: "Global Biodiversity", url: "https://www.gbif.org", note: "Biomüxtəliflik müşahidələri" },
    ],
  },
  {
    title: "API və SDK-lar",
    items: [
      { label: "Open-Meteo", url: "https://open-meteo.com", note: "Pulsuz hava API-si" },
      { label: "HERE Routing", url: "https://developer.here.com", note: "Optimallaşdırılmış marşrutlar" },
      { label: "OpenTripMap", url: "https://opentripmap.io", note: "POI və turizm analitikası" },
    ],
  },
];

export default function AnalysisToolsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1B4B6C] via-[#142F47] to-[#1A1A24] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] bg-[#00E5CC]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-[-5%] w-[350px] h-[350px] bg-[#8B6FFF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex justify-start">
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
              <span className="font-medium text-base text-white group-hover:text-[#00E5CC] transition-colors duration-300 relative z-10">
                Ana Səhifəyə Qayıt
              </span>
            </Link>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Xəritələr → Analiz İmkanları
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <p className="text-sm font-semibold text-[#00E5CC]/80 tracking-[0.3em] uppercase">
            Əlavə Funksiyalar
          </p>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E5CC] via-[#00B4A2] to-[#8B6FFF]">
            Analiz İmkanları
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Coğrafi hesablama scriptləri üçün tez-tez istifadə etdiyimiz vizualizasiya, məlumat
            çevrilməsi və peyk monitorinqi platformalarını bir ekranda topladıq. Hər biri brauzer
            ilə işləyir və dərhal nəticə göstərir.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toolCollections.map((collection) => (
            <div
              key={collection.title}
              className="rounded-2xl border border-[#00B4A2]/20 bg-[#0A1A2F]/70 backdrop-blur-md p-6 flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${collection.accent} text-white shadow-lg`}>
                  {collection.icon}
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-400">3+ alət</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">{collection.title}</h2>
                <p className="text-sm text-gray-300 mt-2">{collection.description}</p>
              </div>
              <div className="space-y-3">
                {collection.tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-[#00B4A2]/20 p-3 hover:border-[#00E5CC]/60 hover:bg-[#00B4A2]/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-white">{tool.name}</p>
                        <p className="text-xs text-gray-400">{tool.tagline}</p>
                      </div>
                      <svg className="w-4 h-4 text-[#00E5CC]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="bg-[#0A1A2F]/80 border border-[#00B4A2]/20 rounded-3xl p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-white">Tez giriş linkləri</h3>
              <p className="text-gray-300 text-sm">
                Vizualizasiyalar, meteoroloji qatlar və data hazırlığı üçün favorit siyahı.
              </p>
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-[0.3em]">Güncəllənir</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickResources.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-[#00B4A2]/20 bg-[#08162A]/80 p-5 hover:border-[#00E5CC]/50 hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">{resource.name}</h4>
                  <svg className="w-4 h-4 text-[#00E5CC]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300 mt-2 flex-1">{resource.description}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-[#00B4A2]/10 text-[#00E5CC] border border-[#00E5CC]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dataKits.map((kit) => (
            <div key={kit.title} className="rounded-2xl border border-[#00B4A2]/20 bg-[#0A1A2F]/70 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{kit.title}</h3>
                <span className="text-xs text-gray-400 uppercase tracking-[0.3em]">Datasetlər</span>
              </div>
              <div className="space-y-3">
                {kit.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-[#00B4A2]/20 p-3 hover:border-[#00E5CC]/50 hover:bg-[#00B4A2]/10 transition-all"
                  >
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.note}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-3xl border border-[#00B4A2]/20 bg-gradient-to-r from-[#071525]/95 via-[#0B1F36]/95 to-[#071525]/95 p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
          <div className="flex items-start gap-4 w-full xl:w-auto">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1CB5E0] via-[#0099F7] to-[#6A11CB] text-white shadow-[0_10px_35px_rgba(0,153,247,0.35)] flex-shrink-0 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="2 2 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 014-4h1.26A8 8 0 0120 9a5 5 0 010 10H7a4 4 0 01-4-4z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#00C2FF]/70">Bulud Analitikası</p>
              <h2 className="text-3xl font-semibold text-white">Qlobal Bulud GIS Platformaları</h2>
              <p className="text-sm text-gray-300 mt-3 max-w-2xl">
                Planet səviyyəsində raster + vektor analizlərini paylaşılan bulud resurslarında işlədən tanınmış sistemləri toplayırıq.
                Real vaxt peyk kadrları, böyük datasetlər və paylaşım üçün kod editoru bir yerdə.
              </p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 xl:flex xl:flex-row xl:items-center xl:justify-end xl:gap-4">
            {[
              {
                name: "Google Earth Engine",
                url: "https://code.earthengine.google.com/",
                tagline: "Qlobal raster analitikası, JavaScript kod editoru və paylaşılan repositoriyalar",
              },
              {
                name: "CARTO Workspace",
                url: "https://carto.com",
                tagline: "BigQuery üzərində interaktiv vektor & raster sorğular",
              },
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-[#00B4A2]/20 bg-[#0B1F36]/70 p-4 hover:border-[#00E5CC]/60 hover:bg-[#0E2644]/80 transition-all"
              >
                <div>
                  <p className="text-base font-semibold text-white">{tool.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{tool.tagline}</p>
                </div>
                <svg className="w-5 h-5 text-[#00E5CC]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

