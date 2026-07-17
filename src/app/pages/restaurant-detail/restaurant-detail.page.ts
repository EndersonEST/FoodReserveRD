import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import {
  locationOutline,
  callOutline,
  globeOutline,
  mapOutline,
  heart,
  heartOutline,
  pricetagOutline
} from 'ionicons/icons';

import * as L from 'leaflet';
import 'leaflet-routing-machine';

import { DatabaseService } from '../../services/database.service';
import { ToastService } from '../../services/toast.service';
import { GeolocationService } from '../../services/geolocation.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonIcon,
    IonButton
  ],
  templateUrl: './restaurant-detail.page.html',
  styleUrls: ['./restaurant-detail.page.scss']
})
export class RestaurantDetailPage implements OnInit, AfterViewInit {

  restaurant: Restaurant | null = null;
  isFavorite = false;

  private map!: L.Map;
  private routingControl: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private databaseService: DatabaseService,
    private toastService: ToastService,
    private geolocationService: GeolocationService
  ) {

    addIcons({
      locationOutline,
      callOutline,
      globeOutline,
      mapOutline,
      heart,
      heartOutline,
      pricetagOutline
    });

  }

  async ngOnInit() {

  const navigation = this.router.getCurrentNavigation();

  const stateRestaurant = (
  navigation?.extras?.state?.['restaurant'] ??
  history.state?.restaurant
) as Restaurant | null;

  if (!stateRestaurant) {
    return;
  }

  this.restaurant = stateRestaurant;

  this.isFavorite = await this.databaseService.isFavorite(
    this.restaurant.id
  );

  await this.databaseService.addVisited(
    this.restaurant
  );

}

  async ngAfterViewInit() {

  await new Promise(resolve => setTimeout(resolve, 500));

  if (this.restaurant) {
    await this.loadMap();
  }

}

  async loadMap() {

    if (!this.restaurant) {
      return;
    }

    const coords =
      await this.geolocationService.getCurrentPosition();

    this.map = L.map('map').setView(
      [coords.lat, coords.lon],
      14
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap'
      }
    ).addTo(this.map);
    setTimeout(() => {
  this.map.invalidateSize();
}, 300);

    

// Punto azul de mi ubicación
L.circleMarker([coords.lat, coords.lon], {
  radius: 8,
  color: '#ffffff',
  weight: 3,
  fillColor: '#1a73e8',
  fillOpacity: 1
})
.addTo(this.map)
.bindPopup('Tu ubicación');

// Pin del restaurante
L.marker([
  this.restaurant.lat,
  this.restaurant.lon
])
.addTo(this.map)
.bindPopup(this.restaurant.nombre);

// Ruta
this.routingControl = (L as any).Routing.control({

  waypoints: [
    L.latLng(coords.lat, coords.lon),
    L.latLng(this.restaurant.lat, this.restaurant.lon)
  ],

  addWaypoints: false,
  draggableWaypoints: false,
  fitSelectedRoutes: true,
  routeWhileDragging: false,
  show: false,
  collapsible: true,

  // No crear marcadores automáticos
  createMarker: () => null

}).addTo(this.map);

const container = this.routingControl.getContainer();
if (container) {
  container.style.display = 'none';
}

  }

  async toggleFavorite() {

    if (!this.restaurant) {
      return;
    }

    if (this.isFavorite) {

      await this.databaseService.removeFavorite(
        this.restaurant.id
      );

      this.isFavorite = false;

      await this.toastService.info(
        'Eliminado de favoritos'
      );

    } else {

      await this.databaseService.addFavorite(
        this.restaurant
      );

      this.isFavorite = true;

      await this.toastService.success(
        'Agregado a favoritos'
      );

    }

  }

  call() {

    if (!this.restaurant?.telefono) {
      return;
    }

    window.open(
      `tel:${this.restaurant.telefono}`,
      '_system'
    );

  }

  openWebsite() {

    if (!this.restaurant?.website) {
      return;
    }

    window.open(
      this.restaurant.website,
      '_system'
    );

  }
async mostrarRuta() {

  if (!this.map) {
    await this.loadMap();
  }

}
}