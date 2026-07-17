import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Restaurant } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNearbyRestaurants(lat: number, lon: number): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.baseUrl}/restaurants`, {
      params: { lat, lon }
    });
  }
}
