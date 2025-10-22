import fs from 'fs';
import path from 'path';

// Cache for sample data
let sampleDataCache: Record<string, string> | null = null;
let cacheTimestamp: number | null = null;

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Load sample data from JSON file with caching
export const loadSampleData = (): Record<string, string> => {
  const now = Date.now();
  // Return cached data if it exists and is still valid
  if (sampleDataCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
    return sampleDataCache;
  }

  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Update cache
    sampleDataCache = data;
    cacheTimestamp = now;

    return data;
  } catch (error) {
    console.error('Error loading sample data:', error);
    return {};
  }
};

// Function to clear cache (useful for testing or manual cache invalidation)
export const clearSampleDataCache = (): void => {
  sampleDataCache = null;
  cacheTimestamp = null;
};

// Function to get cache info (useful for debugging)
export const getCacheInfo = () => ({
  hasCache: sampleDataCache !== null,
  cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
  cacheSize: sampleDataCache ? Object.keys(sampleDataCache).length : 0
});