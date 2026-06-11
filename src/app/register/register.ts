import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  password = '';
  name = '';
  email = '';
  phone = '';
  address = '';
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  register() {
    this.http.post(`${environment.apiUrl}/register`, {
      username: this.username,
      password: this.password,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address
    }).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Please login.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registration failed!';
        this.successMessage = '';
      }
    });
  }
}