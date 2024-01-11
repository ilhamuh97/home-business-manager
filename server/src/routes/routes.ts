import { Router } from 'express';
import orderRoutes from './order.routes';
import errorHandlers from '../middlewares/errorHandlers';
import customerRoutes from './customer.routes';
import authRoutes from './auth.routes';
import { authAdmin } from '../middlewares/auth';
import menuRoutes from './menu.routes';

const router = Router();

// Use the order routes
router.use('/login', authRoutes);
router.use('/orders', authAdmin, orderRoutes);
router.use('/customers', authAdmin, customerRoutes);
router.use('/menu', authAdmin, menuRoutes);

// error
router.use(errorHandlers);

export default router;
