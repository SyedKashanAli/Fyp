import dbConnect from "@/middleware/mongoose";
import Listings from "@/models/foodlistingmodel";
import { checkExpiry } from '@/middleware/expiryProcessor';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();
  
  try {
    const listings = await Listings.find({ isExpired: false });
    const updates = listings.map(async (item) => {
      const { expiry, isExpired } = await checkExpiry(item);
      return Listings.updateOne(
        { _id: item._id },
        { expiresAt: new Date(expiry), isExpired }
      );
    });

    await Promise.all(updates);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Expiry processing error:', error);
    res.status(500).json({ error: 'Failed to process expiry' });
  }
}