import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyJwt } from '../utils/jwt';
import { User, UserDocument } from '../models/User';

export interface AuthRequest extends NextApiRequest {
  user?: { id: string; role?: string };
}

export async function requireAuth(req: AuthRequest, res: NextApiResponse, next: () => void) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = header.replace('Bearer ', '').trim();
  const decoded = verifyJwt<{ id: string }>(token);
  if (!decoded) return res.status(401).json({ message: 'Invalid token' });
  const exists = await User.findById(decoded.id).lean() as UserDocument | null;
  if (!exists || exists.isDeleted) return res.status(401).json({ message: 'Unauthorized' });
  req.user = { id: decoded.id, role: exists.role };
  next();
}

export async function requireAdmin(req: AuthRequest, res: NextApiResponse, next: () => void) {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
}
