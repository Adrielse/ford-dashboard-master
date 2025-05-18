import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle, VehicleData } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:3000/api'; // Definido diretamente

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`).pipe(
      catchError(() => of([]))
    );
  }

  getVehicleData(vin: string): Observable<VehicleData | null> {
    if (!vin) return of(null);
    return this.http.get<VehicleData>(`${this.apiUrl}/vehicles/data?vin=${vin}`).pipe(
      catchError(() => of(null))
    );
  }

  getVehicleDataByVehicleId(vehicleId: number): Observable<VehicleData | null> {
    if (!vehicleId) return of(null);
    return this.http.get<VehicleData>(`${this.apiUrl}/vehicles/${vehicleId}/data`).pipe(
      catchError(() => of(null))
    );
  }

  searchVehicles(term: string): Observable<Vehicle[]> {
    if (!term) return of([]);
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles/search?term=${term}`).pipe(
      catchError(() => of([]))
    );
  }
}