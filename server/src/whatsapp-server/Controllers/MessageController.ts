// controllers/messageController.js
import WAWebJS, { Client } from 'whatsapp-web.js';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../../middlewares/googleSheets';
import { formatDate } from '../../utils/date';
import {
  createNewInvoice,
  getOrderByInvoice,
  getRowsByPropertyName,
  getRowsObject,
  getValue,
} from '../../utils/googleSheets';
import CommandHandler from '../handlers/CommandHandler';
import { Order, RawOrder } from '../../types/Order.model';
import {
  rawOrderToOrder,
  removeEmptyValues,
} from '../../utils/objectManipulation';
import { calculateTotalPrice } from '../../utils/prices';
import { RawMenu } from '../../types/Menu.model';
import { createInvoiceForCustomer } from '../../utils/stringProcess';
import dayjs from 'dayjs';

class MessageController {
  client: Client;
  commandHandler: CommandHandler;
  message!: WAWebJS.Message;
  constructor(client: Client) {
    this.client = client;
    this.commandHandler = new CommandHandler(this);
  }

  handleIncomingMessage(message: WAWebJS.Message) {
    if (message.body.startsWith('/')) {
      this.message = message;
      this.commandHandler.handle(message.body);
    } else {
      console.log('Received message:', message.body);
    }
  }

