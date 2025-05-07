import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  openNav(): void {
    document.getElementById("mySidenav")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
  }

  closeNav(): void {
    document.getElementById("mySidenav")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft = "0";
  }
}