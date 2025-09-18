import type { NextApiResponse } from 'next';
import connectToDatabase from '../../../../lib/utils/database';
import { BookReview } from '../../../../lib/models/BookReview';
import { requireAuth, type AuthRequest } from '../../../../lib/middleware/apiAuth';

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  const { bookId } = req.query;
  const reviews = await BookReview.find({ 
    bookId, 
    isPublic: true 
  }).sort({ createdAt: -1 }).lean();
  
  return res.json({ 
    success: true, 
    data: reviews, 
    message: 'Reviews fetched successfully', 
    error: null 
  });
}
