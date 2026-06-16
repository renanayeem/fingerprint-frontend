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

  private isLoggingOut = false;
  private sessionSecret: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  setSessionSecret(secret: string): void {
    this.sessionSecret = secret;
  }

  getSessionSecret(): string {
    return this.sessionSecret;
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/profile`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }
    this.isLoggingOut = true;

    this.http.post(`${environment.apiUrl}/logout`, {}).subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        console.error('Logout failed on server, clearing session locally');
        this.clearSession();
      }
    });
  }

  private clearSession(): void {
    this.isLoggingOut = false;
    this.sessionSecret = '';
    this.router.navigate(['/login']);
  }
}