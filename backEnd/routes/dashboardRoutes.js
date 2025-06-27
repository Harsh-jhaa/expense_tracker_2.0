import express from 'express';
// import Expense from "../models/Expense";
import protect from '../middlewares/authMiddleware.js';
import getDashboardData from '../controllers/dashboardController.js';

const router = express.Router();
// Route to get dashboard data
router.get('/', protect, getDashboardData);

export default router;
