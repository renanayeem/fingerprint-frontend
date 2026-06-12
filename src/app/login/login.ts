import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { FingerprintService } from '../fingerprint.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private fingerprintService: FingerprintService
  ) {}

  async login() {
    this.http.post<{ message: string }>(`${environment.apiUrl}/login`, {
      username: this.username,
      password: this.password,
      fingerprint: this.fingerprintService.getHash()
    }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Invalid credentials!';
        }
      }
    });
  }
}