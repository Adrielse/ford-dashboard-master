import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Vehicle, VehicleData } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicle`);
  }

  getVehicleData(vin: string): Observable<VehicleData> {
    return this.http.get<VehicleData>(`${this.apiUrl}/vehicleData?vin=${vin}`);
  }

  searchVehicles(term: string): Observable<Vehicle[]> {
    return this.getVehicles().pipe(
      map(vehicles => vehicles.filter(vehicle => 
        vehicle.model.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }
}