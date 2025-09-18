import type { NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { Book } from '../../../lib/models/Book';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

const readCountSchema = z.object({ book_id: z.string() });

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  try {
    const { book_id } = readCountSchema.parse(req.body);
    const book = await Book.findOneAndUpdate(
      { id: book_id }, 
      { $inc: { totalReads: 1 } }, 
      { new: true }
    );
    
    if (!book) {
      return res.json({ 
        success: false, 
        data: null, 
        message: 'Book not published yet', 
        error: null 
      });
    }
    
    return res.json({ 
      success: true, 
      data: null, 
      message: 'Count added successfully', 
      error: null 
    });
  } catch (e: any) {
    return res.status(400).json({ 
      success: false, 
      data: null, 
      message: 'Invalid input', 
      error: e.message 
    });
  }
}
