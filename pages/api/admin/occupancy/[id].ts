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

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid occupancy record ID' });
    }

    switch (req.method) {
      case 'GET':
        return await getRecord(id, res);
      case 'PUT':
        return await updateRecord(id, req, res);
      case 'DELETE':
        return await deleteRecord(id, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function getRecord(id: string, res: NextApiResponse<ResponseData>) {
  const record = await OccupancyRecord.findById(id).populate('userId', 'email firstName lastName role');

  if (!record) {
    return res.status(404).json({ success: false, error: 'Occupancy record not found' });
  }

  return res.status(200).json({ success: true, data: record });
}

async function updateRecord(id: string, req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const payload = req.body || {};
  if (payload.status && !allowedStatuses.includes(payload.status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value' });
  }

  const record = await OccupancyRecord.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    return res.status(404).json({ success: false, error: 'Occupancy record not found' });
  }

  return res.status(200).json({ success: true, data: record });
}

async function deleteRecord(id: string, res: NextApiResponse<ResponseData>) {
  const record = await OccupancyRecord.findByIdAndDelete(id);

  if (!record) {
    return res.status(404).json({ success: false, error: 'Occupancy record not found' });
  }

  return res.status(200).json({ success: true, data: record });
}
