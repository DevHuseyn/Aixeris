import { checkAndRefreshAllCaches } from './cache-manager';

// Veri güncellemeleri arasındaki süre (milisaniye olarak)
// 1 hafta = 7 gün * 24 saat * 60 dakika * 60 saniye * 1000 milisaniye
const REFRESH_INTERVAL = 7 * 24 * 60 * 60 * 1000;

// Veri yenileme zamanlayıcısı ID'si
let refreshTimerId: NodeJS.Timeout | null = null;

// Tarayıcı ortamında olup olmadığımızı kontrol et
const isBrowser = () => typeof window !== 'undefined';

/**
 * Kategori ve bölge için OSM verisini getiren fonksiyon tipini tanımlıyoruz
 */
type OSMFetchFunction = (region: string, categories: string[]) => Promise<any[]>;

/**
 * Düzenli veri yenileme servisini başlatır
 * @param fetchFunction - OSM verisini getiren fonksiyon
 */
export const startAutoRefreshService = (fetchFunction: OSMFetchFunction): void => {
  // Sadece tarayıcıda çalışmalı
  if (!isBrowser()) {
    return;
  }

  // Servis zaten başlatılmışsa durdur
  if (refreshTimerId) {
    clearInterval(refreshTimerId);
  }
  
  // İlk kontrol hemen yapılsın
  const performCheck = async () => {
    try {
      await checkAndRefreshAllCaches(fetchFunction);
      console.log(`Sonraki veri kontrolü ${new Date(Date.now() + REFRESH_INTERVAL).toLocaleString()} tarihinde yapılacak`);
    } catch (error) {
      console.error('Otomatik veri yenileme sırasında hata oluştu:', error);
    }
  };
  
  // Hemen bir kontrol yap
  performCheck();
  
  // Düzenli kontrolü başlat
  refreshTimerId = setInterval(performCheck, REFRESH_INTERVAL);
  
  console.log('Otomatik veri yenileme hizmeti başlatıldı');
  console.log(`Veriler her ${REFRESH_INTERVAL / (24 * 60 * 60 * 1000)} gün otomatik olarak güncellenecek`);
};

/**
 * Düzenli veri yenileme servisini durdurur
 */
export const stopAutoRefreshService = (): void => {
  // Sadece tarayıcıda çalışmalı
  if (!isBrowser()) {
    return;
  }

  if (refreshTimerId) {
    clearInterval(refreshTimerId);
    refreshTimerId = null;
    console.log('Otomatik veri yenileme hizmeti durduruldu');
  }
};

/**
 * Manuel olarak tüm verileri yeniler
 * @param fetchFunction - OSM verisini getiren fonksiyon
 */
export const manualRefreshAllData = async (fetchFunction: OSMFetchFunction): Promise<void> => {
  // Sadece tarayıcıda çalışmalı
  if (!isBrowser()) {
    return Promise.resolve();
  }

  try {
    console.log('Manuel veri yenileme başlatıldı...');
    await checkAndRefreshAllCaches(fetchFunction);
    console.log('Manuel veri yenileme tamamlandı');
  } catch (error) {
    console.error('Manuel veri yenileme sırasında hata oluştu:', error);
    throw error;
  }
}; 