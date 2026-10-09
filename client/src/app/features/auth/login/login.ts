import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { LoginResponse } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  userId = '';
  password = '';
  role: 'GENERAL_USER' | 'ADMIN' = 'GENERAL_USER';

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.userId.trim() || !this.password) {
      this.errorMessage = 'Please enter your User ID and password.';
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.authService.login({
      userId: this.userId.trim(),
      password: this.password,
      role: this.role
    }).subscribe({
      next: (response: LoginResponse) => {
        this.isLoading = false;

        if (response.data.user.role === 'ADMIN') {
          void this.router.navigate(['/admin/users']);
        } else {
          void this.router.navigate(['/dashboard']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        this.errorMessage =
          error.error?.message ||
          'Unable to sign in. Please check your credentials and try again.';
      }
    });
  }
}