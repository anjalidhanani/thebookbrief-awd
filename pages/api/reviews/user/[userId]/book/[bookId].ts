import type { NextApiResponse } from 'next';
import connectToDatabase from '../../../../../../lib/utils/database';
import { BookReview } from '../../../../../../lib/models/BookReview';
import { requireAuth, type AuthRequest } from '../../../../../../lib/middleware/apiAuth';

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  const { userId, bookId } = req.query;
  const review = await BookReview.findOne({ userId, bookId });
  
  if (!review) {
    return res.status(404).json({ 
      success: false, 
      data: null, 
      message: 'Review not found', 
      error: null 
    });
  }
  
  return res.json({ 
    success: true, 
    data: review, 
    message: 'Review retrieved successfully', 
    error: null 
  });
}
