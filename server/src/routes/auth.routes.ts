'use strict';

import { Router } from 'express';
import { AuthController } from '../Controllers/AuthController';

const authRoutes = Router();

authRoutes.get('/', AuthController.login);

export default authRoutes;
