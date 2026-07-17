import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, star, heart, heartOutline } from 'ionicons/icons';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, IonIcon, IonBadge],
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss']
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
  @Input() isFavorite = false;
  @Output() cardClick = new EventEmitter<Restaurant>();
  @Output() favoriteClick = new EventEmitter<Restaurant>();

  constructor() {
    addIcons({ locationOutline, star, heart, heartOutline });
  }

  onFavoriteClick(event: Event) {
    event.stopPropagation();
    this.favoriteClick.emit(this.restaurant);
  }
}
