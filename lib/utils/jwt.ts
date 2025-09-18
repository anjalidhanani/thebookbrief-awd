import jwt, { type Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'change-me') as Secret;

export function signJwt(payload: object, expiresIn: string | number = '15m') {
  return jwt.sign(payload as any, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}
