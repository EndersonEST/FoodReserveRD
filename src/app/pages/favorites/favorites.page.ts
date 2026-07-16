import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';

import { DatabaseService } from '../../services/database.service';
import { ToastService } from '../../services/toast.service';
import { FavoriteRestaurant, Restaurant } from '../../models/restaurant.model';

import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonContent, RestaurantCardComponent, EmptyStateComponent],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit {
  favorites: FavoriteRestaurant[] = [];
  loading = true;

  constructor(
    private databaseService: DatabaseService,
    private toastService: ToastService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadFavorites();
  }

  async ionViewWillEnter() {
    await this.loadFavorites();
  }

  async loadFavorites() {
    this.loading = true;
    this.favorites = await this.databaseService.getFavorites();
    this.loading = false;
  }

  async removeFavorite(restaurant: Restaurant) {
    await this.databaseService.removeFavorite(restaurant.id);
    this.favorites = this.favorites.filter(f => f.id !== restaurant.id);
    await this.toastService.info('Eliminado de favoritos');
  }

  goToDetail(restaurant: Restaurant) {
    this.router.navigate(['/restaurant', restaurant.id], { state: { restaurant } });
  }
}
