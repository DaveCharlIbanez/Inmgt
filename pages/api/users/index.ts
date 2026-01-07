import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
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

    switch (req.method) {
      case 'GET':
        return await getUsers(req, res);
      case 'POST':
        return await createUser(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const { role } = req.query;
    
    const filter: any = { isActive: true };
    if (role && ['admin', 'client', 'owner'].includes(role as string)) {
      filter.role = role;
    }

    const users = await User.find(filter).select('-password');
    
    return res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

async function createUser(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const { email, password: plainPassword, role, firstName, lastName, contactNumber } = req.body;

    if (!email || !plainPassword || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, password, and role are required' 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      contactNumber,
    });

    const userResponse = user.toObject();
    const { password, ...userWithoutPassword } = userResponse;

    return res.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
