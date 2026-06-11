import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {}

  isLoggedIn(): Observable<boolean> {
    return this.http.get('http://localhost:8080/api/profile').pipe(
      map(() => true),
      catchError(() => of(false))
    );
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