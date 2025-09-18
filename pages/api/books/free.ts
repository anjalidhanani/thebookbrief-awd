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

  // Parse query parameters
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 20; // Default limit of 20 books per page

  // Calculate pagination
  const skip = offset * limit;

  // Get total count for pagination info
  const totalCount = await Book.countDocuments({
    isFree: true,
    isPublished: true,
    isDeleted: false
  });

  // Fetch books with pagination and exclude chapter content to reduce response size
  const items = await Book.find({
    isFree: true,
    isPublished: true,
    isDeleted: false
  })
  .select('-chapter') // Exclude chapter content as it's not needed for listings
  .sort({ publishedDate: -1 })
  .skip(skip)
  .limit(limit)
  .lean();
  const totalPages = Math.ceil(totalCount / limit);
  const hasMore = (skip + limit) < totalCount;
  
  return res.json({ 
    success: true, 
    data: items, 
    pagination: {
      currentPage: offset + 1,
      totalPages,
      totalCount,
      hasMore,
      limit
    },
    message: 'Books fetched successfully', 
    error: null 
  });
}
