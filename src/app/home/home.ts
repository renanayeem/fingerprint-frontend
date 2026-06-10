import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  getData() {
    this.http.get('http://localhost:8080/api/vehicles').subscribe({
      next: (res: any) => {
        this.vehicles = res;
        this.message = '';
        this.cdr.detectChanges();
      },
      error: () => this.message = 'Error loading vehicles!'
    });
  }

  postData() {
    this.showAddForm = true;
    this.cdr.detectChanges();
  }

  addVehicle() {
    this.http.post('http://localhost:8080/api/vehicles', this.newVehicle).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.showAddForm = false;
        this.newVehicle = { vehicleName: '', vehicleNumber: '', vehicleType: '' };
        this.http.get('http://localhost:8080/api/vehicles').subscribe({
          next: (res: any) => {
            this.vehicles = res;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => this.message = 'Error adding vehicle!'
    });
  }

  secure() {
  this.vehicles = [];
  this.showAddForm = false;
  this.http.get('http://localhost:8080/api/secure').subscribe({
    next: (res: any) => {
      this.message = res.message;
      this.cdr.detectChanges();
    },
    error: () => this.message = 'Access denied!'
  });
}
  logout() {
    this.authService.logout();
  }
}