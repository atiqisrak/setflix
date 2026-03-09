/**
 * Content kinds for the app: live channels, movies, and TV series.
 */
export type ContentKind = "channel" | "movie" | "series";

/**
 * Movie catalog item (from API or static catalog).
 */
export interface MovieItem {
  id: string;
  title: string;
  image: string;
  description?: string;
  year?: number;
  genres?: string[];
  streamUrl?: string;
  rating?: number;
  maturity?: string;
}

/**
 * Episode reference for TV series.
 */
export interface EpisodeItem {
  season: number;
  episode: number;
  title?: string;
  streamUrl: string;
}

/**
 * TV series catalog item (from API or static catalog).
 */
export interface SeriesItem {
  id: string;
  title: string;
  image: string;
  description?: string;
  year?: number;
  genres?: string[];
  episodes?: EpisodeItem[];
  /** Fallback when no episode list: single stream for the show */
  streamUrl?: string;
  rating?: number;
  maturity?: string;
}

/**
 * Item that can be added to My List: channel (live), movie, or series.
 * Use `kind` to discriminate.
 */
export interface MyListChannelItem {
  kind: "channel";
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

export interface MyListMovieItem {
  kind: "movie";
  id: string;
  title: string;
  image: string;
  description?: string;
  year?: number;
  genres?: string[];
  streamUrl?: string;
  rating?: number;
  maturity?: string;
}

export interface MyListSeriesItem {
  kind: "series";
  id: string;
  title: string;
  image: string;
  description?: string;
  year?: number;
  genres?: string[];
  streamUrl?: string;
  episodes?: EpisodeItem[];
  rating?: number;
  maturity?: string;
}

export type MyListItem =
  | MyListChannelItem
  | MyListMovieItem
  | MyListSeriesItem;
