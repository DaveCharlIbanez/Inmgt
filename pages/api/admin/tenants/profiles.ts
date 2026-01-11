import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/mongodb';
import ProfileSettings from '../../../../models/ProfileSettings';
import User from '../../../../models/User';

interface ResponseData {
  success: boolean;
  data?: any;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    await connectDB();

    switch (req.method) {
      case 'GET':
        return await listTenantProfiles(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function listTenantProfiles(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { activeOnly } = req.query;
  const activeFilter = activeOnly === 'true' ? { isActive: true } : {};

  const users = await User.find({ role: 'client', ...activeFilter }).select('_id email firstName lastName role isActive');
  const userIds = users.map((u) => u._id);

  const profiles = await ProfileSettings.find({ userId: { $in: userIds } })
    .populate('userId', 'email firstName lastName role isActive')
    .sort({ updatedAt: -1 });

  return res.status(200).json({ success: true, data: { users, profiles } });
}
