import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }

  await dbConnect();

  try {
    switch (method) {
      case 'GET':
        const user = await User.findById(userId).select('walletBalance walletTransactions');
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({
          balance: user.walletBalance || 0,
          transactions: user.walletTransactions || [],
        });

      case 'POST':
        const { transaction } = req.body;
        
        if (!transaction) {
          return res.status(400).json({ error: 'Transaction data is required' });
        }

        const updatedUser = await User.findById(userId);
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Add transaction
        if (!updatedUser.walletTransactions) {
          updatedUser.walletTransactions = [];
        }
        updatedUser.walletTransactions.unshift(transaction);
        
        await updatedUser.save();

        return res.status(200).json({
          balance: updatedUser.walletBalance || 0,
          transactions: updatedUser.walletTransactions || [],
        });

      case 'PUT':
        const { transactionId, status, balance } = req.body;
        
        if (!transactionId || !status) {
          return res.status(400).json({ error: 'Transaction ID and status are required' });
        }

        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Update transaction status
        const txnIndex = userToUpdate.walletTransactions?.findIndex((t: any) => t.id === transactionId);
        if (txnIndex !== undefined && txnIndex !== -1 && userToUpdate.walletTransactions) {
          userToUpdate.walletTransactions[txnIndex].status = status;
        }

        // Update balance if provided
        if (balance !== undefined) {
          userToUpdate.walletBalance = balance;
        }

        await userToUpdate.save();

        return res.status(200).json({
          balance: userToUpdate.walletBalance || 0,
          transactions: userToUpdate.walletTransactions || [],
        });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
