import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/mongodb';
import OccupancyRecord from '../../../../models/OccupancyRecord';

interface ResponseData {
  success: boolean;
  data?: any;
  error?: string;
}

const allowedStatuses = ['planned', 'checked-in', 'checked-out', 'vacant', 'overdue'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    await connectDB();

    switch (req.method) {
      case 'GET':
        return await listOccupancy(req, res);
      case 'POST':
        return await createOccupancy(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function listOccupancy(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { status, userId } = req.query;

  const filter: any = {};
  if (status && typeof status === 'string' && allowedStatuses.includes(status)) {
    filter.status = status;
  }
  if (userId && typeof userId === 'string') {
    filter.userId = userId;
  }

  const records = await OccupancyRecord.find(filter)
    .populate('userId', 'email firstName lastName role')
    .sort({ createdAt: -1 });

  return res.status(200).json({ success: true, data: records });
}

async function createOccupancy(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { userId, propertyName, roomNumber, moveInDate, moveOutDate, status, notes } = req.body;

  if (!userId || !propertyName || !moveInDate) {
    return res.status(400).json({ success: false, error: 'userId, propertyName, and moveInDate are required' });
  }

  const record = await OccupancyRecord.create({
    userId,
    propertyName,
    roomNumber,
    moveInDate,
    moveOutDate,
    status: allowedStatuses.includes(status) ? status : 'planned',
    notes,
  });

  return res.status(201).json({ success: true, data: record });
}
