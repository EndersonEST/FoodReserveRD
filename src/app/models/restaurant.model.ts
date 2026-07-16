export interface Restaurant {
  id: string;
  nombre: string;
  categoria: string;
  direccion: string;
  telefono: string;
  website: string;
  ciudad: string;
  lat: number;
  lon: number;
}

export interface FavoriteRestaurant extends Restaurant {
  savedAt: number;
}

export interface VisitedRestaurant extends Restaurant {
  visitedAt: number;
}

export interface SearchHistoryEntry {
  id?: number;
  lat: number;
  lon: number;
  label: string;
  createdAt: number;
  resultCount: number;
}

export interface UserPreferences {
  radiusMeters: number;
  favoriteCategories: string[];
  darkMode: boolean;
}
