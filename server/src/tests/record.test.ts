
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

vi.mock('../services/record.service', () => ({
  getRecords: vi.fn(),
  getRecordById: vi.fn()
}));

import app from '../app';
import { getRecords } from '../services/record.service';
import { generateToken } from '../utils/jwt.util';

const mockedGetRecords = vi.mocked(getRecords);

describe('Records API authorization', () => {
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
    const response = await request(app).get('/api/records');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      'Authentication token is required'
    );
  });

  it('should request records for the authenticated general user only', async () => {
    mockedGetRecords.mockResolvedValue([
      {
        title: 'Employee Onboarding',
        status: 'ACTIVE',
        accessLevel: 'READ'
      }
    ] as never);

    const token = generateToken({
      userId: 'user01',
      role: 'GENERAL_USER'
    });

    const response = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);

    expect(mockedGetRecords).toHaveBeenCalledWith({
      userId: 'user01',
      role: 'GENERAL_USER',
      delayMs: 0
    });
  });

  it('should allow an administrator to request records', async () => {
    mockedGetRecords.mockResolvedValue([
      { title: 'Employee Onboarding' },
      { title: 'Project Alpha' }
    ] as never);

    const token = generateToken({
      userId: 'admin01',
      role: 'ADMIN'
    });

    const response = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);

    expect(mockedGetRecords).toHaveBeenCalledWith({
      userId: 'admin01',
      role: 'ADMIN',
      delayMs: 0
    });
  });

  it('should reject a negative delay value', async () => {
    const token = generateToken({
      userId: 'user01',
      role: 'GENERAL_USER'
    });

    const response = await request(app)
      .get('/api/records?delay=-1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Delay must be a non-negative number'
    );
    expect(mockedGetRecords).not.toHaveBeenCalled();
  });
});
