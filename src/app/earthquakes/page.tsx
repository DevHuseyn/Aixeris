"use client";

import dynamic from "next/dynamic";

const ModernEarthquakesPage = dynamic(
  () => import("./modern-page"),
  { ssr: false }
);

export default function EarthquakesPage() {
  return <ModernEarthquakesPage />;
} 