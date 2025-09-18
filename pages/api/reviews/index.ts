import type { NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { BookReview } from '../../../lib/models/BookReview';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

const reviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bookId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  isPublic: z.boolean().optional()
});

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  try {
    const reviewData = reviewSchema.parse(req.body);
    
    // Check if review already exists
    const existingReview = await BookReview.findOne({ 
      userId: reviewData.userId, 
      bookId: reviewData.bookId 
    });
    
    if (existingReview) {
      // Update existing review
      const updatedReview = await BookReview.findOneAndUpdate(
        { userId: reviewData.userId, bookId: reviewData.bookId },
        reviewData,
        { new: true }
      );
      return res.json({ 
        success: true, 
        data: updatedReview, 
        message: 'Review updated successfully', 
        error: null 
      });
    } else {
      // Create new review
      const review = new BookReview(reviewData);
      await review.save();
      return res.json({ 
        success: true, 
        data: review, 
        message: 'Review created successfully', 
        error: null 
      });
    }
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      data: null, 
      message: 'Failed to save review', 
      error: error.message 
    });
  }
}
