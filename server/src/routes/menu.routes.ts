'use strict';

import { Router } from 'express';
import { MenuController } from '../Controllers/MenuController';

const menuRoutes = Router();

menuRoutes.get('/', MenuController.getAllMenu);

export default menuRoutes;
