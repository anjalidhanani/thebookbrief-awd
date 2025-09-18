import type { NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/utils/database';
import { User } from '../../../lib/models/User';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  const user = await User.findById(req.user!.id).lean();
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  return res.json({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    id: String(user._id),
    providers: user.providers,
    age: user.age,
  });
}
