import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  message = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getData() {
    this.http.get('http://localhost:8080/api/data').subscribe({
      next: (res: any) => this.message = res.message,
      error: () => this.message = 'Error getting data!'
    });
  }

  postData() {
    this.http.post('http://localhost:8080/api/data', {}).subscribe({
      next: (res: any) => this.message = res.message,
      error: () => this.message = 'Error posting data!'
    });
  }

  secure() {
    this.http.get('http://localhost:8080/api/secure').subscribe({
      next: (res: any) => this.message = res.message,
      error: () => this.message = 'Access denied!'
    });
  }

  logout() {
    this.authService.logout();
  }
}