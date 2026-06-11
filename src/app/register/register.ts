import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
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
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error.message || 'Registration failed!');
      }
    });
  }
}