import type { NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { User } from '../../../lib/models/User';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

const changePasswordSchema = z.object({ 
  currentPassword: z.string().min(6), 
  newPassword: z.string().min(6), 
  confirmPassword: z.string().min(6) 
});

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  try {
    const data = changePasswordSchema.parse(req.body);
    if (data.newPassword !== data.confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }
    
    const user = await User.findById(req.user!.id);
    if (!user || !user.passwordHash) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password and update
    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
    await User.updateOne({ _id: req.user!.id }, { $set: { passwordHash: newPasswordHash } });
    
    return res.json({ message: 'Password changed successfully' });
  } catch (e: any) {
    if (e?.issues) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    return res.status(400).json({ error: 'There was an error changing the password' });
  }
}
