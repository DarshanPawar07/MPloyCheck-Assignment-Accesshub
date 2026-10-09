
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import request from 'supertest';

vi.mock('../services/user.service', () => ({
  getAllUsers: vi.fn(),
  getUserById: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  updateUserStatus: vi.fn()
}));

import app from '../app';
import { getAllUsers } from '../services/user.service';
import { generateToken } from '../utils/jwt.util';

const mockedGetAllUsers = vi.mocked(getAllUsers);

describe('Users API authorization', () => {
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

  it('should reject requests without a token', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      'Authentication token is required'
    );
  });

  it('should deny a general user access to the users endpoint', async () => {
    const token = generateToken({
      userId: 'user01',
      role: 'GENERAL_USER'
    });

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('ADMIN access required');
    expect(mockedGetAllUsers).not.toHaveBeenCalled();
  });

  it('should allow an administrator to list users', async () => {
    mockedGetAllUsers.mockResolvedValue([
      {
        userId: 'user01',
        name: 'Rahul Sharma',
        role: 'GENERAL_USER',
        status: 'ACTIVE'
      }
    ] as never);

    const token = generateToken({
      userId: 'admin01',
      role: 'ADMIN'
    });

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(mockedGetAllUsers).toHaveBeenCalledOnce();
  });

  it('should reject an invalid token', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
