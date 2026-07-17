import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Storage } from '@ionic/storage-angular';
import {
  FavoriteRestaurant,
  Restaurant,
  SearchHistoryEntry,
  UserPreferences,
  VisitedRestaurant
} from '../models/restaurant.model';

const DB_NAME = 'foodreserve.db';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  nombre TEXT,
  categoria TEXT,
  direccion TEXT,
  telefono TEXT,
  website TEXT,
  ciudad TEXT,
  lat REAL,
  lon REAL,
  savedAt INTEGER
);

CREATE TABLE IF NOT EXISTS visited (
  id TEXT PRIMARY KEY,
  nombre TEXT,
  categoria TEXT,
  direccion TEXT,
  telefono TEXT,
  website TEXT,
  ciudad TEXT,
  lat REAL,
  lon REAL,
  visitedAt INTEGER
);

CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lat REAL,
  lon REAL,
  label TEXT,
  createdAt INTEGER,
  resultCount INTEGER
);

CREATE TABLE IF NOT EXISTS preferences (
  key TEXT PRIMARY KEY,
  value TEXT
);
`;

const DEFAULT_PREFERENCES: UserPreferences = {
  radiusMeters: 5000,
  favoriteCategories: [],
  darkMode: false
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private useSqlite = false;
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private ready = false;

  constructor(private storage: Storage) {}

  async init(): Promise<void> {
    if (this.ready) {
      return;
    }

    this.useSqlite = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

    if (this.useSqlite) {
      try {
        await this.initSqlite();
        this.ready = true;
        return;
      } catch (err) {
        console.log('sqlite fallo, usando storage', err);
        this.useSqlite = false;
      }
    }

    await this.storage.create();
    this.ready = true;
  }

  private async initSqlite() {
    const ret = await this.sqlite.checkConnectionsConsistency();
    const isConn = (await this.sqlite.isConnection(DB_NAME, false)).result;

    if (ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(DB_NAME, false);
    } else {
      this.db = await this.sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
    }

    await this.db.open();
    await this.db.execute(SCHEMA);
  }

  async addFavorite(restaurant: Restaurant): Promise<void> {
    const savedAt = Date.now();

    if (this.useSqlite && this.db) {
      await this.db.run(
        `INSERT OR REPLACE INTO favorites (id, nombre, categoria, direccion, telefono, website, ciudad, lat, lon, savedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [restaurant.id, restaurant.nombre, restaurant.categoria, restaurant.direccion, restaurant.telefono,
          restaurant.website, restaurant.ciudad, restaurant.lat, restaurant.lon, savedAt]
      );
      return;
    }

    const favorites = await this.getFavorites();
    const filtered = favorites.filter(f => f.id !== restaurant.id);
    filtered.unshift({ ...restaurant, savedAt });
    await this.storage.set('favorites', filtered);
  }

  async removeFavorite(id: string): Promise<void> {
    if (this.useSqlite && this.db) {
      await this.db.run('DELETE FROM favorites WHERE id = ?', [id]);
      return;
    }

    const favorites = await this.getFavorites();
    await this.storage.set('favorites', favorites.filter(f => f.id !== id));
  }

  async isFavorite(id: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(f => f.id === id);
  }

  async getFavorites(): Promise<FavoriteRestaurant[]> {
    if (this.useSqlite && this.db) {
      const result = await this.db.query('SELECT * FROM favorites ORDER BY savedAt DESC');
      return (result.values as FavoriteRestaurant[]) || [];
    }

    const favorites = await this.storage.get('favorites');
    return favorites || [];
  }

  async addVisited(restaurant: Restaurant): Promise<void> {
    const visitedAt = Date.now();

    if (this.useSqlite && this.db) {
      await this.db.run(
        `INSERT OR REPLACE INTO visited (id, nombre, categoria, direccion, telefono, website, ciudad, lat, lon, visitedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [restaurant.id, restaurant.nombre, restaurant.categoria, restaurant.direccion, restaurant.telefono,
          restaurant.website, restaurant.ciudad, restaurant.lat, restaurant.lon, visitedAt]
      );
      return;
    }

    const visited = await this.getVisited();
    const filtered = visited.filter(v => v.id !== restaurant.id);
    filtered.unshift({ ...restaurant, visitedAt });
    await this.storage.set('visited', filtered.slice(0, 50));
  }

  async getVisited(): Promise<VisitedRestaurant[]> {
    if (this.useSqlite && this.db) {
      const result = await this.db.query('SELECT * FROM visited ORDER BY visitedAt DESC LIMIT 50');
      return (result.values as VisitedRestaurant[]) || [];
    }

    const visited = await this.storage.get('visited');
    return visited || [];
  }

  async addSearchHistory(entry: Omit<SearchHistoryEntry, 'id'>): Promise<void> {
    if (this.useSqlite && this.db) {
      await this.db.run(
        'INSERT INTO search_history (lat, lon, label, createdAt, resultCount) VALUES (?, ?, ?, ?, ?)',
        [entry.lat, entry.lon, entry.label, entry.createdAt, entry.resultCount]
      );
      return;
    }

    const history = await this.getSearchHistory();
    history.unshift(entry as SearchHistoryEntry);
    await this.storage.set('search_history', history.slice(0, 30));
  }

  async getSearchHistory(): Promise<SearchHistoryEntry[]> {
    if (this.useSqlite && this.db) {
      const result = await this.db.query('SELECT * FROM search_history ORDER BY createdAt DESC LIMIT 30');
      return (result.values as SearchHistoryEntry[]) || [];
    }

    const history = await this.storage.get('search_history');
    return history || [];
  }

  async clearSearchHistory(): Promise<void> {
    if (this.useSqlite && this.db) {
      await this.db.run('DELETE FROM search_history');
      return;
    }

    await this.storage.set('search_history', []);
  }

  async getPreferences(): Promise<UserPreferences> {
    if (this.useSqlite && this.db) {
      const result = await this.db.query('SELECT value FROM preferences WHERE key = ?', ['user_preferences']);
      if (result.values && result.values.length > 0) {
        return JSON.parse(result.values[0].value);
      }
      return DEFAULT_PREFERENCES;
    }

    const preferences = await this.storage.get('preferences');
    return preferences || DEFAULT_PREFERENCES;
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    if (this.useSqlite && this.db) {
      await this.db.run(
        'INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)',
        ['user_preferences', JSON.stringify(preferences)]
      );
      return;
    }

    await this.storage.set('preferences', preferences);
  }
}
