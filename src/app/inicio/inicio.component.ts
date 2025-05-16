import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
}) 

export class InicioComponent {
  constructor(
    public router: Router
  ) {}


Openlogica(): void{
  this.router.navigate(['/logica']);

}
}
