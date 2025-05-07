import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.username === 'admin' && this.password === '123456') {
      localStorage.setItem('isLoggedIn', 'true');
      if (this.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Usuário ou senha incorretos';
    }
  }
}