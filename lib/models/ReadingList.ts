import { Schema, model, models, type Document } from 'mongoose';

export interface ReadingListDocument extends Document {
  id: string;
  userId: string;
  name: string;
  description?: string;
  bookIds: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const readingListSchema = new Schema<ReadingListDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, ref: 'User', index: true },
    name: { type: String, required: true },
    description: { type: String },
    bookIds: [{ type: String, ref: 'Book' }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ReadingList = models.ReadingList || model<ReadingListDocument>('ReadingList', readingListSchema);
