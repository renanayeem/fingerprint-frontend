import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  setLoggedIn(): void {
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
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}