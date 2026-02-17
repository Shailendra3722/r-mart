// Simple in-memory cache with TTL
type CacheEntry = {
    data: any;
    timestamp: number;
};

const cache = new Map<string, CacheEntry>();

/**
 * Get cached data if not expired
 * @param key - Cache key
 * @param ttl - Time to live in milliseconds
 */
export function getCached(key: string, ttl: number): any | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
    }
    cache.delete(key); // Remove expired entry
    return null;
}

/**
 * Set cache entry
 * @param key - Cache key
 * @param data - Data to cache
 */
export function setCache(key: string, data: any): void {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

/**
 * Invalidate/clear cache entry
 * @param key - Cache key to invalidate
 */
export function invalidateCache(key: string): void {
    cache.delete(key);
}

/**
 * Clear all cache
 */
export function clearCache(): void {
    cache.clear();
}

/**
 * Get cache with async fallback
 * @param key - Cache key
 * @param ttl - Time to live in milliseconds
 * @param fetchFn - Function to fetch data if cache miss
 */
export async function getCachedOrFetch<T>(
    key: string,
    ttl: number,
    fetchFn: () => Promise<T>
): Promise<T> {
    const cached = getCached(key, ttl);
    if (cached !== null) {
        return cached as T;
    }

    const data = await fetchFn();
    setCache(key, data);
    return data;
}

/**
 * Common cache keys
 */
export const CacheKeys = {
    PRODUCTS: 'products',
    PRODUCT: (id: string) => `product:${id}`,
    REVIEWS: (productId: string) => `reviews:${productId}`,
    NOTIFICATIONS: (userId: string) => `notifications:${userId}`,
};

/**
 * Common TTL values (in milliseconds)
 */
export const CacheTTL = {
    SHORT: 60 * 1000,        // 1 minute
    MEDIUM: 5 * 60 * 1000,   // 5 minutes
    LONG: 15 * 60 * 1000,    // 15 minutes
    HOUR: 60 * 60 * 1000,    // 1 hour
};
