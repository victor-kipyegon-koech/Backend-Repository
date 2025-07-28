 
// import { and, gte, lte } from 'drizzle-orm';
// import db from '../drizzle/db';
// import {
//   bookingTable,
//   eventTable,
//   userTable,
//   paymentTable,
// } from '../drizzle/schema';

// // ✅ Normalized UTC date range generator
// const getDateRange = (range: string): { from: Date; to: Date } => {
//   const now = new Date();
//   const from = new Date(now);
//   const to = new Date(now);

//   switch (range) {
//     case '7days':
//       from.setUTCDate(now.getUTCDate() - 7);
//       break;
//     case '30days':
//       from.setUTCDate(now.getUTCDate() - 30);
//       break;
//     case '90days':
//       from.setUTCDate(now.getUTCDate() - 90);
//       break;
//     case '1year':
//       from.setUTCFullYear(now.getUTCFullYear() - 1);
//       break;
//     default:
//       from.setUTCDate(now.getUTCDate() - 30);
//   }

//   from.setUTCHours(0, 0, 0, 0);
//   to.setUTCHours(23, 59, 59, 999);

//   return { from, to };
// };

// // 🟢 SALES REPORT
// export const getSalesReportService = async (range: string) => {
//   const { from, to } = getDateRange(range);

//   const bookings = await db.query.bookingTable.findMany({
//     where: and(
//       gte(bookingTable.createdAt, from),
//       lte(bookingTable.createdAt, to)
//     ),
//     with: {
//       event: true,
//     },
//   });

//   const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
//   const totalBookings = bookings.length;
//   const averageOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

//   const eventMap: Record<string, { name: string; revenue: number; bookings: number }> = {};

//   for (const b of bookings) {
//     const id = b.eventId.toString();
//     const name = b.event?.title || 'Unknown';

//     if (!eventMap[id]) {
//       eventMap[id] = {
//         name,
//         revenue: Number(b.totalAmount),
//         bookings: 1,
//       };
//     } else {
//       eventMap[id].revenue += Number(b.totalAmount);
//       eventMap[id].bookings += 1;
//     }
//   }

//   const topEvents = Object.values(eventMap)
//     .map((e) => ({
//       ...e,
//       avgTicketPrice: e.bookings > 0 ? e.revenue / e.bookings : 0,
//     }))
//     .sort((a, b) => b.revenue - a.revenue)
//     .slice(0, 5);

//   return {
//     totalRevenue,
//     totalBookings,
//     averageOrderValue,
//     topEvents,
//   };
// };

// // 🟠 EVENT PERFORMANCE REPORT
// export const getEventPerformanceReportService = async (range: string) => {
//   const { from, to } = getDateRange(range);

//   const bookings = await db.query.bookingTable.findMany({
//     where: and(
//       gte(bookingTable.createdAt, from),
//       lte(bookingTable.createdAt, to)
//     ),
//     with: {
//       event: true,
//     },
//   });

//   const eventMap: Record<number, { name: string; revenue: number; bookings: number }> = {};

//   for (const b of bookings) {
//     const id = b.eventId;
//     const name = b.event?.title ?? 'Unknown';
//     const amount = Number(b.totalAmount);

//     if (!eventMap[id]) {
//       eventMap[id] = { name, revenue: amount, bookings: 1 };
//     } else {
//       eventMap[id].revenue += amount;
//       eventMap[id].bookings += 1;
//     }
//   }

//   const stats = Object.values(eventMap).map(e => ({
//     name: e.name,
//     bookings: e.bookings,
//     revenue: e.revenue,
//     avgTicketPrice: e.bookings ? e.revenue / e.bookings : 0,
//   }));

//   return stats.sort((a, b) => b.revenue - a.revenue).slice(0, 10);
// };

// // 🔵 USER ANALYTICS REPORT
// export const getUserAnalyticsReportService = async (range: string) => {
//   const { from, to } = getDateRange(range);

//   const [newUsers, allUsers] = await Promise.all([
//     db.query.userTable.findMany({
//       where: and(
//         gte(userTable.createdAt, from),
//         lte(userTable.createdAt, to)
//       ),
//     }),
//     db.query.userTable.findMany(),
//   ]);

//   return {
//     newUsers: newUsers.length,
//     totalUsers: allUsers.length,
//   };
// };

// // 🟣 REVENUE REPORT
// export const getRevenueReportService = async (range: string) => {
//   const { from, to } = getDateRange(range);

//   const payments = await db.query.paymentTable.findMany({
//     where: and(
//       gte(paymentTable.createdAt, from),
//       lte(paymentTable.createdAt, to)
//     ),
//   });

//   const byMethod: Record<string, number> = {};
//   let totalRevenue = 0;

//   for (const p of payments) {
//     const method = p.paymentMethod || 'unknown';
//     const amount = Number(p.amount);

//     totalRevenue += amount;
//     if (!byMethod[method]) byMethod[method] = 0;
//     byMethod[method] += amount;
//   }

