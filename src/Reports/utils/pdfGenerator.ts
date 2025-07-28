 
// import PDFDocument from 'pdfkit';
// import { PassThrough } from 'stream';
// import { buffer } from 'stream/consumers'; // Native in Node.js 16+

// import {
//   getSalesReportService,
//   getEventPerformanceReportService,
//   getUserAnalyticsReportService,
//   getRevenueReportService,
// } from '../reports.service';

// // 🔄 Helper to fetch report data
// const fetchReportData = async (type: string, range: string): Promise<any> => {
//   switch (type) {
//     case 'sales':
//       return await getSalesReportService(range);
//     case 'events':
//       return await getEventPerformanceReportService(range);
//     case 'users':
//       return await getUserAnalyticsReportService(range);
//     case 'revenue':
//       return await getRevenueReportService(range);
//     default:
//       throw new Error('Invalid report type');
//   }
// };

// // ✅ PDF Generator
// export const generateReportPDF = async (type: string, range: string): Promise<Buffer> => {
//   const doc = new PDFDocument();
//   const stream = new PassThrough();
//   doc.pipe(stream);

//   const data = await fetchReportData(type, range);
//   const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

//   doc.fontSize(20).text(`${titleCase(type)} Report`, { align: 'center' });
//   doc.moveDown();

//   switch (type) {
//     case 'sales':
//       doc.fontSize(12).text(`Total Revenue: $${data.totalRevenue.toFixed(2)}`);
//       doc.text(`Total Bookings: ${data.totalBookings}`);
//       doc.text(`Average Order Value: $${data.averageOrderValue.toFixed(2)}`);
//       doc.moveDown().text('Top Events:');
//       data.topEvents.forEach((event: any, i: number) => {
//         doc.text(`${i + 1}. ${event.name} - $${event.revenue.toFixed(2)} from ${event.bookings} bookings`);
//       });
//       break;

//     case 'events':
//       doc.fontSize(14).text('Event Performance', { underline: true });
//       doc.moveDown();

//       // Header row
//       doc.font('Helvetica-Bold');
//       doc.text(`Event`.padEnd(30) + `Revenue`.padEnd(15) + `Bookings`.padEnd(12) + `Avg Ticket`, {
//         continued: false,
//       });
//       doc.font('Helvetica');
//       doc.moveDown(0.5);

//       data.forEach((event: any) => {
//         const name = event.name.padEnd(30).substring(0, 30);
//         const revenue = `$${event.revenue.toFixed(2)}`.padEnd(15);
//         const bookings = event.bookings.toString().padEnd(12);
//         const avg = `$${event.avgTicketPrice.toFixed(2)}`;
//         doc.text(`${name}${revenue}${bookings}${avg}`);
//       });
//       break;

//     case 'users':
//       doc.fontSize(12).text(`New Users: ${data.newUsers}`);
//       doc.text(`Total Users: ${data.totalUsers}`);
//       break;

//     case 'revenue':
//       doc.fontSize(12).text(`Total Revenue: $${data.totalRevenue.toFixed(2)}`);
//       doc.moveDown().text('Revenue by Payment Method:');
//       Object.entries(data.byMethod as Record<string, number>).forEach(([method, amount]) => {
//         doc.text(`- ${method}: $${amount.toFixed(2)}`);
//       });
//       break;

//     default:
//       doc.text('No data available.');
//   }

//   doc.end();

//   // Convert stream to buffer
//   const pdfBuffer: Buffer = await buffer(stream);
//   return pdfBuffer;
// };

import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { buffer } from 'stream/consumers';

import {
  getSalesReportService,
  getEventPerformanceReportService,
  getUserAnalyticsReportService,
  getRevenueReportService,
} from '../reports.service';

// 🔄 Fetch unified report data by type
const fetchReportData = async (type: string, range: string): Promise<any> => {
  switch (type) {
    case 'sales':
      return await getSalesReportService(range);
    case 'events':
      return await getEventPerformanceReportService(range);
    case 'users':
      return await getUserAnalyticsReportService(range);
    case 'revenue':
      return await getRevenueReportService(range);
    default:
      throw new Error('Invalid report type');
  }
};

export const generateReportPDF = async (type: string, range: string): Promise<Buffer> => {
  const doc = new PDFDocument();
  const stream = new PassThrough();
  doc.pipe(stream);

  const data = await fetchReportData(type, range);
  const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  doc.fontSize(20).text(`${titleCase(type)} Report`, { align: 'center' });
  doc.moveDown();

  switch (type) {
    case 'sales':
      doc.fontSize(12).text(`Total Revenue: $${data.totalRevenue.toFixed(2)}`);
      doc.text(`Total Bookings: ${data.totalBookings}`);
      doc.text(`Average Order Value: $${data.averageOrderValue.toFixed(2)}`);
      doc.moveDown().text('Top Events:');
      data.topEvents.forEach((event: any, i: number) => {
        doc.text(`${i + 1}. ${event.name} - $${event.revenue.toFixed(2)} from ${event.bookings} bookings`);
      });
      break;

    case 'events':
      doc.fontSize(14).text('Event Performance', { underline: true });
      doc.moveDown();

      doc.font('Helvetica-Bold');
      doc.text(`Event`.padEnd(30) + `Revenue`.padEnd(15) + `Bookings`.padEnd(12) + `Avg Ticket`);
      doc.font('Helvetica').moveDown(0.5);

      data.topPerformingEvents.forEach((event: any) => {
        const name = event.name.padEnd(30).substring(0, 30);
        const revenue = `$${event.revenue.toFixed(2)}`.padEnd(15);
        const bookings = event.bookings.toString().padEnd(12);
        const avg = `$${event.avgTicketPrice.toFixed(2)}`;
        doc.text(`${name}${revenue}${bookings}${avg}`);
      });
      break;

    case 'users':
      doc.fontSize(12).text(`New Users: ${data.newUsers}`);
      doc.text(`Total Users: ${data.totalUsers}`);
      doc.text(`Active Users: ${data.activeUsers}`);
      break;

    case 'revenue':
      doc.fontSize(12).text(`Total Revenue: $${data.totalRevenue.toFixed(2)}`);
      doc.moveDown().text('Revenue by Month:');
      data.revenueByMonth.forEach((entry: { month: string; revenue: number }) => {
        doc.text(`- ${entry.month}: $${entry.revenue.toFixed(2)}`);
      });
      break;

    default:
      doc.text('No data available.');
  }

  doc.end();
  return await buffer(stream);
};
