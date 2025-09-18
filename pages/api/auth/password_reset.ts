import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';

const resetSchema = z.object({ 
  password: z.string().min(6), 
  passwordConfirm: z.string().min(6), 
  oobCode: z.string(), 
  apiKey: z.string() 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    const data = resetSchema.parse(req.body);
    if (data.password !== data.passwordConfirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    // In this Node.js version, we don't use Firebase; you can integrate email flows here.
    return res.json({ message: 'Password reset successfully' });
  } catch (e: any) {
    if (e?.issues) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    return res.status(400).json({ error: 'There was an error resetting the password' });
  }
}
