/**
 * Provider configuration and loading from environment variables
 */

export type ProviderType = "main" | "regional" | "specialty" | "third-party";
export type ProviderRegion = string | null;

export interface ProviderConfig {
  id: string;
  name: string;
  url: string;
  type: ProviderType;
  region: ProviderRegion;
  enabled: boolean;
  priority: number;
}

/**
 * Default provider configurations
 * Based on apsattv.com playlists
 */
const DEFAULT_PROVIDERS: ProviderConfig[] = [
  // Main Providers (9 core)
  { id: "vizio", name: "Vizio TV", url: "https://www.apsattv.com/vizio.m3u", type: "main", region: null, enabled: true, priority: 1 },
  { id: "localnow", name: "LocalNow", url: "https://www.apsattv.com/localnow.m3u", type: "main", region: null, enabled: true, priority: 2 },
  { id: "lg", name: "LG Channels", url: "https://www.apsattv.com/lg.m3u", type: "main", region: null, enabled: true, priority: 3 },
  { id: "tablo", name: "Tablo", url: "https://www.apsattv.com/tablo.m3u", type: "main", region: null, enabled: true, priority: 4 },
  { id: "xiaomi", name: "Xiaomi", url: "https://www.apsattv.com/xiaomi.m3u", type: "main", region: null, enabled: true, priority: 5 },
  { id: "firetv", name: "Fire TV", url: "https://www.apsattv.com/firetv.m3u", type: "main", region: null, enabled: true, priority: 6 },
  { id: "xumo", name: "Xumo", url: "https://www.apsattv.com/xumo.m3u", type: "main", region: null, enabled: true, priority: 7 },
  { id: "rok", name: "Roku Channel", url: "https://www.apsattv.com/rok.m3u", type: "main", region: null, enabled: true, priority: 8 },
  { id: "distro", name: "Distro", url: "https://www.apsattv.com/distro.m3u", type: "main", region: null, enabled: true, priority: 9 },
  
  // LG Regional Playlists
  { id: "arlg", name: "LG Channels AR", url: "https://www.apsattv.com/arlg.m3u", type: "regional", region: "AR", enabled: true, priority: 10 },
  { id: "atlg", name: "LG Channels AT", url: "https://www.apsattv.com/atlg.m3u", type: "regional", region: "AT", enabled: true, priority: 11 },
  { id: "aulg", name: "LG Channels AU", url: "https://www.apsattv.com/aulg.m3u", type: "regional", region: "AU", enabled: true, priority: 12 },
  { id: "belg", name: "LG Channels BE", url: "https://www.apsattv.com/belg.m3u", type: "regional", region: "BE", enabled: true, priority: 13 },
  { id: "brlg", name: "LG Channels BR", url: "https://www.apsattv.com/brlg.m3u", type: "regional", region: "BR", enabled: true, priority: 14 },
  { id: "calg", name: "LG Channels CA", url: "https://www.apsattv.com/calg.m3u", type: "regional", region: "CA", enabled: true, priority: 15 },
  { id: "chlg", name: "LG Channels CH", url: "https://www.apsattv.com/chlg.m3u", type: "regional", region: "CH", enabled: true, priority: 16 },
  { id: "cllg", name: "LG Channels CL", url: "https://www.apsattv.com/cllg.m3u", type: "regional", region: "CL", enabled: true, priority: 17 },
  { id: "collg", name: "LG Channels CO", url: "https://www.apsattv.com/collg.m3u", type: "regional", region: "CO", enabled: true, priority: 18 },
  { id: "delg", name: "LG Channels DE", url: "https://www.apsattv.com/delg.m3u", type: "regional", region: "DE", enabled: true, priority: 19 },
  { id: "dklg", name: "LG Channels DK", url: "https://www.apsattv.com/dklg.m3u", type: "regional", region: "DK", enabled: true, priority: 20 },
  { id: "eslg", name: "LG Channels ES", url: "https://www.apsattv.com/eslg.m3u", type: "regional", region: "ES", enabled: true, priority: 21 },
  { id: "filg", name: "LG Channels FI", url: "https://www.apsattv.com/filg.m3u", type: "regional", region: "FI", enabled: true, priority: 22 },
  { id: "frlg", name: "LG Channels FR", url: "https://www.apsattv.com/frlg.m3u", type: "regional", region: "FR", enabled: true, priority: 23 },
  { id: "gblg", name: "LG Channels GB", url: "https://www.apsattv.com/gblg.m3u", type: "regional", region: "GB", enabled: true, priority: 24 },
  { id: "ielg", name: "LG Channels IE", url: "https://www.apsattv.com/ielg.m3u", type: "regional", region: "IE", enabled: true, priority: 25 },
  { id: "inlg", name: "LG Channels IN", url: "https://www.apsattv.com/inlg.m3u", type: "regional", region: "IN", enabled: true, priority: 26 },
  { id: "itlg", name: "LG Channels IT", url: "https://www.apsattv.com/itlg.m3u", type: "regional", region: "IT", enabled: true, priority: 27 },
  { id: "jplg", name: "LG Channels JP", url: "https://www.apsattv.com/jplg.m3u", type: "regional", region: "JP", enabled: true, priority: 28 },
  { id: "krlg", name: "LG Channels KR", url: "https://www.apsattv.com/krlg.m3u", type: "regional", region: "KR", enabled: true, priority: 29 },
  { id: "lulg", name: "LG Channels LU", url: "https://www.apsattv.com/lulg.m3u", type: "regional", region: "LU", enabled: true, priority: 30 },
  { id: "mxlg", name: "LG Channels MX", url: "https://www.apsattv.com/mxlg.m3u", type: "regional", region: "MX", enabled: true, priority: 31 },
  { id: "nllg", name: "LG Channels NL", url: "https://www.apsattv.com/nllg.m3u", type: "regional", region: "NL", enabled: true, priority: 32 },
  { id: "nolg", name: "LG Channels NO", url: "https://www.apsattv.com/nolg.m3u", type: "regional", region: "NO", enabled: true, priority: 33 },
  { id: "nzlg", name: "LG Channels NZ", url: "https://www.apsattv.com/nzlg.m3u", type: "regional", region: "NZ", enabled: true, priority: 34 },
  { id: "pelg", name: "LG Channels PE", url: "https://www.apsattv.com/pelg.m3u", type: "regional", region: "PE", enabled: true, priority: 35 },
  { id: "ptlg", name: "LG Channels PT", url: "https://www.apsattv.com/ptlg.m3u", type: "regional", region: "PT", enabled: true, priority: 36 },
  { id: "sglg", name: "LG Channels SG", url: "https://www.apsattv.com/sglg.m3u", type: "regional", region: "SG", enabled: true, priority: 37 },
  { id: "selg", name: "LG Channels SE", url: "https://www.apsattv.com/selg.m3u", type: "regional", region: "SE", enabled: true, priority: 38 },
  { id: "uslg", name: "LG Channels US", url: "https://www.apsattv.com/uslg.m3u", type: "regional", region: "US", enabled: true, priority: 39 },
  
  // Samsung TV Plus Regional
  { id: "ssungnz", name: "Samsung TV Plus NZ", url: "https://www.apsattv.com/ssungnz.m3u", type: "regional", region: "NZ", enabled: true, priority: 40 },
  { id: "ssungaus", name: "Samsung TV Plus AU", url: "https://www.apsattv.com/ssungaus.m3u", type: "regional", region: "AU", enabled: true, priority: 41 },
  { id: "ssungsg", name: "Samsung TV Plus SG", url: "https://www.apsattv.com/ssungsg.m3u", type: "regional", region: "SG", enabled: true, priority: 42 },
  { id: "ssungph", name: "Samsung TV Plus PH", url: "https://www.apsattv.com/ssungph.m3u", type: "regional", region: "PH", enabled: true, priority: 43 },
  { id: "ssungth", name: "Samsung TV Plus TH", url: "https://www.apsattv.com/ssungth.m3u", type: "regional", region: "TH", enabled: true, priority: 44 },
  { id: "ssungbra", name: "Samsung TV Plus BR", url: "https://www.apsattv.com/ssungbra.m3u", type: "regional", region: "BR", enabled: true, priority: 45 },
  { id: "ssungmex", name: "Samsung TV Plus MX", url: "https://www.apsattv.com/ssungmex.m3u", type: "regional", region: "MX", enabled: true, priority: 46 },
  { id: "ssungnor", name: "Samsung TV Plus NO", url: "https://www.apsattv.com/ssungnor.m3u", type: "regional", region: "NO", enabled: true, priority: 47 },
  { id: "ssungfin", name: "Samsung TV Plus FI", url: "https://www.apsattv.com/ssungfin.m3u", type: "regional", region: "FI", enabled: true, priority: 48 },
  { id: "ssungden", name: "Samsung TV Plus DK", url: "https://www.apsattv.com/ssungden.m3u", type: "regional", region: "DK", enabled: true, priority: 49 },
  { id: "ssungswe", name: "Samsung TV Plus SE", url: "https://www.apsattv.com/ssungswe.m3u", type: "regional", region: "SE", enabled: true, priority: 50 },
  { id: "ssungpor", name: "Samsung TV Plus PT", url: "https://www.apsattv.com/ssungpor.m3u", type: "regional", region: "PT", enabled: true, priority: 51 },
  { id: "ssunglux", name: "Samsung TV Plus LU", url: "https://www.apsattv.com/ssunglux.m3u", type: "regional", region: "LU", enabled: true, priority: 52 },
  { id: "ssungbelg", name: "Samsung TV Plus BE", url: "https://www.apsattv.com/ssungbelg.m3u", type: "regional", region: "BE", enabled: true, priority: 53 },
  { id: "ssungire", name: "Samsung TV Plus IE", url: "https://www.apsattv.com/ssungire.m3u", type: "regional", region: "IE", enabled: true, priority: 54 },
  { id: "ssungneth", name: "Samsung TV Plus NL", url: "https://www.apsattv.com/ssungneth.m3u", type: "regional", region: "NL", enabled: true, priority: 55 },
  
  // Specialty Playlists
  { id: "vidaa", name: "Vidaa TV", url: "https://www.apsattv.com/vidaa.m3u", type: "specialty", region: null, enabled: true, priority: 56 },
  { id: "redbox", name: "Redbox", url: "https://www.apsattv.com/redbox.m3u", type: "specialty", region: null, enabled: true, priority: 57 },
  { id: "igocast", name: "Igocast", url: "https://www.apsattv.com/igocast.m3u", type: "specialty", region: null, enabled: true, priority: 58 },
  { id: "freelivesports", name: "Free Live Sports", url: "https://www.apsattv.com/freelivesports.m3u", type: "specialty", region: null, enabled: true, priority: 59 },
  { id: "rewardedtv", name: "Rewarded TV", url: "https://www.apsattv.com/rewardedtv.m3u", type: "specialty", region: null, enabled: true, priority: 60 },
  { id: "moviearkbr", name: "MovieArk BR", url: "https://www.apsattv.com/moviearkbr.m3u", type: "specialty", region: "BR", enabled: true, priority: 61 },
  { id: "tclplus", name: "TCL TV Plus", url: "https://www.apsattv.com/tclplus.m3u", type: "specialty", region: null, enabled: true, priority: 62 },
  { id: "tclbr", name: "TCL BR", url: "https://www.apsattv.com/tclbr.m3u", type: "specialty", region: "BR", enabled: true, priority: 63 },
  { id: "tcl", name: "TCL Channels", url: "https://www.apsattv.com/tcl.m3u", type: "specialty", region: null, enabled: true, priority: 64 },
  { id: "galxytv", name: "Galxy.TV", url: "https://www.apsattv.com/galxytv.m3u", type: "specialty", region: null, enabled: true, priority: 65 },
  { id: "zeasn", name: "Zeasn", url: "https://www.apsattv.com/zeasn.m3u", type: "specialty", region: null, enabled: true, priority: 66 },
  { id: "sportstv", name: "Sports TV", url: "https://www.apsattv.com/sportstv.m3u", type: "specialty", region: null, enabled: true, priority: 67 },
  { id: "klowd", name: "Klowd TV", url: "https://www.apsattv.com/klowd.m3u", type: "specialty", region: null, enabled: true, priority: 68 },
  { id: "freetv", name: "Free TV", url: "https://www.apsattv.com/freetv.m3u", type: "specialty", region: null, enabled: true, priority: 69 },
  { id: "freemoviesplus", name: "Free Movies Plus", url: "https://www.apsattv.com/freemoviesplus.m3u", type: "specialty", region: null, enabled: true, priority: 70 },
  { id: "veely", name: "Veely", url: "https://www.apsattv.com/veely.m3u", type: "specialty", region: null, enabled: true, priority: 71 },
  
  // Third-party Playlists
  { id: "tubi", name: "Tubi TV", url: "https://raw.githubusercontent.com/BuddyChewChew/app-m3u-generator/refs/heads/main/playlists/tubi_all.m3u", type: "third-party", region: null, enabled: true, priority: 72 },
];

