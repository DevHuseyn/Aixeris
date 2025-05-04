"use client";

import { useRef, useMemo } from "react";
import DottedMap from "dotted-map";
import Image from "next/image";
import { useTheme } from "next-themes";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();

  // Memoize map creation and SVG generation
  const svgMap = useMemo(() => {
    const map = new DottedMap({ 
      height: 80, // Further reduced height
      grid: "diagonal"
    });
    return map.getSVG({
      radius: 0.25,
      color: theme === "dark" ? "#FFFFFF40" : "#00000040",
      shape: "circle",
      backgroundColor: "transparent",
    });
  }, [theme]);

  // Memoize point projection function
  const projectPoint = useMemo(() => {
    return (lat: number, lng: number) => {
      const x = (lng + 180) * (800 / 360);
      const y = (90 - lat) * (400 / 180);
      return { x, y };
    };
  }, []);

  // Memoize path creation function
  const createCurvedPath = useMemo(() => {
    return (start: { x: number; y: number }, end: { x: number; y: number }) => {
      const midX = (start.x + end.x) / 2;
      const midY = Math.min(start.y, end.y) - 30; // Reduced curve height
      return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    };
  }, []);

  // Memoize dots calculations
  const pathsAndPoints = useMemo(() => {
    return dots.map((dot) => {
      const startPoint = projectPoint(dot.start.lat, dot.start.lng);
      const endPoint = projectPoint(dot.end.lat, dot.end.lng);
      const path = createCurvedPath(startPoint, endPoint);
      return { startPoint, endPoint, path };
    });
  }, [dots, projectPoint, createCurvedPath]);

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans">
      <div className="w-full h-full">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
          alt="world map"
          width={800}
          height={400}
          priority
          draggable={false}
          loading="eager"
          quality={75}
        />
        <svg
          ref={svgRef}
          viewBox="0 0 800 400"
          className="w-full h-full absolute inset-0 pointer-events-none select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {pathsAndPoints.map(({ path, startPoint, endPoint }, i) => (
            <g key={`path-group-${i}`} className="opacity-75">
              <path
                d={path}
                fill="none"
                stroke={lineColor}
                strokeWidth="1"
              />
              <circle
                cx={startPoint.x}
                cy={startPoint.y}
                r="1.5"
                fill={lineColor}
              />
              <circle
                cx={endPoint.x}
                cy={endPoint.y}
                r="1.5"
                fill={lineColor}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
} 