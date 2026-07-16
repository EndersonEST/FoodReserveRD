import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, refreshOutline, timeOutline } from 'ionicons/icons';

import { ApiService } from '../../services/api.service';
import { GeolocationService } from '../../services/geolocation.service';
import { DatabaseService } from '../../services/database.service';
import { ToastService } from '../../services/toast.service';
import { Restaurant } from '../../models/restaurant.model';

import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
    IonButton,
    RestaurantCardComponent,
    SkeletonCardComponent,
    EmptyStateComponent
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  restaurants: Restaurant[] = [];
  favoriteIds = new Set<string>();
  loading = true;
  errorMessage = '';
  currentLabel = '';

  constructor(
    private apiService: ApiService,
    private geolocationService: GeolocationService,
    private databaseService: DatabaseService,
    private toastService: ToastService,
    private router: Router
  ) {
    addIcons({ locationOutline, refreshOutline, timeOutline });
  }

  async ngOnInit() {
    await this.loadFavoriteIds();
    await this.loadRestaurants();
  }

  async loadRestaurants(event?: any) {
    this.loading = true;
    this.errorMessage = '';

    try {
      const coords = await this.geolocationService.getCurrentPosition();
      this.currentLabel = `${coords.lat.toFixed(3)}, ${coords.lon.toFixed(3)}`;

      const restaurants = await firstValueFrom(this.apiService.getNearbyRestaurants(coords.lat, coords.lon));
      this.restaurants = restaurants || [];

      await this.databaseService.addSearchHistory({
        lat: coords.lat,
        lon: coords.lon,
        label: this.currentLabel,
        createdAt: Date.now(),
        resultCount: this.restaurants.length
      });
    } catch (err: any) {
      console.log('error cargando restaurantes', err);
      this.errorMessage = 'No pudimos obtener restaurantes cercanos. Revisa tu ubicacion e intenta de nuevo.';
      await this.toastService.error('Ocurrio un error al buscar restaurantes');
    } finally {
      this.loading = false;
      if (event) {
        event.target.complete();
      }
    }
  }

  async loadFavoriteIds() {
    const favorites = await this.databaseService.getFavorites();
    this.favoriteIds = new Set(favorites.map(f => f.id));
  }

  async onFavoriteToggle(restaurant: Restaurant) {
    if (this.favoriteIds.has(restaurant.id)) {
      await this.databaseService.removeFavorite(restaurant.id);
      this.favoriteIds.delete(restaurant.id);
      await this.toastService.info('Eliminado de favoritos');
    } else {
      await this.databaseService.addFavorite(restaurant);
      this.favoriteIds.add(restaurant.id);
      await this.toastService.success('Agregado a favoritos');
    }
  }

  goToDetail(restaurant: Restaurant) {
    this.router.navigate(['/restaurant', restaurant.id], { state: { restaurant } });
  }

  goToHistory() {
    this.router.navigateByUrl('/search-history');
  }
}
