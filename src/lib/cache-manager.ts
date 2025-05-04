// Cache manager - Veri önbelleği yönetimi

// PoiResult tipini tanımlıyoruz
interface PoiResult {
  id: number;
  type: string;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    [key: string]: string | undefined;
  };
}

// Cache'in tipini tanımlıyoruz
interface CacheItem {
  data: PoiResult[] | null;
  timestamp: number;
  region: string;
  categories: string[];
}

// Cache verisini saklayacağımız global nesne
const cacheStore: Record<string, CacheItem> = {};

// Cache geçerlilik süresi: 1 hafta (milisaniye cinsinden)
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

// Tarayıcı ortamında olup olmadığımızı kontrol eden yardımcı fonksiyon
const isBrowser = () => typeof window !== 'undefined';

/**
 * Önbellek anahtarı oluşturur
 * @param region - Bölge ID'si
 * @param categories - Seçilen kategoriler
 * @returns Önbellek anahtarı
 */
export const getCacheKey = (region: string, categories: string[]): string => {
  return `${region}-${categories.sort().join('-')}`;
};

/**
 * Belirtilen anahtar için önbelleğe veri ekler
 * @param key - Önbellek anahtarı
 * @param data - Saklanacak veri
 * @param region - Bölge
 * @param categories - Kategoriler
 */
export const setCacheData = (
  key: string,
  data: PoiResult[] | null,
  region: string,
  categories: string[]
): void => {
  cacheStore[key] = {
    data,
    timestamp: Date.now(),
    region,
    categories
  };
  
  // LocalStorage'a da kaydedelim (tarayıcı yeniden başlatıldığında bile kalıcı olması için)
  try {
    if (isBrowser()) {
      localStorage.setItem(
        `osm_cache_${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
          region,
          categories
        })
      );
    }
  } catch (error) {
    console.error('Cache verisi localStorage\'a kaydedilemedi:', error);
  }
};

/**
 * Belirtilen anahtar için önbellekteki veriyi getirir
 * @param key - Önbellek anahtarı
 * @returns Önbellekteki veri veya null
 */
export const getCacheData = (key: string): PoiResult[] | null => {
  try {
    // Önce memory cache'e bakalım
    const memoryCache = cacheStore[key];
    if (memoryCache) {
      // Cache süresi dolmuş mu kontrol edelim
      if (Date.now() - memoryCache.timestamp <= CACHE_TTL) {
        console.log(`Cache'den veri getirildi: ${key}`);
        return memoryCache.data;
      }
      // Süre dolduysa, cache'i temizle
      delete cacheStore[key];
    }

    // Eğer tarayıcıda değilsek burada bitir
    if (!isBrowser()) {
      return null;
    }

    // Memory cache'de yoksa localStorage'a bakalım
    const storageData = localStorage.getItem(`osm_cache_${key}`);
    if (storageData) {
      const parsed = JSON.parse(storageData) as CacheItem;
      
      // Cache süresi dolmuş mu kontrol edelim
      if (Date.now() - parsed.timestamp <= CACHE_TTL) {
        // Memory cache'e de ekleyelim
        cacheStore[key] = parsed;
        console.log(`LocalStorage cache'inden veri getirildi: ${key}`);
        return parsed.data;
      }
      
      // Süre dolduysa, localStorage'dan temizle
      localStorage.removeItem(`osm_cache_${key}`);
    }

    return null;
  } catch (error) {
    console.error('Cache verisi getirilirken hata oluştu:', error);
    return null;
  }
};

/**
 * Tüm önbelleği temizler
 */
export const clearAllCache = (): void => {
  // Memory cache'i temizle
  Object.keys(cacheStore).forEach(key => {
    delete cacheStore[key];
  });
  
  // LocalStorage'daki cache'i temizle
  try {
    if (isBrowser()) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('osm_cache_')) {
          keys.push(key);
        }
      }
      
      keys.forEach(key => {
        localStorage.removeItem(key);
      });
    }
    
    console.log('Tüm cache temizlendi');
  } catch (error) {
    console.error('Cache temizlenirken hata oluştu:', error);
  }
};

