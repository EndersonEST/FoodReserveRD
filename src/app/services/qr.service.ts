import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export type QrResultType = 'url' | 'coords' | 'restaurant' | 'text';

export interface QrResult {
  type: QrResultType;
  raw: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class QrService {
  isSupported(): boolean {
    return Capacitor.isNativePlatform();
  }

  async checkPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    const { camera } = await BarcodeScanner.checkPermissions();
    if (camera === 'granted') {
      return true;
    }

    const request = await BarcodeScanner.requestPermissions();
    return request.camera === 'granted';
  }

  async scan(): Promise<QrResult | null> {
    const granted = await this.checkPermission();
    if (!granted) {
      throw new Error('permiso de camara denegado');
    }

    const { barcodes } = await BarcodeScanner.scan();

    if (!barcodes || barcodes.length === 0) {
      return null;
    }

    const raw = barcodes[0].rawValue;
    return this.parseResult(raw);
  }

  parseResult(raw: string): QrResult {
    if (/^https?:\/\//i.test(raw)) {
      return { type: 'url', raw };
    }

    const coordsMatch = raw.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    if (coordsMatch) {
      return {
        type: 'coords',
        raw,
        data: { lat: parseFloat(coordsMatch[1]), lon: parseFloat(coordsMatch[3]) }
      };
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.nombre && parsed.lat && parsed.lon) {
        return { type: 'restaurant', raw, data: parsed };
      }
    } catch {
    }

    return { type: 'text', raw };
  }
}
