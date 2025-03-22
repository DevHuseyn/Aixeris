"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

// Xəritə stillərini müəyyən edirik
const mapStyles = [
  {
    name: "Standart",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  {
    name: "Peyk",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  {
    name: "Topoqrafik",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
  }
];

interface MapProps {
  earthquakes: Array<{
    id: string;
    properties: {
      mag: number;
      place: string;
      time: number;
      title: string;
    };
    geometry: {
      coordinates: number[];
    };
  }>;
  mapType?: string; // Yeni prop əlavə edirik
}

export function AzerbaijanMap({ earthquakes, mapType = "Standart" }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [currentStyle, setCurrentStyle] = useState(mapStyles.findIndex(style => style.name === mapType));

  // Xəritəni inisializasiya edən useEffect
  useEffect(() => {
    if (!mapRef.current) {
      // Azərbaycanın mərkəzi koordinatları
      const map = L.map("map", {
        zoomControl: false, // Default zoom kontrollarını söndürürük
        minZoom: 6, // Minimum zoom səviyyəsi
        maxZoom: 18 // Maximum zoom səviyyəsi
      }).setView([40.143105, 47.576927], 7);

      // Zoom kontrollarını yeni mövqedə əlavə edirik
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      mapRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
    }

    // Xəritə təbəqəsini əlavə edirik
    if (tileLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    
    if (mapRef.current) {
      tileLayerRef.current = L.tileLayer(mapStyles[currentStyle].url, {
        attribution: mapStyles[currentStyle].attribution
      }).addTo(mapRef.current);

      // Stil dəyişdirmə kontrolu əlavə edirik
      const existingControl = document.querySelector('.leaflet-style-control');
      if (existingControl) {
        existingControl.remove();
      }

      const styleControl = new L.Control({ position: 'topright' });
      styleControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-style-control');
        div.innerHTML = `
          <button
            class="px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            style="font-family: system-ui; font-size: 14px;"
          >
            ${mapStyles[currentStyle].name}
          </button>
        `;
        div.onclick = () => {
          const newStyle = (currentStyle + 1) % mapStyles.length;
          setCurrentStyle(newStyle);
        };
        return div;
      };
      styleControl.addTo(mapRef.current);
    }

    return () => {
      if (tileLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(tileLayerRef.current);
      }
    };
  }, [currentStyle]);

  // Markerləri yeniləyən useEffect
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    // Mövcud markerləri təmizlə
    markersRef.current.clearLayers();

    // Zəlzələ markerlərini əlavə et
    earthquakes.forEach((earthquake) => {
      const [lng, lat] = earthquake.geometry.coordinates;
      const magnitude = earthquake.properties.mag;
      
      // Maqnitudaya görə marker ölçüsü və rəngi
      const getRadius = () => {
        const baseRadius = Math.pow(1.5, magnitude) * 2;
        return Math.min(baseRadius, 30);
      };

      const color = magnitude >= 5 ? "#EF4444" :
                    magnitude >= 4 ? "#F59E0B" :
                    magnitude >= 3 ? "#10B981" :
                    "#6366F1";

      const circle = L.circleMarker([lat, lng], {
        radius: getRadius(),
        fillColor: color,
        color: "white",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6,
        className: 'earthquake-marker'
      }).addTo(markersRef.current);

      // Popup məlumatı
      const popupContent = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[200px]">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ${earthquake.properties.title}
          </h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-300">Maqnituda:</span>
              <span class="font-semibold text-${color}">${magnitude}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-300">Tarix:</span>
              <span class="text-gray-900 dark:text-white">
                ${new Date(earthquake.properties.time).toLocaleString("az-AZ")}
              </span>
            </div>
            <button
              class="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              onclick="document.dispatchEvent(new CustomEvent('zoomToEarthquake', { detail: { lat: ${lat}, lng: ${lng} } }))"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM1.5 9a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M13.5 13.5l5 5-1.5 1.5-5-5 1.5-1.5z" clip-rule="evenodd" />
              </svg>
              Yaxınlaşdır
            </button>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent, {
        className: 'custom-popup'
      });

      // Hover effektləri
      circle.on('mouseover', function(this: L.CircleMarker) {
        this.setStyle({
          fillOpacity: 0.9,
          weight: 3
        });
      });

      circle.on('mouseout', function(this: L.CircleMarker) {
        this.setStyle({
          fillOpacity: 0.6,
          weight: 2
        });
      });
    });
  }, [earthquakes]);

  // CSS stilləri və event listener-lər üçün useEffect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .earthquake-marker {
        transition: all 0.3s ease;
      }

      .custom-popup .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 1rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      }

      .custom-popup .leaflet-popup-tip {
        background: rgba(255, 255, 255, 0.95);
      }

      .dark .custom-popup .leaflet-popup-content-wrapper,
      .dark .custom-popup .leaflet-popup-tip {
        background: rgba(31, 41, 55, 0.95);
      }
    `;
    document.head.appendChild(style);

    const handleZoomToEarthquake = ((event: CustomEvent) => {
      if (mapRef.current) {
        const { lat, lng } = event.detail;
        mapRef.current.setView([lat, lng], 12, {
          animate: true,
          duration: 1
        });
      }
    }) as EventListener;

    document.addEventListener('zoomToEarthquake', handleZoomToEarthquake);

    return () => {
      document.removeEventListener('zoomToEarthquake', handleZoomToEarthquake);
      style.remove();
    };
  }, []);

  // Cleanup useEffect
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (tileLayerRef.current) {
        tileLayerRef.current = null;
      }
    };
  }, []);

  return (
    <div id="map" className="w-full h-[600px] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
    </div>
  );
} 