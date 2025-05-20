import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle, VehicleData } from '../models/vehicle.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { url } from 'inspector';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  readonly MIN_LOADING_TIME = 800; // Tempo mínimo em milissegundos
  isNavOpen = false;
  errorMessage: string = '';
  searchControl = new FormControl();
  loading = false;
  

  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  vehicleData: VehicleData | null = null;
  searchVin = '';
  
  // Variáveis para exibição
  currentTotalSales = 0;
  connectedVehicles = 0;
  updatedVehicles = 0;

  constructor(
    private vehicleService: VehicleService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();

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
        this.errorMessage = 'Erro ao buscar veículos. Tente novamente.';
      }
    });
  }
// Método para carregar dados iniciais
loadInitialData(): void {
  this.vehicleService.getVehicles().subscribe({
    next: (vehicles) => {
      console.log('Dados recebidos:', vehicles);
      this.vehicles = vehicles;
      this.calculateGeneralMetrics();
      console.log('Métricas calculadas:', {
        sales: this.currentTotalSales,
        updated: this.updatedVehicles
      });
    }
  });
}
// Método para carregar detalhes do veículo
private loadVehicleDetails(vehicleId: number): void {
  this.vehicleService.getVehicleDataByVehicleId(vehicleId).subscribe({
    next: (data) => {
      this.vehicleData = data;
    },
    error: (err) => {
      console.error('Erro ao carregar detalhes:', err);
      this.vehicleData = null;
    }
  });
}


calculateGeneralMetrics(): void {
  this.currentTotalSales = this.vehicles.reduce(
    (sum, v) => sum + (v.total_sales || 0), 
    0
  );
  
  this.connectedVehicles = this.vehicles.reduce(
    (sum, v) => sum + (v.connected || 0), 
    0
  );
  
  this.updatedVehicles = this.vehicles.reduce(
    (sum, v) => sum + (v.software_updated || 0), 
    0
  );
}
  isFullScreenLoading: boolean = false;

 selectVehicle(vehicle: Vehicle | null): void {
  const startTime = Date.now(); 
  this.selectedVehicle = vehicle;
  this.isFullScreenLoading = true;
  
  if (vehicle) {
    this.currentTotalSales = vehicle.total_sales;
    this.connectedVehicles = vehicle.connected;
    this.updatedVehicles = vehicle.software_updated;
    
    if (vehicle.id) {
      this.loadVehicleData(vehicle.id, startTime); 
    } else {
      this.isFullScreenLoading = false;
    }
  } else {
    this.calculateGeneralMetrics();
    this.isFullScreenLoading = false;
  }
}
private loadVehicleData(vehicleId: number, startTime: number): void {
  this.vehicleService.getVehicleDataByVehicleId(vehicleId).subscribe({
    next: (data) => {
      this.vehicleData = data;
      this.handleLoadingEnd(startTime); // Chama a função de finalização
    },
    error: (err) => {
      console.error('Erro ao carregar dados do veículo:', err);
      this.errorMessage = 'Erro ao carregar dados do veículo.';
      this.handleLoadingEnd(startTime);
    }
  });
}
private handleLoadingEnd(startTime: number): void {
  const elapsed = Date.now() - startTime;
  const remainingTime = Math.max(0, this.MIN_LOADING_TIME - elapsed);

  if (remainingTime > 0) {
    setTimeout(() => {
      this.isFullScreenLoading = false;
    }, remainingTime);
  } else {
    this.isFullScreenLoading = false;
  }
}
searchVehicleData(): void {
  this.errorMessage = '';
  
  if (!this.searchVin) {
    this.errorMessage = 'VIN inválido';
    return;
  }

  const formattedVin = this.formatVin(this.searchVin);
  
  this.vehicleService.getVehicleData(formattedVin).subscribe({
    next: (data) => {
      if (data) {
        this.vehicleData = data;
        console.log('Dados recebidos:', data); // Adicione para debug
        
        // Atualiza métricas se encontrar veículo correspondente
        const vehicle = this.vehicles.find(v => 
          this.getVinPrefix(v.model) === formattedVin.substring(0, 3));
        if (vehicle) {
          this.selectVehicle(vehicle);
        }
      } else {
        this.errorMessage = 'VIN não encontrado';
        this.vehicleData = null;
      }
    },
    error: (err) => {
      console.error('Erro ao buscar VIN:', err);
      this.errorMessage = 'Erro na busca por VIN';
    }
  });
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

  private formatVin(vin: string): string {
    return vin.trim().toUpperCase();
  }

  // Métodos de navegação mantidos
  openNav() { this.isNavOpen = true; }
  closeNav() { this.isNavOpen = false; }
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
  home(): void {
    this.router.navigate(['/home']);
  }
  openApi(): void{
 window.open('https://github.com/Adrielse/ford-backend.git', '_blank');
  }
}