import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonContent, IonIcon, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bluetoothOutline, radioOutline, checkmarkCircle } from 'ionicons/icons';

import { BluetoothService, BleDevice } from '../../services/bluetooth.service';
import { ToastService } from '../../services/toast.service';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-bluetooth',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonContent, IonIcon, IonButton, IonSpinner, EmptyStateComponent],
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss']
})
export class BluetoothPage {
  devices: BleDevice[] = [];
  scanning = false;
  connectedId: string | null = null;

  constructor(
    private bluetoothService: BluetoothService,
    private toastService: ToastService
  ) {
    addIcons({ bluetoothOutline, radioOutline, checkmarkCircle });
  }

  isSupported(): boolean {
    return this.bluetoothService.isSupported();
  }

  async startScan() {
    if (!this.isSupported()) {
      await this.toastService.info('Bluetooth solo esta disponible en Android o navegadores compatibles con Web Bluetooth');
      return;
    }

    this.devices = [];
    this.scanning = true;

    try {
      await this.bluetoothService.scanDevices((device) => {
        this.devices = [...this.devices, device];
      });

      setTimeout(() => {
        this.scanning = false;
      }, 8200);
    } catch (err: any) {
      console.log('error escaneando bluetooth', err);
      await this.toastService.error('No se pudo iniciar el escaneo de Bluetooth');
      this.scanning = false;
    }
  }

  async connect(device: BleDevice) {
    try {
      await this.bluetoothService.connect(device.deviceId);
      this.connectedId = device.deviceId;
      await this.toastService.success(`Conectado a ${device.name}`);
    } catch (err: any) {
      console.log('error conectando', err);
      await this.toastService.error('No se pudo conectar al dispositivo');
    }
  }

  async disconnect() {
    await this.bluetoothService.disconnect();
    this.connectedId = null;
    await this.toastService.info('Dispositivo desconectado');
  }
}
