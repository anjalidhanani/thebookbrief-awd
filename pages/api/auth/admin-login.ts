import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { User } from '../../../lib/models/User';
import { signJwt } from '../../../lib/utils/jwt';

const adminLoginSchema = z.object({ 
  email: z.string().email(), 
  password: z.string().min(6) 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    const data = adminLoginSchema.parse(req.body);
    const user = await User.findOne({ 
      email: data.email.toLowerCase(),
      role: 'admin'
    });
    
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const token = signJwt({ id: String(user._id) }, '30d');
    return res.json({
      token: { access_token: token },
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (e: any) {
    if (e?.issues) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
}
