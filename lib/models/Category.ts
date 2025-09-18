import { Schema, model, models, type Document } from 'mongoose';

export interface CategoryDocument extends Document {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    color: { type: String, default: '#6B7280' }, // Default gray color
    icon: { type: String, default: 'fi-rr-book' }, // Default book icon
    image: { type: String, default: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop' }, // Default book image
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = models.Category || model<CategoryDocument>('Category', categorySchema);
