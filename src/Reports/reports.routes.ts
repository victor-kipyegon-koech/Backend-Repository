 import { Router } from 'express';
import {
  getSalesReport,
  getEventsReport,
  getUsersReport,
  getRevenueReport,
  downloadReportPDF,
} from '../Reports/reports.controller';

const router = Router();

// Route: /api/reports/sales?range=30days
router.get('/sales', getSalesReport);

// Route: /api/reports/events?range=30days
router.get('/events', getEventsReport);

// Route: /api/reports/users?range=30days
router.get('/users', getUsersReport);

// Route: /api/reports/revenue?range=30days
router.get('/revenue', getRevenueReport);

// Route: /api/reports/:type/download?range=30days
router.get('/:type/download', downloadReportPDF);

export default router;
