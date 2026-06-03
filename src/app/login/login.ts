import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === 'admin') {
      const fingerprint = navigator.userAgent + screen.width + screen.height + navigator.language;
      localStorage.setItem('fingerprint', fingerprint);
      this.router.navigate(['/home']);
    } else {
      alert('Invalid credentials!');
    }
  }
}