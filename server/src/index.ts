'use strict';

import 'dotenv/config';
import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import { Client, LocalAuth } from 'whatsapp-web.js';
import MessageController from './whatsapp-server/Controllers/MessageControllers';
import errorHandler from 'errorhandler';

const app = express();

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: process.env.WA_FOLDER,
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu',
    ],
  },
});
const messageController = new MessageController(client);

client.on('qr', (qr) => {
  console.log('QR:', qr);
});

client.on('ready', () => {
  console.log('WhatsApp Bot is ready!');
});

client.on('message', (message) => {
  messageController.handleIncomingMessage(message);
});

app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  return console.log(`Server is listening on ${app.get('port')}`);
});

client.initialize();

export default app;
