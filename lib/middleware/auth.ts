import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthRequest extends NextApiRequest {
  user?: { id: string };
}

export async function requireAuth(req: AuthRequest, res: NextApiResponse, next: () => void) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = header.replace('Bearer ', '').trim();
  const decoded = verifyJwt<{ id: string }>(token);
  if (!decoded) return res.status(401).json({ message: 'Invalid token' });
  const exists = await User.findById(decoded.id).lean();
  if (!exists || exists.isDeleted) return res.status(401).json({ message: 'Unauthorized' });
  req.user = { id: decoded.id };
  next();
}
