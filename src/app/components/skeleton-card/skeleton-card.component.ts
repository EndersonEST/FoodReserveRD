import { Component } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [IonSkeletonText],
  templateUrl: './skeleton-card.component.html',
  styleUrls: ['./skeleton-card.component.scss']
})
export class SkeletonCardComponent {}
