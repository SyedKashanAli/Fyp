import { connectDB } from '../../../middleware/mongoose';
import FoodListing from '../../../models/foodlistingmodel';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await connectDB();
  
  try {
    const result = await FoodListing.deleteMany({ isExpired: true });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Failed to clean expired items' });
  }
}