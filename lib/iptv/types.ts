export interface IPTVChannel {
  id: string;
  name: string;
  url: string;
  tvgId?: string;
  tvgLogo?: string;
  group?: string;
  quality?: string;
  country?: string;
}

export interface SetflixContentItem {
  id: number;
  title: string;
  image: string;
  url?: string;
  rating?: number;
  year?: number;
  duration?: string;
  genres?: string[];
  description?: string;
  match?: number;
  maturity?: string;
}

