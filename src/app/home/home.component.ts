import { Component, HostListener, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle, VehicleData } from '../models/vehicle.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,AfterViewInit {
   errorMessage: string = '';
    isNavOpen = false;
  searchControl = new FormControl();
    vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  vehicleData: VehicleData | null = null;
  searchVin = '';
  
  // Variáveis para exibição
  currentTotalSales = 0;
  connectedVehicles = 0;
  updatedVehicles = 0;

scrollToSection(sectionId: string) {
  const element = document.querySelector(`.${sectionId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

  constructor(
        private vehicleService: VehicleService,
    public router: Router
  ) {}

 logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }


  openNav() {
    this.isNavOpen = true;
  }

  closeNav() {
    this.isNavOpen = false;
  }
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
  ngAfterViewInit(): void {
    this.checkVisibility();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.checkVisibility();
  }
@ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  private checkVisibility(): void {
    const windowHeight = window.innerHeight;
    
    this.fadeElements.forEach((elementRef: ElementRef) => {
      const element = elementRef.nativeElement;
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  }
  
currentSlide = 0;
totalSlides = 3; // Atualize conforme o número de slides

navigateToDashboard(): void {
  // Substitua pelo seu método de navegação
  this.router.navigate(['/dashboard']);
}

nextSlide(): void {
  this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
}

prevSlide(): void {
  this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;

}
}



  
