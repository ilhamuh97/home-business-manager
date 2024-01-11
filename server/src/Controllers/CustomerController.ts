import { NextFunction, Request, Response } from 'express';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../middlewares/googleSheets';
import { getRowsObject } from '../utils/googleSheets';
import { Customer, RawCustomer } from '../types/Customer.model';
import { rawCustomersToCustomer } from '../utils/objectManipulation';

export class CustomerController {
  public static async getAllCustomers(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const doc = await initializeGoogleSheets();
      const customerSheet = await loadSheetByTitle(doc, 'Customer', 1);
      const rawCustomers: Partial<RawCustomer>[] = getRowsObject(
        await customerSheet.getRows<RawCustomer>(),
      );
      const customers: Customer[] = rawCustomersToCustomer(rawCustomers);

      res.send({
        data: customers,
        message: 'Successfully get all customers',
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
