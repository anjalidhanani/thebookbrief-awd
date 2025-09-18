import type { NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { Book } from '../../../lib/models/Book';
import { requireAuth, type AuthRequest } from '../../../lib/middleware/apiAuth';

const searchSchema = z.object({ 
  keyword: z.string().optional(), 
  category: z.string().optional() 
});

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const isAuthed = await requireAuth(req, res);
  if (!isAuthed) return;

  try {
    const { keyword, category } = searchSchema.parse(req.body);
    const q: any = { isDeleted: false, isPublished: true };
    
    if (keyword) {
      q.$or = [
        { title: new RegExp(keyword, 'i') }, 
        { aboutTheBook: new RegExp(keyword, 'i') }
      ];
    }
    
    if (category) {
      q.category = category;
    }
    
    const limit = Number(req.query.limit || 20);
    const offset = Number(req.query.offset || 0);
    
    const [items, count] = await Promise.all([
      Book.find(q).skip(offset).limit(limit).lean(),
      Book.countDocuments(q),
    ]);
    
    return res.json({ 
      success: true, 
      data: items, 
      count, 
      message: 'Books fetched successfully', 
      error: null 
    });
  } catch (e: any) {
    return res.status(400).json({ 
      success: false, 
      data: null, 
      message: 'Something went wrong', 
      error: e?.message || 'Invalid' 
    });
  }
}
