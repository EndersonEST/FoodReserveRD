import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() icon = 'restaurant-outline';
  @Input() title = 'Nada por aqui';
  @Input() message = '';
}
