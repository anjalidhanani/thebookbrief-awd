import { Schema, model, models, type Document } from 'mongoose';

export interface BookReviewDocument extends Document {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookReviewSchema = new Schema<BookReviewDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, ref: 'User', index: true },
    bookId: { type: String, required: true, ref: 'Book', index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure one review per user per book
bookReviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const BookReview = models.BookReview || model<BookReviewDocument>('BookReview', bookReviewSchema);
