'use strict';

import 'dotenv/config';
import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import { Client, LocalAuth, NoAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import MessageController from './whatsapp-server/Controllers/MessageControllers';
import errorHandler from 'errorhandler';

const app = express();

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: 'mybot',
  }),
});
const messageController = new MessageController(client);

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
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

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'hello world',
  });
});

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
