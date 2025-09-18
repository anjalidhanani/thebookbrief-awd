import type { NextApiResponse } from 'next';
import connectToDatabase from '../../../../../lib/utils/database';
import { ReadingList } from '../../../../../lib/models/ReadingList';
import { requireAuth, type AuthRequest } from '../../../../../lib/middleware/apiAuth';

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  const { listId, bookId } = req.query;
  
  const list = await ReadingList.findOneAndUpdate(
    { id: listId },
    { $pull: { bookIds: bookId } },
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
    message: 'Book removed from reading list successfully', 
    error: null 
  });
}
