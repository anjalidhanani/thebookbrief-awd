import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthRequest extends NextApiRequest {
  user?: { id: string };
}

export async function requireAuth(req: AuthRequest, res: NextApiResponse): Promise<boolean> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }
  
  const token = header.replace('Bearer ', '').trim();
  const decoded = verifyJwt<{ id: string }>(token);
  if (!decoded) {
    res.status(401).json({ message: 'Invalid token' });
    return false;
  }
  
  const exists = await User.findById(decoded.id).lean();
  if (!exists || exists.isDeleted) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }
  
  req.user = { id: decoded.id };
  return true;
}
