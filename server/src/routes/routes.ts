import { Router } from 'express';
import orderRoutes from './order.routes'; // Import the order routes
import errorHandlers from '../middlewares/errorHandlers';

const router = Router();

// Use the order routes
router.use('/orders', orderRoutes);

// error
router.use(errorHandlers);

export default router;
