
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

vi.mock('../services/auth.service', () => ({
  loginUser: vi.fn()
}));

import app from '../app';
import { loginUser } from '../services/auth.service';

const mockedLoginUser = vi.mocked(loginUser);

describe('Authentication API', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'accesshub-test-secret';
  });

  afterAll(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should reject login when required fields are missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ userId: 'user01' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(mockedLoginUser).not.toHaveBeenCalled();
  });

  it('should reject an invalid role', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        userId: 'user01',
        password: 'User@123',
        role: 'SUPER_ADMIN'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid role');
    expect(mockedLoginUser).not.toHaveBeenCalled();
  });

  it('should return a token when login succeeds', async () => {
    mockedLoginUser.mockResolvedValue({
      token: 'test-jwt-token',
      user: {
        userId: 'user01',
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        role: 'GENERAL_USER',
        status: 'ACTIVE'
      }
    } as never);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        userId: 'user01',
        password: 'User@123',
        role: 'GENERAL_USER'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBe('test-jwt-token');

    expect(mockedLoginUser).toHaveBeenCalledWith({
      userId: 'user01',
      password: 'User@123',
      role: 'GENERAL_USER'
    });
  });

  it('should reject invalid credentials', async () => {
    mockedLoginUser.mockRejectedValue(
      new Error('Invalid User ID, password, or role')
    );

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        userId: 'user01',
        password: 'WrongPassword',
        role: 'GENERAL_USER'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
