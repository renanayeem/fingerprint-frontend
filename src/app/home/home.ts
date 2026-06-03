import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  message = '';

  constructor(private http: HttpClient) {}

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
}