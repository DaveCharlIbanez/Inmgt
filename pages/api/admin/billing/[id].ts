import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../../lib/mongodb';
import BillingInvoice from '../../../../models/BillingInvoice';

interface ResponseData {
  success: boolean;
  data?: any;
  error?: string;
}

const allowedStatuses = ['draft', 'issued', 'paid', 'overdue', 'void'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    await connectDB();

    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid invoice ID' });
    }

    switch (req.method) {
      case 'GET':
        return await getInvoice(id, res);
      case 'PUT':
        return await updateInvoice(id, req, res);
      case 'DELETE':
        return await voidInvoice(id, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function getInvoice(id: string, res: NextApiResponse<ResponseData>) {
  const invoice = await BillingInvoice.findById(id)
    .populate('userId', 'email firstName lastName role')
    .populate('contractId', 'propertyName roomNumber status startDate endDate');

  if (!invoice) {
    return res.status(404).json({ success: false, error: 'Invoice not found' });
  }

  return res.status(200).json({ success: true, data: invoice });
}

async function updateInvoice(id: string, req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const payload = req.body || {};
  if (payload.status && !allowedStatuses.includes(payload.status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value' });
  }

  const invoice = await BillingInvoice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!invoice) {
    return res.status(404).json({ success: false, error: 'Invoice not found' });
  }

  return res.status(200).json({ success: true, data: invoice });
}

async function voidInvoice(id: string, res: NextApiResponse<ResponseData>) {
  const invoice = await BillingInvoice.findByIdAndUpdate(
    id,
    { status: 'void' },
    { new: true }
  );

  if (!invoice) {
    return res.status(404).json({ success: false, error: 'Invoice not found' });
  }

  return res.status(200).json({ success: true, data: invoice });
}
