import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonContent,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, callOutline, globeOutline, mapOutline, heart, heartOutline, pricetagOutline } from 'ionicons/icons';

import { DatabaseService } from '../../services/database.service';
import { ToastService } from '../../services/toast.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonIcon, IonButton],
  templateUrl: './restaurant-detail.page.html',
  styleUrls: ['./restaurant-detail.page.scss']
})
export class RestaurantDetailPage implements OnInit {
  restaurant: Restaurant | null = null;
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService,
    private toastService: ToastService
  ) {
    addIcons({ locationOutline, callOutline, globeOutline, mapOutline, heart, heartOutline, pricetagOutline });
  }

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const stateRestaurant = navigation?.extras?.state?.['restaurant'] || history.state?.restaurant;

    if (stateRestaurant) {
      this.restaurant = stateRestaurant;
      this.isFavorite = await this.databaseService.isFavorite(this.restaurant!.id);
      await this.databaseService.addVisited(this.restaurant!);
    }
  }

  async toggleFavorite() {
    if (!this.restaurant) {
      return;
    }

    if (this.isFavorite) {
      await this.databaseService.removeFavorite(this.restaurant.id);
      this.isFavorite = false;
      await this.toastService.info('Eliminado de favoritos');
    } else {
      await this.databaseService.addFavorite(this.restaurant);
      this.isFavorite = true;
      await this.toastService.success('Agregado a favoritos');
    }
  }

  openInMaps() {
    if (!this.restaurant) {
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${this.restaurant.lat},${this.restaurant.lon}`;
    window.open(url, '_system');
  }

  call() {
    if (!this.restaurant?.telefono) {
      return;
    }
    window.open(`tel:${this.restaurant.telefono}`, '_system');
  }

  openWebsite() {
    if (!this.restaurant?.website) {
      return;
    }
    window.open(this.restaurant.website, '_system');
  }
}
