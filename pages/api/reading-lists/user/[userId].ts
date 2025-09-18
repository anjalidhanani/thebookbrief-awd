import type { NextApiResponse } from 'next';
import connectToDatabase from '../../../../lib/utils/database';
import { ReadingList } from '../../../../lib/models/ReadingList';
import { requireAuth, type AuthRequest } from '../../../../lib/middleware/apiAuth';

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  const { userId } = req.query;
  const lists = await ReadingList.find({ userId }).sort({ createdAt: -1 }).lean();
  
  return res.json({ 
    success: true, 
    data: lists, 
    message: 'User reading lists fetched successfully', 
    error: null 
  });
}
