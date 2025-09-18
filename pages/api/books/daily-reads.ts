import type { NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/utils/database';
import { Book } from '../../../lib/models/Book';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  const items = await Book.find({ 
    isDaily: true, 
    isPublished: true, 
    isDeleted: false 
  }).lean();
  
  return res.json({ 
    success: true, 
    data: items, 
    message: 'Books retrieved successfully', 
    error: null 
  });
}
