'use strict';

import 'dotenv/config';
import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import WAWebJS, { Client, LocalAuth } from 'whatsapp-web.js';
import MessageController from './whatsapp-server/Controllers/MessageController';
import errorHandler from 'errorhandler';
import { isAuthenticated } from './whatsapp-server/handlers/AuthHandlers';
import qrcode from 'qrcode-terminal';

const app = express();

/**
 * WA Bot Setup
 * 
const wwebVersion = '2.2412.50';
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: process.env.WA_FOLDER,
  }),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  webVersionCache: {
    type: 'remote',
    remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
  },
});
const messageController = new MessageController(client);

client.on('qr', (qr: string) => {
  qrcode.generate(qr, { small: true });
  console.log('QR:', qr);
});

client.on('ready', () => {
  console.log('WhatsApp Bot is ready!');
});

client.on('message', async (message: WAWebJS.Message) => {
  try {
    const isAuth = await isAuthenticated(message);
    if (isAuth) {
      messageController.handleIncomingMessage(message);
    }
  } catch (error: any) {
    console.error(error);
  }
});
 */

/**
 * BE
 */
app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Routes
 */
app.use('/api', routes);

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

/**
 * WA Bot initialize
client.initialize();
 */

export default app;
