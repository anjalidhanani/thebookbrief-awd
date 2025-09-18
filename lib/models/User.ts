import { Schema, model, models, type Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  avatar?: string;
  providers?: string;
  age?: number;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    avatar: { type: String },
    providers: { type: String, default: 'password' },
    age: { type: Number },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = models.User || model<UserDocument>('User', userSchema);
