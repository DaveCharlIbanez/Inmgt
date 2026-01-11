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

    switch (req.method) {
      case 'GET':
        return await listInvoices(req, res);
      case 'POST':
        return await createInvoice(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function listInvoices(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { status, userId } = req.query;

  const filter: any = {};
  if (status && typeof status === 'string' && allowedStatuses.includes(status)) {
    filter.status = status;
  }
  if (userId && typeof userId === 'string') {
    filter.userId = userId;
  }

  const invoices = await BillingInvoice.find(filter)
    .populate('userId', 'email firstName lastName role')
    .populate('contractId', 'propertyName roomNumber status startDate endDate')
    .sort({ issuedAt: -1 });

  return res.status(200).json({ success: true, data: invoices });
}

async function createInvoice(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { userId, contractId, invoiceNumber, items, amountDue, currency, dueDate, status, notes } = req.body;

  if (!userId || (!invoiceNumber && !contractId) || !dueDate) {
    return res.status(400).json({ success: false, error: 'userId, invoiceNumber (or contractId), and dueDate are required' });
  }

  const calculatedAmount = Array.isArray(items)
    ? items.reduce((sum, item) => sum + (item.amount || 0), 0)
    : amountDue;

  const invoice = await BillingInvoice.create({
    userId,
    contractId,
    invoiceNumber: invoiceNumber || `INV-${Date.now()}`,
    items: items || [],
    amountDue: calculatedAmount ?? 0,
    currency: currency || 'PHP',
    dueDate,
    status: allowedStatuses.includes(status) ? status : 'issued',
    notes,
  });

  return res.status(201).json({ success: true, data: invoice });
}
