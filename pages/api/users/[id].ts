import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

type ResponseData = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    await connectDB();

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    switch (req.method) {
      case 'GET':
        return await getUser(id, res);
      case 'PUT':
        return await updateUser(id, req, res);
      case 'DELETE':
        return await deleteUser(id, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function getUser(id: string, res: NextApiResponse<ResponseData>) {
  try {
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

async function updateUser(id: string, req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const updates = req.body;

    delete updates.password;

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

async function deleteUser(id: string, res: NextApiResponse<ResponseData>) {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
