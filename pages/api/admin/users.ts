import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import connectToDatabase from '../../../lib/utils/database';
import { User } from '../../../lib/models/User';
import { AuthRequest, requireAdmin } from '../../../lib/middleware/auth';

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).default('user'),
  age: z.number().optional(),
  isVerified: z.boolean().default(false),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['user', 'admin']).optional(),
  age: z.number().optional(),
  isVerified: z.boolean().optional(),
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
        return await getUsers(req, res);
      case 'POST':
        return await createUser(req, res);
      case 'PUT':
        return await updateUser(req, res);
      case 'DELETE':
        return await deleteUser(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Admin users API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getUsers(req: AuthRequest, res: NextApiResponse) {
  const { page = 1, limit = 10, search = '', role = '' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const searchQuery: any = { isDeleted: false };
  
  if (search) {
    searchQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (role) {
    searchQuery.role = role;
  }

  const users = await User.find(searchQuery)
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Ensure all users have a role field (default to 'user' if missing)
  const usersWithRoles = users.map(user => ({
    ...user,
    role: user.role || 'user'
  }));

  const total = await User.countDocuments(searchQuery);

  return res.json({
    users: usersWithRoles,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
}

async function createUser(req: AuthRequest, res: NextApiResponse) {
  const data = createUserSchema.parse(req.body);
  
  // Check if user with same email already exists
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = new User({
    ...data,
    email: data.email.toLowerCase(),
    passwordHash,
  });
  
  await user.save();

  // Remove password hash from response
  const userResponse = user.toObject();
  delete userResponse.passwordHash;

  return res.status(201).json({ message: 'User created successfully', user: userResponse });
}

async function updateUser(req: AuthRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const data = updateUserSchema.parse(req.body);
  
  // Hash password if provided
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 12);
  }

  // Check email uniqueness if email is being updated
  if (data.email) {
    const existingUser = await User.findOne({ 
      email: data.email.toLowerCase(),
      _id: { $ne: userId }
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    data.email = data.email.toLowerCase();
  }

  const updateData: any = { ...data };
  if (data.password) {
    updateData.passwordHash = data.password;
    delete updateData.password;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  ).select('-passwordHash');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ message: 'User updated successfully', user });
}

async function deleteUser(req: AuthRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Prevent admin from deleting themselves
  if (userId === req.user?.id) {
    return res.status(400).json({ message: 'Cannot delete your own account' });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ message: 'User deleted successfully' });
}
