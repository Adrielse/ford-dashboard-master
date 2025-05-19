import { Component, HostListener, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,AfterViewInit {
scrollToSection(sectionId: string) {
  const element = document.querySelector(`.${sectionId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

  constructor(
    public router: Router
  ) {}

 logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
 
 isNavOpen = false;

  openNav() {
    this.isNavOpen = true;
  }

  closeNav() {
    this.isNavOpen = false;
  }
   ngOnInit(): void {
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




  
