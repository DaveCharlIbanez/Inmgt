import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';

type ResponseData = {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Test MongoDB connection
    await connectDB();
    
    // Try to count users in the database
    const userCount = await User.countDocuments();
    
    // Get a sample user (without password)
    const sampleUser = await User.findOne().select('-password').limit(1);
    
    return res.status(200).json({ 
      success: true, 
      message: 'MongoDB connected successfully!',
      data: {
        userCount,
        sampleUser,
        databaseName: 'inmgt',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to connect to MongoDB'
    });
  }
}
