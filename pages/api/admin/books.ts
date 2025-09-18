import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { Book } from '../../../lib/models/Book';
import { AuthRequest, requireAdmin } from '../../../lib/middleware/auth';

const createBookSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  aboutTheBook: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  language: z.string().optional(),
  readingTime: z.number().optional(),
  rating: z.number().min(0).max(5).optional(),
  chapterCount: z.number().min(0).optional(),
  isPublished: z.boolean().default(false),
  isFree: z.boolean().default(true),
  isDaily: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  publishedDate: z.string().optional().transform(val => val ? new Date(val) : null),
});

const updateBookSchema = createBookSchema.partial().omit({ id: true });

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  await connectToDatabase();

  // Apply admin authentication middleware
  await new Promise<void>((resolve, reject) => {
    requireAdmin(req, res, () => resolve());
  });

  try {
    switch (req.method) {
      case 'GET':
        return await getBooks(req, res);
      case 'POST':
        return await createBook(req, res);
      case 'PUT':
        return await updateBook(req, res);
      case 'DELETE':
        return await deleteBook(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Admin books API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getBooks(req: AuthRequest, res: NextApiResponse) {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const searchQuery = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const books = await Book.find({ ...searchQuery, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Book.countDocuments({ ...searchQuery, isDeleted: false });

  return res.json({
    books,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
}

async function createBook(req: AuthRequest, res: NextApiResponse) {
  const data = createBookSchema.parse(req.body);
  
  // Check if book with same ID already exists
  const existingBook = await Book.findOne({ id: data.id });
  if (existingBook) {
    return res.status(400).json({ message: 'Book with this ID already exists' });
  }

  const book = new Book(data);
  await book.save();

  return res.status(201).json({ message: 'Book created successfully', book });
}

async function updateBook(req: AuthRequest, res: NextApiResponse) {
  const { bookId } = req.query;
  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' });
  }

  const data = updateBookSchema.parse(req.body);
  
  const book = await Book.findOneAndUpdate(
    { id: bookId, isDeleted: false },
    data,
    { new: true }
  );

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.json({ message: 'Book updated successfully', book });
}

async function deleteBook(req: AuthRequest, res: NextApiResponse) {
  const { bookId } = req.query;
  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' });
  }

  const book = await Book.findOneAndUpdate(
    { id: bookId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.json({ message: 'Book deleted successfully' });
}
