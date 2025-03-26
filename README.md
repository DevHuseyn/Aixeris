# Azerbaycan GIS Projesi

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Netlify Deployment

Bu proje Netlify'da statik bir site olarak deploy edilmek üzere hazırlanmıştır. Proje için şu özellikler etkinleştirilmiştir:

- Next.js 15 App Router yapısı kullanımı
- Static Site Generation (SSG) desteği
- Tarayıcı ortamı kontrolü (isBrowser)
- SEO optimizasyonu
- Harita görüntüleme için Leaflet desteği
- OpenStreetMap API entegrasyonu

### Deploy Etmek İçin

1. Netlify'da yeni bir site oluşturun
2. GitHub veya başka bir git sağlayıcısından repo'yu bağlayın
3. Build ayarlarını şu şekilde ayarlayın:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Deploy butonuna tıklayın

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
