import type { NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../../lib/utils/database';
import { ReadingList } from '../../../../lib/models/ReadingList';
import { requireAuth, type AuthRequest } from '../../../../lib/middleware/apiAuth';

const addBookSchema = z.object({
  bookId: z.string()
});

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  try {
    const { listId } = req.query;
    const { bookId } = addBookSchema.parse(req.body);
    
    const list = await ReadingList.findOneAndUpdate(
      { id: listId },
      { $addToSet: { bookIds: bookId } }, // $addToSet prevents duplicates
      { new: true }
    );
    
    if (!list) {
      return res.status(404).json({ 
        success: false, 
        data: null, 
        message: 'Reading list not found', 
        error: null 
      });
    }
    
    return res.json({ 
      success: true, 
      data: list, 
      message: 'Book added to reading list successfully', 
      error: null 
    });
  } catch (error: any) {
    return res.status(400).json({ 
      success: false, 
      data: null, 
      message: 'Failed to add book to list', 
      error: error.message 
    });
  }
}
