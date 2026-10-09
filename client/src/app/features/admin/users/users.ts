
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { environment } from '../../../../environments/environment';

interface AdminUser {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GENERAL_USER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

interface UsersResponse {
  success: boolean;
  message?: string;
  data: AdminUser[];
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  users: AdminUser[] = [];

  isLoading = true;
  errorMessage = '';

  searchTerm = '';
  selectedRole = 'ALL';
  selectedStatus = 'ALL';

  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('[Users] Loading users...');

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.http.get<UsersResponse>(this.apiUrl).subscribe({
      next: (response) => {
        console.log('[Users] API response:', response);

        this.users = response.data ?? [];
        this.isLoading = false;

        this.cdr.detectChanges();

        console.log('[Users] User count:', this.users.length);
        console.log('[Users] isLoading:', this.isLoading);
      },

      error: (error: HttpErrorResponse) => {
        console.error('[Users] API error:', error);

        this.isLoading = false;
        this.errorMessage =
          error.error?.message ??
          'We could not load users. Please try again.';

        this.cdr.detectChanges();
      }
    });
  }

  get filteredUsers(): AdminUser[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.userId.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);

      const matchesRole =
        this.selectedRole === 'ALL' ||
        user.role === this.selectedRole;

      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        user.status === this.selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  get activeCount(): number {
    return this.users.filter(
      (user) => user.status === 'ACTIVE'
    ).length;
  }

  get inactiveCount(): number {
    return this.users.filter(
      (user) => user.status === 'INACTIVE'
    ).length;
  }

  get adminCount(): number {
    return this.users.filter(
      (user) => user.role === 'ADMIN'
    ).length;
  }

  getInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  formatRole(role: string): string {
    return role === 'ADMIN' ? 'Administrator' : 'General user';
  }

  formatDate(date?: string): string {
    if (!date) {
      return '—';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '—';
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(parsedDate);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = 'ALL';
    this.selectedStatus = 'ALL';
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
