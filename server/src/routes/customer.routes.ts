'use strict';

import { Router } from 'express';
import { CustomerController } from '../Controllers/CustomerController';

const customerRoutes = Router();

customerRoutes.get('/', CustomerController.getAllCustomers);

export default customerRoutes;
