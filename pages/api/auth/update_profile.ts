import type { NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { User } from '../../../lib/models/User';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

const updateProfileSchema = z.object({ 
  name: z.string().min(1), 
  age: z.union([z.number().int().min(0), z.string()]).optional() 
});

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  try {
    const data = updateProfileSchema.parse(req.body);
    await User.updateOne({ _id: req.user!.id }, { $set: { name: data.name, age: data.age as any } });
    return res.json({ message: 'Profile updated successfully' });
  } catch {
    return res.status(400).json({ error: 'There was an error updating the profile' });
  }
}
