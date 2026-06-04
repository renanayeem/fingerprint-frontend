import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  login() {
    const fingerprint = navigator.userAgent + screen.width + screen.height + navigator.language;
    
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