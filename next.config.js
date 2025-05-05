/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Netlify için statik dışa aktarma yapalım
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
    // Netlify'da çalışması için CDN kaynağını belirtelim
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
      },
    ],
  },
  trailingSlash: true,
  eslint: {
    // Derleme sırasında ESLint kontrolünü devre dışı bırak
    ignoreDuringBuilds: true
  },
  typescript: {
    // !! UYARI !!
    // Bu seçenek SADECE derleme hatalarını görmezden gelmek için kullanılır
    // Üretim kodunda hatalara neden olabilir
    ignoreBuildErrors: true
  }
};

export default nextConfig; 