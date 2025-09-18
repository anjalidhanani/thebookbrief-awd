import type { NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { ReadingList } from '../../../lib/models/ReadingList';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

const createListSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  bookIds: z.array(z.string()).optional(),
  isPublic: z.boolean().optional()
});

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  if (req.method === 'GET') {
    // Get all public reading lists
    const lists = await ReadingList.find({ isPublic: true }).sort({ createdAt: -1 }).lean();
    return res.json({ 
      success: true, 
      data: lists, 
      message: 'Public reading lists fetched successfully', 
      error: null 
    });
  }

  if (req.method === 'POST') {
    // Create reading list
    try {
      const listData = createListSchema.parse(req.body);
      const readingList = new ReadingList(listData);
      await readingList.save();
      return res.json({ 
        success: true, 
        data: readingList, 
        message: 'Reading list created successfully', 
        error: null 
      });
    } catch (error: any) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'Failed to create reading list', 
        error: error.message 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
