 import { Request, Response } from 'express';
import {
  getSalesReportService,
  getEventPerformanceReportService,
  getUserAnalyticsReportService,
  getRevenueReportService,
} from '../Reports/reports.service'
import { generateReportPDF } from '../Reports/utils/pdfGenerator';

// ✅ GET /api/reports/sales
export const getSalesReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const range = (req.query.range as string) || '30days';
    const report = await getSalesReportService(range);
    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch sales report' });
  }
};

// ✅ GET /api/reports/events
export const getEventsReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const range = (req.query.range as string) || '30days';
    const report = await getEventPerformanceReportService(range);
    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch events report' });
  }
};

// ✅ GET /api/reports/users
export const getUsersReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const range = (req.query.range as string) || '30days';
    const report = await getUserAnalyticsReportService(range);
    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch users report' });
  }
};

// ✅ GET /api/reports/revenue
export const getRevenueReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const range = (req.query.range as string) || '30days';
    const report = await getRevenueReportService(range);
    res.status(200).json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch revenue report' });
  }
};

// ✅ GET /api/reports/:type/download?range=
export const downloadReportPDF = async (req: Request, res: Response): Promise<void> => {
  const { type } = req.params;
  const range = (req.query.range as string) || '30days';

  try {
    const buffer = await generateReportPDF(type, range);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${type}-report.pdf`,
    });

    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to generate PDF' });
  }
};
