/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
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