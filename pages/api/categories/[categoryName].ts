import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/utils/database';
import { Book } from '../../../lib/models/Book';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    const { categoryName } = req.query;
    const decodedCategoryName = decodeURIComponent(categoryName as string);
    
    const books = await Book.find({ category: decodedCategoryName });
    
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books by category'
    });
  }
}
