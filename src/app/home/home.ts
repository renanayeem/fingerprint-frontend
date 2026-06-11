import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  message = '';
  vehicles: any[] = [];
  showAddForm = false;
  newVehicle = { vehicleName: '', vehicleNumber: '', vehicleType: '' };

  constructor(private http: HttpClient, private authService: AuthService) {}

  getData() {
    this.http.get(`${environment.apiUrl}/vehicles`).subscribe({
      next: (res: any) => {
        this.vehicles = res;
        this.message = '';
      },
      error: () => this.message = 'Error loading vehicles!'
    });
  }

  postData() {
    this.showAddForm = true;
  }

  addVehicle() {
    this.http.post(`${environment.apiUrl}/vehicles`, this.newVehicle).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.showAddForm = false;
        this.newVehicle = { vehicleName: '', vehicleNumber: '', vehicleType: '' };
        this.http.get(`${environment.apiUrl}/vehicles`).subscribe({
          next: (res: any) => {
            this.vehicles = res;
          }
        });
      },
      error: () => this.message = 'Error adding vehicle!'
    });
  }

  secure() {
    this.vehicles = [];
    this.showAddForm = false;
    this.http.get(`${environment.apiUrl}/secure`).subscribe({
      next: (res: any) => {
        this.message = res.message;
      },
      error: () => this.message = 'Access denied!'
    });
  }

  logout() {
    this.authService.logout();
  }
}