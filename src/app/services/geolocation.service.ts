import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

export interface Coords {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  async getCurrentPosition(): Promise<Coords> {
    const permission = await Geolocation.checkPermissions();

    if (permission.location !== 'granted') {
      const request = await Geolocation.requestPermissions();
      if (request.location !== 'granted') {
        throw new Error('permiso de ubicacion denegado');
      }
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    });

    return {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    };
  }
}
