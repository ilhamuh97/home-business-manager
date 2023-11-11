'use strict';

import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { Order } from '../types/order.type';
import { formatDateToDDMonthYYYY } from '../utils/date';
import {
  createNewInvoice,
  getRowsByPropertyName,
  getRowsObject,
} from '../utils/googleSheets';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../middlewares/googleSheets';

export class OrderController {
  public static async getAllOrders(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order');
      const rows = getRowsObject(await sheet.getRows<Order>());

      res.send({
        data: rows,
        message: 'Successfully get all orders',
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getOrderByInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const invoice = req.params.invoice;
    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order');
      const requestedOrder = getRowsObject(await sheet.getRows<Order>())?.find(
        (row: Order) => row.Invoice === invoice,
      );
      if (requestedOrder === undefined) {
        throw {
          name: 'Not Found',
          message: `Order with invoice ${invoice} is not found`,
        };
      }

      res.send({
        data: requestedOrder,
        message: 'Successfully get an order',
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const newOrder = req.body.data as Order;
    newOrder['Order Date'] = formatDateToDDMonthYYYY(new Date());
    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order');
      const orders = getRowsObject(await sheet.getRows<Order>());
      const existingInvoiceNumbers = orders.map((order) => order['Invoice']);
      if (newOrder.Invoice === undefined || newOrder.Invoice === '') {
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

      const existingOrder: Partial<Order> | undefined = orders.find(
        (row) => row['Invoice'] === newOrder.Invoice,
      );
      if (existingOrder !== undefined) {
        throw {
          name: 'Bad Request',
          message: 'The invoice already exists!',
        };
      }

      await sheet.addRow(newOrder);
      res.status(httpStatus.CREATED).send({
        data: newOrder,
        message: 'Successfully create an order',
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateOrderByInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const invoice = req.params.invoice;
    const updateOrder = req.body.data as Order;
    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order');
      const rawRows = await sheet.getRows<Order>();
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

      if (invoice !== updateOrder.Invoice) {
        const existingOrder: Partial<Order> | undefined = getRowsObject(
          rawRows,
        ).find((row) => row['Invoice'] === updateOrder.Invoice);
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
      await requestedOrder.save();

      res.send({
        data: requestedOrder.toObject(),
        message: 'Successfully update an order',
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteOrderByInvoice(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const invoice = req.params.invoice;
    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order');
      const requestedOrder = getRowsByPropertyName(
        await sheet.getRows<Order>(),
        'Invoice',
        invoice,
      )[0];
      if (requestedOrder === undefined) {
        throw {
          name: 'Bad Request',
          message: `Order with invoice ${invoice} is not found`,
        };
      }

      await requestedOrder.delete();

      res.send({
        message: `Successfully delete an order ${invoice}`,
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
