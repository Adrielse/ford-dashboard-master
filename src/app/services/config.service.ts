// src/app/core/services/config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = {
    apiUrl: 'http://localhost:3000/api' // Desenvolvimento
  
  };

  getConfig() {
    return this.config;
  }
}