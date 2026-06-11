import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {}

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/profile`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/logout`, {}).subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        console.error('Logout failed on server, session not cleared');
      }
    });
  }

  private clearSession(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}