/**
 * Load provider configurations from environment variables
 * Falls back to default providers if env vars not set
 */
export function loadProviderConfig(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];
  
  // Try loading from environment variables (NEXT_PUBLIC_PLAYLIST_1 through NEXT_PUBLIC_PLAYLIST_9)
  // In Next.js, NEXT_PUBLIC_* variables are available on both client and server
  for (let i = 1; i <= 9; i++) {
    const envVar = `NEXT_PUBLIC_PLAYLIST_${i}` as const;
    let url: string | undefined;
    
    if (typeof window !== "undefined") {
      // Client-side: access from window or process.env
      url = (window as any).__ENV__?.[envVar] || process.env[envVar];
    } else {
      // Server-side: access from process.env
      url = process.env[envVar];
    }
    
    if (url && typeof url === "string" && url.trim()) {
      // Extract provider ID from URL
      const match = url.match(/\/([^\/]+)\.m3u$/);
      const id = match ? match[1] : `playlist-${i}`;
      const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/[-_]/g, " ");
      
      // Check if it's a default provider to get metadata
      const defaultProvider = DEFAULT_PROVIDERS.find(p => p.id === id);
      
      providers.push({
        id,
        name: defaultProvider?.name || name,
        url: url.trim(),
        type: defaultProvider?.type || "main",
        region: defaultProvider?.region || null,
        enabled: true,
        priority: defaultProvider?.priority || (900 + i),
      });
    }
  }
  
  // If no env vars found, use all default providers
  if (providers.length === 0) {
    return DEFAULT_PROVIDERS.filter(p => p.enabled);
  }
  
  // Merge with defaults, prioritizing env vars
  const envProviderIds = new Set(providers.map(p => p.id));
  const mergedProviders = [...providers];
  
  DEFAULT_PROVIDERS.forEach(defaultProvider => {
    if (!envProviderIds.has(defaultProvider.id) && defaultProvider.enabled) {
      mergedProviders.push(defaultProvider);
    }
  });
  
  return mergedProviders.sort((a, b) => a.priority - b.priority);
}

/**
 * Get all enabled providers
 */
export function getEnabledProviders(): ProviderConfig[] {
  return loadProviderConfig().filter(p => p.enabled);
}

/**
 * Get providers by type
 */
export function getProvidersByType(type: ProviderType): ProviderConfig[] {
  return loadProviderConfig().filter(p => p.type === type && p.enabled);
}

/**
 * Get providers by region
 */
export function getProvidersByRegion(region: string): ProviderConfig[] {
  return loadProviderConfig().filter(p => p.region === region && p.enabled);
}

/**
 * Get a provider by ID
 */
export function getProviderById(id: string): ProviderConfig | undefined {
  return loadProviderConfig().find(p => p.id === id);
}

/**
 * Validate provider URL
 */
export function validateProviderUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

