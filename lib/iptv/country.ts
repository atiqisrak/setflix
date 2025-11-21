import { IPTVChannel } from "./types";

/**
 * Common country codes and names mapping
 */
const COUNTRY_CODES: Record<string, string> = {
  US: "United States",
  UK: "United Kingdom",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  PT: "Portugal",
  GR: "Greece",
  IE: "Ireland",
  NZ: "New Zealand",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  IN: "India",
  BR: "Brazil",
  MX: "Mexico",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  ZA: "South Africa",
  EG: "Egypt",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  TR: "Turkey",
  RU: "Russia",
  UA: "Ukraine",
  IL: "Israel",
  TH: "Thailand",
  PH: "Philippines",
  ID: "Indonesia",
  MY: "Malaysia",
  SG: "Singapore",
  VN: "Vietnam",
};

/**
 * Extracts country from channel metadata
 */
export function extractCountry(channel: {
  group?: string;
  url?: string;
  name?: string;
}): string | undefined {
  // Try to extract from group field
  if (channel.group) {
    const groupUpper = channel.group.toUpperCase();
    
    // Check for country codes
    for (const [code, name] of Object.entries(COUNTRY_CODES)) {
      if (groupUpper.includes(code) || groupUpper.includes(name.toUpperCase())) {
        return name;
      }
    }
    
    // Check for common country patterns in group
    const countryPatterns = [
      /(?:^|\s)(United States|USA|US)(?:\s|$)/i,
      /(?:^|\s)(United Kingdom|UK|Britain)(?:\s|$)/i,
      /(?:^|\s)(Canada|CA)(?:\s|$)/i,
      /(?:^|\s)(Australia|AU)(?:\s|$)/i,
      /(?:^|\s)(Germany|DE)(?:\s|$)/i,
      /(?:^|\s)(France|FR)(?:\s|$)/i,
      /(?:^|\s)(Italy|IT)(?:\s|$)/i,
      /(?:^|\s)(Spain|ES)(?:\s|$)/i,
    ];
    
    for (const pattern of countryPatterns) {
      const match = channel.group.match(pattern);
      if (match) {
        const country = match[1];
        // Map common abbreviations to full names
        if (country.toUpperCase() === "US" || country.toUpperCase() === "USA") {
          return "United States";
        }
        if (country.toUpperCase() === "UK") {
          return "United Kingdom";
        }
        return country;
      }
    }
  }
  
  // Try to extract from URL
  if (channel.url) {
    const urlLower = channel.url.toLowerCase();
    // Check for country codes in URL path
    for (const [code, name] of Object.entries(COUNTRY_CODES)) {
      if (urlLower.includes(`/${code.toLowerCase()}/`) || 
          urlLower.includes(`/${code.toLowerCase()}.`)) {
        return name;
      }
    }
  }
  
  return undefined;
}

/**
 * Reverse mapping: country name to country code
 */
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  "United States": "US",
  "United Kingdom": "GB",
  "Canada": "CA",
  "Australia": "AU",
  "Germany": "DE",
  "France": "FR",
  "Italy": "IT",
  "Spain": "ES",
  "Netherlands": "NL",
  "Belgium": "BE",
  "Switzerland": "CH",
  "Austria": "AT",
  "Sweden": "SE",
  "Norway": "NO",
  "Denmark": "DK",
  "Finland": "FI",
  "Poland": "PL",
  "Portugal": "PT",
  "Greece": "GR",
  "Ireland": "IE",
  "New Zealand": "NZ",
  "Japan": "JP",
  "South Korea": "KR",
  "China": "CN",
  "India": "IN",
  "Brazil": "BR",
  "Mexico": "MX",
  "Argentina": "AR",
  "Chile": "CL",
  "Colombia": "CO",
  "Peru": "PE",
  "South Africa": "ZA",
  "Egypt": "EG",
  "United Arab Emirates": "AE",
  "Saudi Arabia": "SA",
  "Turkey": "TR",
  "Russia": "RU",
  "Ukraine": "UA",
  "Israel": "IL",
  "Thailand": "TH",
  "Philippines": "PH",
  "Indonesia": "ID",
  "Malaysia": "MY",
  "Singapore": "SG",
  "Vietnam": "VN",
};

/**
 * Gets country code from country name
 */
export function getCountryCode(countryName: string): string | undefined {
  return COUNTRY_NAME_TO_CODE[countryName];
}

/**
 * Gets country flag URL from country name
 * @param countryName - Full country name
 * @param style - Flag style: 'flat' or 'shiny' (default: 'flat')
 * @param size - Flag size in pixels (default: 32)
 */
export function getCountryFlagUrl(
  countryName: string,
  style: "flat" | "shiny" = "flat",
  size: number = 32
): string | undefined {
  const code = getCountryCode(countryName);
  if (!code) return undefined;
  return `https://flagsapi.com/${code}/${style}/${size}.png`;
}

/**
 * Gets all unique countries from channels
 */
export function getUniqueCountries(channels: IPTVChannel[]): string[] {
  const countries = new Set<string>();
  
  channels.forEach((channel) => {
    if (channel.country) {
      countries.add(channel.country);
    }
  });
  
  return Array.from(countries).sort();
}

