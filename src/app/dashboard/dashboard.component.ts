import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle, VehicleData } from '../models/vehicle.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchControl = new FormControl();
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  vehicleData: VehicleData | null = null;
  searchVin = '';
  
  totalSales = 0;
  connectedVehicles = 0;
  updatedVehicles = 0;

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.vehicleService.searchVehicles(term))
    ).subscribe(vehicles => {
      this.vehicles = vehicles;
    });

    this.loadInitialData();
  }

  loadInitialData(): void {
    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.vehicles = vehicles;
      this.calculateMetrics(vehicles);
    });
  }

  calculateMetrics(vehicles: Vehicle[]): void {
    this.totalSales = vehicles.length;
    this.connectedVehicles = vehicles.filter(v => v.connected).length;
    this.updatedVehicles = vehicles.filter(v => v.softwareUpdated).length;
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    // Atualizar métricas baseadas no veículo selecionado
    this.totalSales = 1;
    this.connectedVehicles = vehicle.connected ? 1 : 0;
    this.updatedVehicles = vehicle.softwareUpdated ? 1 : 0;
  }

  searchVehicleData(): void {
    if (this.searchVin) {
      this.vehicleService.getVehicleData(this.searchVin).subscribe(data => {
        this.vehicleData = data;
      });
    }
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}