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

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid contract ID' });
    }

    switch (req.method) {
      case 'GET':
        return await getContract(id, res);
      case 'PUT':
        return await updateContract(id, req, res);
      case 'DELETE':
        return await softDeleteContract(id, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function getContract(id: string, res: NextApiResponse<ResponseData>) {
  const contract = await Contract.findById(id).populate('userId', 'email firstName lastName role');

  if (!contract) {
    return res.status(404).json({ success: false, error: 'Contract not found' });
  }

  return res.status(200).json({ success: true, data: contract });
}

async function updateContract(id: string, req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const payload = req.body || {};
  if (payload.status && !allowedStatuses.includes(payload.status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value' });
  }

  const contract = await Contract.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!contract) {
    return res.status(404).json({ success: false, error: 'Contract not found' });
  }

  return res.status(200).json({ success: true, data: contract });
}

async function softDeleteContract(id: string, res: NextApiResponse<ResponseData>) {
  const contract = await Contract.findByIdAndUpdate(
    id,
    { status: 'terminated' },
    { new: true }
  );

  if (!contract) {
    return res.status(404).json({ success: false, error: 'Contract not found' });
  }

  return res.status(200).json({ success: true, data: contract });
}
