 

import { Request, Response } from 'express';
import db from '../drizzle/db';
import { bookingTable, eventTable, userTable, paymentTable } from '../drizzle/schema';
import { count, eq, sum } from 'drizzle-orm';

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [usersCount] = await db.select({ count: count() }).from(userTable);
    const [eventsCount] = await db.select({ count: count() }).from(eventTable);
    const [bookingsCount] = await db.select({ count: count() }).from(bookingTable);
    const [paymentsSum] = await db.select({ revenue: sum(paymentTable.amount) }).from(paymentTable);

    res.json({
      totalUsers: usersCount.count,
      totalEvents: eventsCount.count,
      totalBookings: bookingsCount.count,
      totalRevenue: paymentsSum.revenue ?? 0,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
};
