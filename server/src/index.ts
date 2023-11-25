'use strict';

import 'dotenv/config';
import express from 'express';
import routes from './routes/routes';
import cors from 'cors';

const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

export default app;
