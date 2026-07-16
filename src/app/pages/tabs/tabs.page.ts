import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, heart, qrCode, bluetooth, homeOutline, heartOutline, qrCodeOutline, bluetoothOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage {
  constructor() {
    addIcons({ home, heart, qrCode, bluetooth, homeOutline, heartOutline, qrCodeOutline, bluetoothOutline });
  }
}
