import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  username: string | null = null;
  name: string | null = null;
  email: string | null = null;
  phone: string | null = null;
  address: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http.get('http://localhost:8080/api/profile').subscribe({
      next: (res: any) => {
        this.username = res.username;
        this.name = res.name;
        this.email = res.email;
        this.phone = res.phone;
        this.address = res.address;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Profile error:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}