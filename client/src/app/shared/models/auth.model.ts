export type UserRole = 'ADMIN' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface AuthUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
