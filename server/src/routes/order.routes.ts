'use strict';

import { Router } from 'express';
import { OrderController } from '../Controllers/OrderController';

const orderRoutes = Router();

orderRoutes.get('/', OrderController.getAllOrders);
orderRoutes.get('/order/:invoice', OrderController.getOrderByInvoice);
orderRoutes.post('/order', OrderController.createOrder);
orderRoutes.put('/order/:invoice', OrderController.updateOrderByInvoice);
orderRoutes.delete('/order/:invoice', OrderController.deleteOrderByInvoice);

export default orderRoutes;
