'use strict';

import { Router } from 'express';
import { OrderController } from '../Controllers/OrderController';

const router = Router();

router.get('/', OrderController.getAllOrders);
router.get('/order/:invoice', OrderController.getOrderByInvoice);
router.post('/order', OrderController.createOrder);
router.put('/order/:invoice', OrderController.updateOrderByInvoice);
router.delete('/order/:invoice', OrderController.deleteOrderByInvoice);

export default router;
