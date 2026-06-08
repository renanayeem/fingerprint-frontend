import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  async hashFingerprint(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async login() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const rawFingerprint = result.visitorId;
    const hashedFingerprint = await this.hashFingerprint(rawFingerprint);

    this.http.post('http://localhost:8080/api/login', {
      username: this.username,
      password: this.password,
      fingerprint: hashedFingerprint
    }).subscribe({
      next: (res: any) => {
        this.authService.setToken(res.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Invalid credentials!');
      }
    });
  }
}