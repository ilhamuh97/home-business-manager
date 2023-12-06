import { Router } from 'express';
import orderRoutes from './order.routes';
import errorHandlers from '../middlewares/errorHandlers';
import customerRoutes from './customer.routes';

const router = Router();

// Use the order routes
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);

// error
router.use(errorHandlers);

export default router;
