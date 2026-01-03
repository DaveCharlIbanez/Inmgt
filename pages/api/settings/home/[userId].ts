import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/mongodb';
import HomeSettings from '../../../../models/HomeSettings';

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

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    switch (req.method) {
      case 'GET':
        return await getHomeSettings(userId, res);
      case 'PUT':
        return await updateHomeSettings(userId, req, res);
      case 'POST':
        return await createHomeSettings(userId, req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

// GET home settings for a user
async function getHomeSettings(userId: string, res: NextApiResponse<ResponseData>) {
  try {
    const settings = await HomeSettings.findOne({ userId }).populate('userId', 'email firstName lastName');
    
    if (!settings) {
      return res.status(404).json({ success: false, error: 'Home settings not found' });
    }

    return res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// POST - Create home settings for a user
async function createHomeSettings(userId: string, req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const settingsData = { userId, ...req.body };
    
    const existingSettings = await HomeSettings.findOne({ userId });
    if (existingSettings) {
      return res.status(400).json({ 
        success: false, 
        error: 'Home settings already exist for this user. Use PUT to update.' 
      });
    }

    const settings = await HomeSettings.create(settingsData);
    
    return res.status(201).json({ success: true, data: settings });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// PUT - Update home settings
async function updateHomeSettings(userId: string, req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const settings = await HomeSettings.findOneAndUpdate(
      { userId },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );

    return res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
