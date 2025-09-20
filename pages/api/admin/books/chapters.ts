import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../../lib/utils/database';
import { Book } from '../../../../lib/models/Book';
import { AuthRequest, requireAdmin } from '../../../../lib/middleware/auth';

const chapterSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  text: z.string().min(1),
});

const addChapterSchema = z.object({
  bookId: z.string(),
  chapter: chapterSchema,
});

const updateChapterSchema = z.object({
  bookId: z.string(),
  chapterId: z.string(),
  chapter: chapterSchema,
});

const deleteChapterSchema = z.object({
  bookId: z.string(),
  chapterId: z.string(),
});

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  await connectToDatabase();

  // Apply admin authentication middleware
  await new Promise<void>((resolve, reject) => {
    requireAdmin(req, res, () => resolve());
  });

  try {
    switch (req.method) {
      case 'GET':
        return await getChapters(req, res);
      case 'POST':
        return await addChapter(req, res);
      case 'PUT':
        return await updateChapter(req, res);
      case 'DELETE':
        return await deleteChapter(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Admin chapters API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getChapters(req: AuthRequest, res: NextApiResponse) {
  const { bookId } = req.query;
  
  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' });
  }

  const book = await Book.findOne({ id: bookId, isDeleted: false });
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.json({
    chapters: book.chapter || [],
    bookTitle: book.title,
  });
}

async function addChapter(req: AuthRequest, res: NextApiResponse) {
  const data = addChapterSchema.parse(req.body);
  
  const book = await Book.findOne({ id: data.bookId, isDeleted: false });
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Generate unique ID for the chapter if not provided
  const chapterId = data.chapter.id || `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newChapter = {
    id: chapterId,
    title: data.chapter.title,
    text: data.chapter.text,
  };

  // Add chapter to the book
  book.chapter = [...(book.chapter || []), newChapter];
  book.chapterCount = book.chapter.length;
  
  await book.save();

  return res.status(201).json({ 
    message: 'Chapter added successfully', 
    chapter: newChapter,
    totalChapters: book.chapterCount
  });
}

async function updateChapter(req: AuthRequest, res: NextApiResponse) {
  const data = updateChapterSchema.parse(req.body);
  
  const book = await Book.findOne({ id: data.bookId, isDeleted: false });
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const chapterIndex = book.chapter?.findIndex(ch => ch.id === data.chapterId);
  
  if (chapterIndex === -1 || chapterIndex === undefined) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  // Update the chapter
  if (book.chapter) {
    book.chapter[chapterIndex] = {
      id: data.chapterId,
      title: data.chapter.title,
      text: data.chapter.text,
    };
  }
  
  await book.save();

  return res.json({ 
    message: 'Chapter updated successfully', 
    chapter: book.chapter[chapterIndex]
  });
}

async function deleteChapter(req: AuthRequest, res: NextApiResponse) {
  const data = deleteChapterSchema.parse(req.body);
  
  const book = await Book.findOne({ id: data.bookId, isDeleted: false });
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const chapterIndex = book.chapter?.findIndex(ch => ch.id === data.chapterId);
  
  if (chapterIndex === -1 || chapterIndex === undefined) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  // Remove the chapter
  if (book.chapter) {
    book.chapter.splice(chapterIndex, 1);
    book.chapterCount = book.chapter.length;
  }
  
  await book.save();

  return res.json({ 
    message: 'Chapter deleted successfully',
    totalChapters: book.chapterCount
  });
}
