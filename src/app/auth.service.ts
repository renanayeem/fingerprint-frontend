import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout(): void {
    this.http.post('http://localhost:8080/api/logout', {}).subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        this.clearSession();
      }
    });
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}