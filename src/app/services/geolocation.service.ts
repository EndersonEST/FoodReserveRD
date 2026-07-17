import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
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

    // Si estamos en navegador (ionic serve)
    if (!Capacitor.isNativePlatform()) {

      return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {
          reject('Geolocalización no soportada');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          err => reject(err),
          {
            enableHighAccuracy: true
          }
        );

      });

    }

    // Android / iOS
    const permission = await Geolocation.checkPermissions();

    if (permission.location !== 'granted') {

      const request = await Geolocation.requestPermissions();

      if (request.location !== 'granted') {
        throw new Error('Permiso denegado');
      }

    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });

    return {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    };
  }

}