//   return {
//     totalRevenue,
//     byMethod,
//   };
// };
import { and, gte, lte } from 'drizzle-orm';
import db from '../drizzle/db';
import {
  bookingTable,
  eventTable,
  userTable,
  paymentTable,
} from '../drizzle/schema';
import dayjs from 'dayjs';

// ✅ Normalized UTC date range
const getDateRange = (range: string): { from: Date; to: Date } => {
  const now = new Date();
  const from = new Date(now);
  const to = new Date(now);

  switch (range) {
    case '7days':
      from.setUTCDate(now.getUTCDate() - 7);
      break;
    case '30days':
      from.setUTCDate(now.getUTCDate() - 30);
      break;
    case '90days':
      from.setUTCDate(now.getUTCDate() - 90);
      break;
    case '1year':
      from.setUTCFullYear(now.getUTCFullYear() - 1);
      break;
    default:
      from.setUTCDate(now.getUTCDate() - 30);
  }

  from.setUTCHours(0, 0, 0, 0);
  to.setUTCHours(23, 59, 59, 999);

  return { from, to };
};

// 🟢 SALES REPORT
export const getSalesReportService = async (range: string) => {
  const { from, to } = getDateRange(range);

  const bookings = await db.query.bookingTable.findMany({
    where: and(
      gte(bookingTable.createdAt, from),
      lte(bookingTable.createdAt, to)
    ),
    with: {
      event: true,
    },
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
  const totalBookings = bookings.length;
  const averageOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const eventMap: Record<string, { name: string; revenue: number; bookings: number }> = {};

  for (const b of bookings) {
    const id = b.eventId.toString();
    const name = b.event?.title || 'Unknown';

    if (!eventMap[id]) {
      eventMap[id] = {
        name,
        revenue: Number(b.totalAmount),
        bookings: 1,
      };
    } else {
      eventMap[id].revenue += Number(b.totalAmount);
      eventMap[id].bookings += 1;
    }
  }

  const topEvents = Object.values(eventMap)
    .map((e) => ({
      ...e,
      avgTicketPrice: e.bookings > 0 ? e.revenue / e.bookings : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalRevenue,
    totalBookings,
    averageOrderValue,
    topEvents,
  };
};

// 🟠 EVENT PERFORMANCE REPORT
export const getEventPerformanceReportService = async (range: string) => {
  const { from, to } = getDateRange(range);

  const bookings = await db.query.bookingTable.findMany({
    where: and(
      gte(bookingTable.createdAt, from),
      lte(bookingTable.createdAt, to)
    ),
    with: {
      event: true,
    },
  });

  const eventMap: Record<number, { name: string; revenue: number; bookings: number }> = {};

  for (const b of bookings) {
    const id = b.eventId;
    const name = b.event?.title ?? 'Unknown';
    const amount = Number(b.totalAmount);

    if (!eventMap[id]) {
      eventMap[id] = { name, revenue: amount, bookings: 1 };
    } else {
      eventMap[id].revenue += amount;
      eventMap[id].bookings += 1;
    }
  }

  const topPerformingEvents = Object.values(eventMap).map(e => ({
    name: e.name,
    bookings: e.bookings,
    revenue: e.revenue,
    avgTicketPrice: e.bookings ? e.revenue / e.bookings : 0,
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  return {
    totalEvents: Object.keys(eventMap).length,
    topPerformingEvents,
  };
};

// 🔵 USER ANALYTICS REPORT
export const getUserAnalyticsReportService = async (range: string) => {
  const { from, to } = getDateRange(range);

  const [newUsers, allUsers, activeBookings] = await Promise.all([
    db.query.userTable.findMany({
      where: and(
        gte(userTable.createdAt, from),
        lte(userTable.createdAt, to)
      ),
    }),
    db.query.userTable.findMany(),
    db.query.bookingTable.findMany({
      where: and(
        gte(bookingTable.createdAt, from),
        lte(bookingTable.createdAt, to)
      ),
    }),
  ]);

  const activeUserIds = new Set(activeBookings.map(b => b.userId));

  return {
    totalUsers: allUsers.length,
    newUsers: newUsers.length,
    activeUsers: activeUserIds.size,
  };
};

// 🟣 REVENUE REPORT
export const getRevenueReportService = async (range: string) => {
  const { from, to } = getDateRange(range);

  const payments = await db.query.paymentTable.findMany({
    where: and(
      gte(paymentTable.createdAt, from),
      lte(paymentTable.createdAt, to)
    ),
  });

  const revenueByMonth: Record<string, number> = {};
  let totalRevenue = 0;

  for (const p of payments) {
    const amount = Number(p.amount);
    const month = dayjs(p.createdAt).format('MMM YYYY');

    totalRevenue += amount;
    if (!revenueByMonth[month]) revenueByMonth[month] = 0;
    revenueByMonth[month] += amount;
  }

  return {
    totalRevenue,
    revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month,
      revenue,
    })),
  };
};

