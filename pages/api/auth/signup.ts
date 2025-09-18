import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { User } from '../../../lib/models/User';

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    const data = signupSchema.parse(req.body);
    if (data.password !== data.passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    const exists = await User.findOne({ email: data.email.toLowerCase() }).lean();
    if (exists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ 
      name: data.name, 
      email: data.email.toLowerCase(), 
      passwordHash, 
      providers: 'password', 
      isVerified: false 
    });
    
    return res.json({ success: true, message: 'Sign up successful!' });
  } catch (e: any) {
    if (e?.issues) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    return res.status(400).json({ error: 'Sign up failed' });
  }
}
