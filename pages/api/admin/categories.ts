import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import connectToDatabase from '../../../lib/utils/database';
import { Category } from '../../../lib/models/Category';
import { AuthRequest, requireAdmin } from '../../../lib/middleware/auth';

const createCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
});

const updateCategorySchema = createCategorySchema.partial().omit({ id: true });

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  await connectToDatabase();

  // Apply admin authentication middleware
  await new Promise<void>((resolve, reject) => {
    requireAdmin(req, res, () => resolve());
  });

  try {
    switch (req.method) {
      case 'GET':
        return await getCategories(req, res);
      case 'POST':
        return await createCategory(req, res);
      case 'PUT':
        return await updateCategory(req, res);
      case 'DELETE':
        return await deleteCategory(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Admin categories API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getCategories(req: AuthRequest, res: NextApiResponse) {
  const { page = 1, limit = 10, search = '', active = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const searchQuery: any = {};
  
  if (search) {
    searchQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (active !== '') {
    searchQuery.isActive = active === 'true';
  }

  const categories = await Category.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Category.countDocuments(searchQuery);

  return res.json({
    categories,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
}

async function createCategory(req: AuthRequest, res: NextApiResponse) {
  const data = createCategorySchema.parse(req.body);
  
  // Check if category with same ID or name already exists
  const existingCategory = await Category.findOne({
    $or: [
      { id: data.id },
      { name: data.name }
    ]
  });
  
  if (existingCategory) {
    return res.status(400).json({ message: 'Category with this ID or name already exists' });
  }

  const category = new Category(data);
  await category.save();

  return res.status(201).json({ message: 'Category created successfully', category });
}

async function updateCategory(req: AuthRequest, res: NextApiResponse) {
  const { categoryId } = req.query;
  if (!categoryId) {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  const data = updateCategorySchema.parse(req.body);
  
  // Check name uniqueness if name is being updated
  if (data.name) {
    const existingCategory = await Category.findOne({ 
      name: data.name,
      id: { $ne: categoryId }
    });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already in use' });
    }
  }

  const category = await Category.findOneAndUpdate(
    { id: categoryId },
    data,
    { new: true }
  );

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  return res.json({ message: 'Category updated successfully', category });
}

async function deleteCategory(req: AuthRequest, res: NextApiResponse) {
  const { categoryId } = req.query;
  if (!categoryId) {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  const category = await Category.findOneAndDelete({ id: categoryId });

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  return res.json({ message: 'Category deleted successfully' });
}
