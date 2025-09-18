import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/utils/database';
import { Book } from '../../../lib/models/Book';
import { Category } from '../../../lib/models/Category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    // Get all active categories from database
    const dbCategories = await Category.find({ isActive: true }).lean();
    
    // Get all books and count by category
    const books = await Book.find({}, 'category');
    const categoryCounts: { [key: string]: number } = {};
    
    books.forEach(book => {
      if (book.category) {
        categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
      }
    });
    
    // Merge database categories with book counts
    const categories = dbCategories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      books: categoryCounts[category.name] || 0,
      icon: category.icon,
      color: category.color,
      image: category.image
    }));

    // Sort by book count (descending) then by name
    categories.sort((a, b) => {
      if (b.books !== a.books) {
        return b.books - a.books;
      }
      return a.name.localeCompare(b.name);
    });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
}
