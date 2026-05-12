// Image caching utility for managing cached images and providing lazy loading

interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
}

interface LazyImageOptions {
  className?: string;
  alt?: string;
  onLoad?: () => void;
  onError?: () => void;
}

class ImageCacheManager {
  private cache: Map<string, CachedImage> = new Map();
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_SIZE = 50; // Maximum number of images to cache

  // Check if browser supports Intersection Observer for lazy loading
  private supportsIntersectionObserver(): boolean {
    return 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window;
  }

  // Load and cache an image
  async loadImage(url: string): Promise<HTMLImageElement> {
    // Check if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // Check cache first
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      const img = new Image();
      img.src = URL.createObjectURL(cached.blob);
      return Promise.resolve(img);
    }

    // Create loading promise
    const loadingPromise = this.fetchAndCacheImage(url);
    this.loadingPromises.set(url, loadingPromise);

    try {
      const img = await loadingPromise;
      return img;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  // Fetch image from network and cache it
  private async fetchAndCacheImage(url: string): Promise<HTMLImageElement> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load image: ${url}`);
    }

    const blob = await response.blob();
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Cache the image
        this.addToCache(url, blob);
        resolve(img);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  // Add image to cache with size management
  private addToCache(url: string, blob: Blob): void {
    // Remove oldest images if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(url, {
      url,
      blob,
      timestamp: Date.now()
    });
  }

  // Create lazy loaded image element
  createLazyImage(url: string, options: LazyImageOptions = {}): HTMLImageElement {
    const img = document.createElement('img');
    
    if (options.className) {
      img.className = options.className;
    }
    
    if (options.alt) {
      img.alt = options.alt;
    }

    // Use Intersection Observer for lazy loading
    if (this.supportsIntersectionObserver()) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(url).then((loadedImg) => {
                img.src = loadedImg.src;
                if (options.onLoad) {
                  img.onload = options.onLoad;
                }
                observer.unobserve(img);
              }).catch(() => {
                if (options.onError) {
                  options.onError();
                }
              });
            }
          });
        },
        {
          rootMargin: '50px' // Start loading 50px before image comes into view
        }
      );

      observer.observe(img);
      
      // Set a placeholder or low-quality version
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
    } else {
      // Fallback for browsers that don't support Intersection Observer
      this.loadImage(url).then((loadedImg) => {
        img.src = loadedImg.src;
        if (options.onLoad) {
          img.onload = options.onLoad;
        }
      }).catch(() => {
        if (options.onError) {
          options.onError();
        }
      });
    }

    return img;
  }

  // Preload critical images
  async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.loadImage(url));
    await Promise.allSettled(promises);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; totalSize: number } {
    let totalSize = 0;
    this.cache.forEach(item => {
      totalSize += item.blob.size;
    });
    
    return {
      size: this.cache.size,
      totalSize
    };
  }
}

// Create singleton instance
export const imageCache = new ImageCacheManager();

// React hook for image caching
export function useImageCache() {
  const preloadImages = async (urls: string[]) => {
    try {
      await imageCache.preloadImages(urls);
    } catch (error) {
      console.warn('Failed to preload images:', error);
    }
  };

  const createLazyImage = (url: string, options?: LazyImageOptions) => {
    return imageCache.createLazyImage(url, options);
  };

  const clearCache = () => {
    imageCache.clearCache();
  };

  const getCacheStats = () => {
    return imageCache.getCacheStats();
  };

  return {
    preloadImages,
    createLazyImage,
    clearCache,
    getCacheStats
  };
}
