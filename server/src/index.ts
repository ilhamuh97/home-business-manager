'use strict';

import 'dotenv/config';
import express from 'express';
import routes from './routes/routes';

const app = express();
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

export default app;
