
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Auth } from '../../core/services/auth';
import { Record } from '../../core/services/record';
import { AuthUser } from '../../shared/models/auth.model';
import { AccessRecord } from '../../shared/models/record.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  user: AuthUser | null = null;
  records: AccessRecord[] = [];

  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private recordService: Record,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadRecords();
  }

  loadRecords(): void {
    console.log('[Dashboard] Loading records...');

    this.isLoading = true;
    this.errorMessage = '';

    this.recordService.getRecords().subscribe({
      next: (response) => {
        console.log('[Dashboard] API response:', response);

        this.records = response.data ?? [];
        this.isLoading = false;

        this.cdr.detectChanges();

        console.log('[Dashboard] Records:', this.records.length);
        console.log('[Dashboard] isLoading:', this.isLoading);
      },

      error: (error: HttpErrorResponse) => {
        console.error('[Dashboard] API error:', error);

        this.isLoading = false;
        this.errorMessage =
          error.error?.message ??
          'We could not load your records. Please try again.';

        this.cdr.detectChanges();
      }
    });
  }

  get activeCount(): number {
    return this.records.filter(
      (record) => record.status === 'ACTIVE'
    ).length;
  }

  get inactiveCount(): number {
    return this.records.filter(
      (record) => record.status === 'INACTIVE'
    ).length;
  }

  get writeAccessCount(): number {
    return this.records.filter(
      (record) => record.accessLevel === 'WRITE'
    ).length;
  }

  get firstName(): string {
    return this.user?.name?.trim().split(/\s+/)[0] || 'there';
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

  formatDate(date: string): string {
    if (!date) {
      return '—';
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
