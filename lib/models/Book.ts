import { Schema, model, models, type Document } from 'mongoose';

export interface Chapter {
  id?: string;
  title: string;
  text: string;
}

export interface BookDocument extends Document {
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  imageUrl?: string;
  aboutTheBook?: string;
  author?: string;
  category?: string;
  rating?: number;
  chapter?: Chapter[];
  chapterCount?: number;
  language?: string;
  readingTime?: number;
  totalReads?: number;
  isPublished: boolean;
  isFree: boolean;
  isDaily?: boolean;
  publishedDate?: Date | null;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chapterSchema = new Schema<Chapter>({
  id: { type: String },
  title: { type: String, required: true },
  text: { type: String, required: true },
});

const bookSchema = new Schema<BookDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    slug: { type: String, index: true },
    subtitle: { type: String },
    imageUrl: { type: String },
    aboutTheBook: { type: String },
    author: { type: String, index: true },
    category: { type: String, index: true },
    rating: { type: Number, default: 0 },
    chapter: { type: [chapterSchema], default: [] },
    chapterCount: { type: Number, default: 0 },
    language: { type: String },
    readingTime: { type: Number },
    totalReads: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    isDaily: { type: Boolean, default: false },
    publishedDate: { type: Date, default: null },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Book = models.Book || model<BookDocument>('Book', bookSchema);
