import type { NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { ReadingList } from '../../../lib/models/ReadingList';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

const updateListSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  bookIds: z.array(z.string()).optional(),
  isPublic: z.boolean().optional()
});

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  const { listId } = req.query;

  if (req.method === 'GET') {
    // Get specific reading list
    const list = await ReadingList.findOne({ id: listId });
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
      message: 'Reading list retrieved successfully', 
      error: null 
    });
  }

  if (req.method === 'PUT') {
    // Update reading list
    try {
      const updateData = updateListSchema.parse(req.body);
      const list = await ReadingList.findOneAndUpdate(
        { id: listId }, 
        updateData, 
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
        message: 'Reading list updated successfully', 
        error: null 
      });
    } catch (error: any) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'Failed to update reading list', 
        error: error.message 
      });
    }
  }

  if (req.method === 'DELETE') {
    // Delete reading list
    const list = await ReadingList.findOneAndDelete({ id: listId });
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
      data: null, 
      message: 'Reading list deleted successfully', 
      error: null 
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
