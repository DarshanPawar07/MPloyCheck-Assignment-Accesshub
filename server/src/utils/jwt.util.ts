import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: 'ADMIN' | 'GENERAL_USER';
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return secret;
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: '1d'
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, getJwtSecret()) as TokenPayload;
};