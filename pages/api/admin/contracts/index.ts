import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/mongodb';
import Contract from '../../../../models/Contract';

interface ResponseData {
  success: boolean;
  data?: any;
  error?: string;
}

const allowedStatuses = ['draft', 'pending', 'active', 'terminated', 'completed'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    await connectDB();

    switch (req.method) {
      case 'GET':
        return await listContracts(req, res);
      case 'POST':
        return await createContract(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function listContracts(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { status, userId } = req.query;

  const filter: any = {};
  if (status && typeof status === 'string' && allowedStatuses.includes(status)) {
    filter.status = status;
  }
  if (userId && typeof userId === 'string') {
    filter.userId = userId;
  }

  const contracts = await Contract.find(filter)
    .populate('userId', 'email firstName lastName role')
    .sort({ createdAt: -1 });

  return res.status(200).json({ success: true, data: contracts });
}

async function createContract(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { userId, propertyName, roomNumber, startDate, endDate, rentAmount, currency, status, terms } = req.body;

  if (!userId || !propertyName || !startDate || typeof rentAmount !== 'number') {
    return res.status(400).json({ success: false, error: 'userId, propertyName, startDate, and rentAmount are required' });
  }

  const contract = await Contract.create({
    userId,
    propertyName,
    roomNumber,
    startDate,
    endDate,
    rentAmount,
    currency: currency || 'PHP',
    status: allowedStatuses.includes(status) ? status : 'pending',
    terms,
  });

  return res.status(201).json({ success: true, data: contract });
}
