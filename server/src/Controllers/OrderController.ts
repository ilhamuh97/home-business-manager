'use strict';

import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import {
  createNewInvoice,
  getRowsByPropertyName,
  getRowsObject,
  getValue,
} from '../utils/googleSheets';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../middlewares/googleSheets';
import { Order, RawOrder } from '../types/Order.model';
import { rawOrderToOrder } from '../utils/objectManipulation';
import { RawMenu } from '../types/Menu.model';
import dayjs from 'dayjs';

export class OrderController {
  public static async getAllOrders(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
      res.status(200).json({
        data: orders,
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
    const invoice: string = req.params.invoice;
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

      res.status(200).json({
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
    const newOrder = req.body.data as RawOrder;
    newOrder['Order Date'] = dayjs().format('DD MMMM YYYY');
    try {
      const doc = await initializeGoogleSheets();
      const sheet = await loadSheetByTitle(doc, 'Order', 2);
      const orders = getRowsObject<RawOrder>(await sheet.getRows<Order>());
      const existingInvoiceNumbers = orders.map((order) =>
        getValue(order['Invoice']),
      );
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

      const existingOrder = orders.find(
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
    const updateOrder = req.body.data as RawOrder;
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
      await requestedOrder.save();

      res.status(200).json({
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
      const sheet = await loadSheetByTitle(doc, 'Order', 2);
      const requestedOrder = getRowsByPropertyName(
        await sheet.getRows<RawOrder>(),
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

      res.status(200).json({
        message: `Successfully delete an order ${invoice}`,
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
