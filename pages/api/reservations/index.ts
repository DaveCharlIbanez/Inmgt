import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import OccupancyRecord from '../../../models/OccupancyRecord';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { userId, propertyName, roomNumber, moveInDate } = req.body;

      if (!userId || !propertyName || !moveInDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const reservation = await OccupancyRecord.create({
        userId,
        propertyName,
        roomNumber,
        moveInDate: new Date(moveInDate),
        status: 'planned',
        notes: 'Reservation made via client portal',
      });

      return res.status(201).json({
        success: true,
        message: 'Reservation created successfully',
        data: reservation,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to create reservation' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
