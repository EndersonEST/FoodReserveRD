import { Injectable } from '@angular/core';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

export interface BleDevice {
  deviceId: string;
  name: string;
  rssi?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  private scanning = false;
  private connectedDeviceId: string | null = null;

  isSupported(): boolean {
    return Capacitor.isNativePlatform() || 'bluetooth' in navigator;
  }

  async initialize(): Promise<void> {
    await BleClient.initialize({ androidNeverForLocation: true });
  }

  async scanDevices(onDevice: (device: BleDevice) => void, timeoutMs = 8000): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('bluetooth no soportado en este dispositivo o navegador');
    }

    await this.initialize();

    this.scanning = true;
    const seen = new Set<string>();

    await BleClient.requestLEScan({}, (result: ScanResult) => {
      if (seen.has(result.device.deviceId)) {
        return;
      }
      seen.add(result.device.deviceId);
      onDevice({
        deviceId: result.device.deviceId,
        name: result.device.name || result.localName || 'Dispositivo desconocido',
        rssi: result.rssi
      });
    });

    setTimeout(async () => {
      if (this.scanning) {
        await this.stopScan();
      }
    }, timeoutMs);
  }

  async stopScan(): Promise<void> {
    if (!this.scanning) {
      return;
    }
    await BleClient.stopLEScan();
    this.scanning = false;
  }

  async connect(deviceId: string): Promise<void> {
    await BleClient.connect(deviceId, () => {
      this.connectedDeviceId = null;
    });
    this.connectedDeviceId = deviceId;
  }

  async disconnect(): Promise<void> {
    if (!this.connectedDeviceId) {
      return;
    }
    await BleClient.disconnect(this.connectedDeviceId);
    this.connectedDeviceId = null;
  }

  getConnectedDeviceId(): string | null {
    return this.connectedDeviceId;
  }
}
