 // routes/dashboard.ts
import express from 'express';
import db from '../drizzle/db';
import { bookingTable, eventTable, userTable, paymentTable } from '../drizzle/schema';
import { count, sum } from 'drizzle-orm';

const router = express.Router();

router.get('/dashboard-stats', async (req, res) => {
  try {
    const [totalUsers] = await db.select({ count: count() }).from(userTable);
    const [totalEvents] = await db.select({ count: count() }).from(eventTable);
    const [totalBookings] = await db.select({ count: count() }).from(bookingTable);
    const [totalRevenueResult] = await db
      .select({ total: sum(paymentTable.amount) })
      .from(paymentTable);

    const stats = {
      totalUsers: Number(totalUsers.count) || 0,
      totalEvents: Number(totalEvents.count) || 0,
      totalBookings: Number(totalBookings.count) || 0,
      totalRevenue: Number(totalRevenueResult.total) || 0,
    };

    res.json(stats);
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