/**
 * Belirli bir bölge ve kategoriler için cache'i günceller
 * @param region - Bölge ID
 * @param categories - Kategori listesi
 * @param fetchFunction - Verileri getiren async fonksiyon
 * @returns Promise<PoiResult[]> - Güncel veriler
 */
export const refreshCacheData = async (
  region: string,
  categories: string[],
  fetchFunction: () => Promise<PoiResult[]>
): Promise<PoiResult[]> => {
  try {
    const key = getCacheKey(region, categories);
    console.log(`Cache güncelleniyor: ${key}`);
    
    // Yeni verileri getir
    const freshData = await fetchFunction();
    
    // Cache'e kaydet
    setCacheData(key, freshData, region, categories);
    
    return freshData;
  } catch (error) {
    console.error('Cache güncellenirken hata oluştu:', error);
    throw error;
  }
};

/**
 * Tüm cache'leri kontrol eden ve gerekirse yenileyen fonksiyon
 * Bu fonksiyon periyodik olarak çağrılabilir
 * @param fetchFunction - Belirli bir bölge/kategori için veri getiren fonksiyon
 */
export const checkAndRefreshAllCaches = async (
  fetchFunction: (region: string, categories: string[]) => Promise<PoiResult[]>
): Promise<void> => {
  try {
    console.log('Tüm cache\'ler kontrol ediliyor...');
    
    // LocalStorage'daki tüm cache anahtarlarını bul
    const cacheKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('osm_cache_')) {
        cacheKeys.push(key.replace('osm_cache_', ''));
      }
    }
    
    // Her bir cache için kontrol yap
    for (const key of cacheKeys) {
      try {
        const storageData = localStorage.getItem(`osm_cache_${key}`);
        if (storageData) {
          const parsed = JSON.parse(storageData) as CacheItem;
          
          // Cache süresi dolmuşsa güncelle
          if (Date.now() - parsed.timestamp > CACHE_TTL) {
            console.log(`Cache süresi dolmuş, yenileniyor: ${key}`);
            await refreshCacheData(
              parsed.region,
              parsed.categories,
              () => fetchFunction(parsed.region, parsed.categories)
            );
          }
        }
      } catch (error) {
        console.error(`Cache ${key} güncellenirken hata oluştu:`, error);
      }
    }
    
    console.log('Cache kontrolü tamamlandı');
  } catch (error) {
    console.error('Cache kontrol işleminde hata oluştu:', error);
  }
};

/**
 * Cache kullanarak veri getiren fonksiyon
 * Cache'de varsa ve geçerliyse önbellekten getirir, yoksa API çağrısı yapar
 * @param region - Bölge ID'si
 * @param categories - Kategori listesi
 * @param fetchFunction - API'den veri getiren fonksiyon
 * @param cacheTTL - Önbellek süresi (ms), undefined ise varsayılan değer kullanılır
 * @returns Promise<PoiResult[]> - Sonuç verileri
 */
export const getDataWithCache = async (
  region: string,
  categories: string[],
  fetchFunction: () => Promise<PoiResult[]>,
  cacheTTL?: number
): Promise<PoiResult[]> => {
  const key = getCacheKey(region, categories);
  console.log("Cache Key:", key);
  
  // Eğer cacheTTL 0 ise, cache'i kullanma, doğrudan API'den getir
  if (cacheTTL === 0) {
    console.log("Cache bypass edildi - yeni veri alınıyor");
    const freshData = await fetchFunction();
    
    // Verileri cache'e kaydet
    setCacheData(key, freshData, region, categories);
    
    return freshData;
  }
  
  // Önce cache'e bakalım
  const cachedData = getCacheData(key);
  
  if (cachedData) {
    console.log("Cache'den veriler alındı, toplam sayı:", cachedData.length);
    return cachedData;
  }
  
  console.log("Cache bulunamadı, API'den veri alınıyor");
  
  // Cache'de yoksa API'den getir
  const freshData = await fetchFunction();
  
  // Verileri cache'e kaydet
  setCacheData(key, freshData, region, categories);
  console.log("Yeni veri API'den alındı ve cache'e kaydedildi, toplam sayı:", freshData.length);
  
  return freshData;
}; 