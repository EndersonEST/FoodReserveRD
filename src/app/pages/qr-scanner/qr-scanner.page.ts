import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonContent, IonIcon, IonButton, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline, scanOutline } from 'ionicons/icons';

import { QrService, QrResult } from '../../services/qr.service';
import { ToastService } from '../../services/toast.service';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonContent, IonIcon, IonButton],
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss']
})
export class QrScannerPage {
  scanning = false;
  lastResult: QrResult | null = null;

  constructor(
    private qrService: QrService,
    private toastService: ToastService,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({ qrCodeOutline, scanOutline });
  }

  isSupported(): boolean {
    return this.qrService.isSupported();
  }

  async startScan() {
    if (!this.isSupported()) {
      await this.toastService.info('El escaner de QR solo esta disponible en la app instalada en Android');
      return;
    }

    this.scanning = true;

    try {
      const result = await this.qrService.scan();
      this.lastResult = result;

      if (result) {
        await this.handleResult(result);
      }
    } catch (err: any) {
      console.log('error escaneando qr', err);
      await this.toastService.error('No se pudo escanear el codigo QR');
    } finally {
      this.scanning = false;
    }
  }

  private async handleResult(result: QrResult) {
    switch (result.type) {
      case 'url':
        window.open(result.raw, '_system');
        break;

      case 'coords': {
        const url = `https://www.google.com/maps/search/?api=1&query=${result.data.lat},${result.data.lon}`;
        window.open(url, '_system');
        break;
      }

      case 'restaurant':
        this.router.navigate(['/restaurant', result.data.id || 'qr'], { state: { restaurant: result.data as Restaurant } });
        break;

      case 'text': {
        const alert = await this.alertCtrl.create({
          header: 'Contenido del QR',
          message: result.raw,
          buttons: ['Cerrar']
        });
        await alert.present();
        break;
      }
    }
  }
}
