import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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

  constructor(private router: Router, private http: HttpClient) {}

  async login() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    this.http.post('http://localhost:8080/api/login', {
      username: this.username,
      password: this.password,
      fingerprint: fingerprint
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('fingerprint', fingerprint);
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Invalid credentials!');
      }
    });
  }
}