  async handleSendOrder(args: string[]) {
    // Implement logic to handle the "/send-order" command and process order data
    const newOrder = this.parseOrderData(args);

    /**
     * Handle date
     */
    newOrder['Order Date'] = newOrder['Order Date']
      ? formatDate(newOrder['Order Date'])
      : dayjs().format('DD MMMM YYYY');

    newOrder['Shipment Date'] = newOrder['Shipment Date']
      ? formatDate(newOrder['Shipment Date'])
      : '';

    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order', 2);
      const orders = getRowsObject<RawOrder>(await sheet.getRows<Order>());
      const existingInvoiceNumbers = orders.map((order) =>
        getValue(order['Invoice']),
      );

      const sentKeys = Object.keys(newOrder);
      const missingKeys = sentKeys.filter(
        (key) => !sheet.headerValues.includes(key),
      );

      if (missingKeys.length > 0) {
        throw {
          name: 'Bad Request',
          message: `Error: Missing keys in sent data: ${missingKeys.join(
            ', ',
          )}`,
        };
      }

      if (
        getValue(newOrder['Phone Number']) === '' ||
        getValue(newOrder.Name) === ''
      ) {
        throw {
          name: 'Bad Request',
          message: 'Name and Phone Number cannot be empty!',
        };
      }
      if (newOrder.Invoice === undefined || newOrder.Invoice === '') {
        /**
         * Handle invoice number
         */
        const newInvoice = createNewInvoice(existingInvoiceNumbers);
        newOrder.Invoice = newInvoice;
      }

      const containsOnlyNonNumeric = /^[^0-9]+$/.test(newOrder.Invoice);
      if (containsOnlyNonNumeric) {
        const newInvoice = createNewInvoice(
          existingInvoiceNumbers,
          newOrder.Invoice,
        );
        newOrder.Invoice = newInvoice;
      }

      const existingOrder = orders.find(
        (row) => row['Invoice'] === newOrder.Invoice,
      );
      if (existingOrder !== undefined) {
        throw {
          name: 'Bad Request',
          message: 'The invoice already exists!',
        };
      }

      const totalPrice = await calculateTotalPrice(newOrder, doc);
      newOrder['Total Price'] = String(totalPrice);

      // Add row
      await sheet.addRow(newOrder);

      // Reply Message
      const addedOrder = await getOrderByInvoice(doc, newOrder.Invoice);
      const parsedObject = JSON.parse(
        JSON.stringify(removeEmptyValues(addedOrder)),
      );
      let replyMessage = `Send an order ${newOrder.Invoice} with data:\n`;
      for (const [key, value] of Object.entries(parsedObject)) {
        if (value != '' || value != undefined) {
          replyMessage += `${key}: ${value}\n`;
        }
      }
      await this.client.sendMessage(this.message.from, replyMessage);
    } catch (error: any) {
      await this.client.sendMessage(this.message.from, error.message);
    }
  }

  handleGetTemplate(args: string[]) {
    // Implement logic to handle the "/get-template" command
    const command = args[0];
    this.commandHandler.handle(command, true);
  }

  async handleUpdate(args: string[], params: string[]) {
    // Implement logic to handle the "/update/:id" command with the provided ID
    const invoice = params[0];
    const updateOrder = this.parseOrderData(args);

    // Parse Order Date
    if (updateOrder['Order Date']) {
      updateOrder['Order Date'] = formatDate(updateOrder['Order Date']);
    } else {
      updateOrder['Order Date'] = dayjs().format('DD MMMM YYYY');
    }

    // Parse Shipment Date
    if (updateOrder['Shipment Date']) {
      updateOrder['Shipment Date'] = formatDate(updateOrder['Shipment Date']);
    }

    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order', 2);
      const rawRows = await sheet.getRows<RawOrder>();
      const requestedOrder = getRowsByPropertyName(
        rawRows,
        'Invoice',
        invoice,
      )[0];
      if (requestedOrder === undefined) {
        throw {
          name: 'Not Found',
          message: `Order with invoice number ${invoice} is not found`,
        };
      }

      const sentKeys = Object.keys(updateOrder);
      const missingKeys = sentKeys.filter(
        (key) => !sheet.headerValues.includes(key),
      );

      if (missingKeys.length > 0) {
        throw {
          name: 'Bad Request',
          message: `Error: Missing keys in sent data: ${missingKeys.join(
            ', ',
          )}`,
        };
      }

      if (invoice !== updateOrder.Invoice) {
        const existingOrder = getRowsObject<RawOrder>(rawRows).find(
          (row) => row.Invoice === updateOrder.Invoice,
        );
        if (existingOrder !== undefined) {
          throw {
            name: 'Bad Request',
            message: 'The invoice already exists!',
          };
        }
      }

      Object.keys(updateOrder).forEach((key) => {
        requestedOrder.set(key, updateOrder[key]);
      });

      // Update Total Price
      if (getValue(updateOrder['Total Price']) === '') {
        requestedOrder.set('Total Price', '');
        const copyRequestedOrder = JSON.parse(
          JSON.stringify(requestedOrder.toObject()),
        );
        const totalPrice = await calculateTotalPrice(copyRequestedOrder, doc);
        requestedOrder.set('Total Price', String(totalPrice));
      }

      await requestedOrder.save();

      const getUpdatedOrder = await getOrderByInvoice(doc, invoice);
      const parsedObject = JSON.parse(
        JSON.stringify(removeEmptyValues(getUpdatedOrder)),
      );

      let replyMessage = `Updating order ${invoice} with data:\n`;
      for (const [key, value] of Object.entries(parsedObject)) {
        if (value != '' || value != undefined) {
          replyMessage += `${key}: ${value}\n`;
        }
      }
      await this.client.sendMessage(this.message.from, replyMessage);
    } catch (error: any) {
      await this.client.sendMessage(this.message.from, error.message);
    }
  }

  async handleGetInvoice(params: string[]) {
    // Implement logic to handle the "/get-order <invoice>" command with the provided ID
    const invoice = params[0];
    try {
      const doc = await initializeGoogleSheets();
      const orderSheet = await loadSheetByTitle(doc, 'Order', 2);
      const menuSheet = await loadSheetByTitle(doc, 'Menu');
      const menuRows: Partial<RawMenu>[] = getRowsObject(
        await menuSheet.getRows<RawMenu>(),
      );
      const orderRows: Partial<RawOrder>[] = getRowsObject(
        await orderSheet.getRows<RawOrder>(),
      );
      const orders: Order[] = rawOrderToOrder(orderRows, menuRows);
      const requestedOrder = orders.find((order) => order.invoice === invoice);

      if (requestedOrder === undefined) {
        throw {
          name: 'Not Found',
          message: `Order with invoice ${invoice} is not found`,
        };
      }

      const invoiceText = createInvoiceForCustomer(requestedOrder);

      await this.client.sendMessage(this.message.from, invoiceText);
    } catch (error: any) {
      await this.client.sendMessage(this.message.from, error.message);
    }
  }

  async handleGetOrder(params: string[]) {
    // Implement logic to handle the "/get-order <invoice>" command with the provided ID
    const invoice = params[0];
    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order', 2);
      const requestedOrder = getRowsObject<RawOrder>(
        await sheet.getRows<RawOrder>(),
      )?.find((row): boolean => row.Invoice === invoice);
      if (requestedOrder === undefined) {
        throw {
          name: 'Not Found',
          message: `Order with invoice ${invoice} is not found`,
        };
      }

      const parsedObject = JSON.parse(JSON.stringify(requestedOrder));
      let replyMessage = 'Here are the details:\n';
      for (const [key, value] of Object.entries(parsedObject)) {
        if (value != '' || value != undefined) {
          replyMessage += `${key}: ${value}\n`;
        }
      }
      await this.client.sendMessage(this.message.from, replyMessage);
    } catch (error: any) {
      await this.client.sendMessage(this.message.from, error.message);
    }
  }

  async handleGetCommands() {
    // Implement logic to handle the "/get-commands" command
    try {
      const replyMessage =
        'Available commands:\n1. /send-order\n2. /get-template /<Command>\n3. /update-order <Invoice Number>\n4. /get-order <Invoice Number>\n5. /get-commands\n6. /get-invoice';
      await this.client.sendMessage(this.message.from, replyMessage);
    } catch (error: any) {
      await this.client.sendMessage(this.message.from, error.message);
    }
  }

  async sendTemplate(replyMessage: string) {
    try {
      await this.client.sendMessage(this.message.from, replyMessage);
    } catch (error: any) {
      await this.client.sendMessage(this.message.from, error.message);
    }
  }

  async handleUnknown(command: string) {
    try {
      let replyMessage = `Unknown command "${command}".\nPlease type "/get-commands" to view the list of available commands.`;
      await this.client.sendMessage(this.message.from, replyMessage);
    } catch (error: any) {
      await this.client.sendMessage(this.message.from, error.message);
    }
  }

  private parseOrderData(args: string[]): RawOrder {
    const orderData: any = {};
    args.forEach((arg) => {
      const [key, value] = arg.split(':');
      if (key && value) {
        orderData[key.trim()] = value.trim();
      }
    });
    return orderData;
  }
}

export default MessageController;
