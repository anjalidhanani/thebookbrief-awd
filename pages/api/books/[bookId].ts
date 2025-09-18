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

  const { bookId } = req.query;
  const item = await Book.findOne({ id: bookId });
  
  if (!item) {
    return res.status(400).json({ message: 'No book found' });
  }
  
  if (!item.isPublished) {
    return res.status(400).json({ message: 'Book is not published yet' });
  }
  
  if (item.isPublished && item.isFree) {
    return res.json({ 
      success: true, 
      data: item, 
      message: 'Book retrieved successfully', 
      error: null 
    });
  }
  
  return res.json({ 
    success: true, 
    data: { ...item.toObject(), chapter: [] }, 
    message: 'Book retrieved successfully', 
    error: 'Book is not available for free' 
  });
}
