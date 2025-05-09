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
      openNav(): void {
    document.getElementById("mySidenav")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
  }

  closeNav(): void {
    document.getElementById("mySidenav")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft = "0";
  }
  searchControl = new FormControl();
  vehicles: Vehicle[] = [
    {
      id: 1,
      model: 'Territory',
      year: 2023,
      price: 250000,
      connected: 133,
      softwareUpdated: 112,
      imageUrl: '/images/territory.png',
      totalSales: 856 
    },
    {
      id: 2,
      model: 'Mustang',
      year: 2023,
      price: 350000,
      connected: 421,
      softwareUpdated: 120,
      imageUrl: '/images/mustang.png',
      totalSales: 432 
    },
    {
      id: 3,
      model: 'Bronco',
      year: 2023,
      price: 300000,
      connected: 202,
      softwareUpdated: 112,
      imageUrl: '/images/broncoSport.png',
      totalSales: 255 
    }
  ];
  
  selectedVehicle: Vehicle | null = null;
  vehicleData: VehicleData | null = null;
  searchVin = '';
  
  // Variáveis para exibição
  currentTotalSales = 0;
  connectedVehicles = 0;
  updatedVehicles = 0;

  
  vehicleDataList: VehicleData[] = [
    {
      vin: '2FRHDUYS2Y63NHD22454',
      odometer: 12500,
      tirePressure: '32 psi',
      status: 'on',
      batteryStatus: 'Carregado',
      fuelLevel: 78,
      lat: -23.5505,
      long: -46.6333
    },
    {
      vin: '1FM5K8D84HGA12345',
      odometer: 8700,
      tirePressure: '34 psi',
      status: 'off',
      batteryStatus: 'Carregando',
      fuelLevel: 45,
      lat: -22.9068,
      long: -43.1729
    },
    {
      vin: '3GNAXHEV5JL123456',
      odometer: 15300,
      tirePressure: '31 psi',
      status: 'on',
      batteryStatus: 'Descarga',
      fuelLevel: 22,
      lat: -34.6037,
      long: -58.3816
    }
  ];

  constructor(
    private vehicleService: VehicleService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.calculateGeneralMetrics();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.vehicleService.searchVehicles(term))
    ).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.calculateGeneralMetrics();
      },
      error: (err) => {
        console.error('Erro ao buscar veículos:', err);
        this.calculateGeneralMetrics();
      }
    });
  }

  loadInitialData(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles.length > 0 ? vehicles : this.vehicles;
        this.calculateGeneralMetrics();
      },
      error: (err) => {
        console.error('Erro ao carregar veículos:', err);
        this.calculateGeneralMetrics();
      }
    });
  }

  calculateGeneralMetrics(): void {

    this.currentTotalSales = this.vehicles.reduce((sum, v) => sum + (v.totalSales || 0), 0);
    this.connectedVehicles = this.vehicles.reduce((sum, v) => sum + (v.connected || 0), 0);
    this.updatedVehicles = this.vehicles.reduce((sum, v) => sum + (v.softwareUpdated || 0), 0);
  }

  selectVehicle(vehicle: Vehicle | null): void {
    this.selectedVehicle = vehicle;
    
    if (vehicle) {
      // Mostra os dados específicos do veículo selecionado
      this.currentTotalSales = vehicle.totalSales;
      this.connectedVehicles = vehicle.connected;
      this.updatedVehicles = vehicle.softwareUpdated;
      
      // Encontra os dados do veículo correspondente
      this.vehicleData = this.vehicleDataList.find(vd => 
        vd.vin.startsWith(this.getVinPrefix(vehicle.model))) || null;
    } else {
     
      this.calculateGeneralMetrics();
    }
  }

  // Helper para gerar prefixo de VIN baseado no modelo
  private getVinPrefix(model: string): string {
    switch(model.toLowerCase()) {
      case 'territory': return '2FR';
      case 'mustang': return '1FM';
      case 'bronco': return '3GN';
      default: return '';
    }
  }

  searchVehicleData(): void {
    if (!this.searchVin) {
      alert('Por favor, insira um código VIN válido');
      return;
    }

    const formattedVin = this.formatVin(this.searchVin);
    

    setTimeout(() => {
      const foundData = this.vehicleDataList.find(vd => vd.vin === formattedVin);
      if (foundData) {
        this.vehicleData = foundData;
   
        const vehicle = this.vehicles.find(v => 
          this.getVinPrefix(v.model) === formattedVin.substring(0, 3));
        if (vehicle) {
          this.selectVehicle(vehicle);
        }
      } else {
        alert('VIN não encontrado');
        this.vehicleData = null;
      }
    }, 500);
  }

  private formatVin(vin: string): string {
    return vin.trim().toUpperCase();
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
 home(): void {
    this.router.navigate(['/home']);
  }
}


