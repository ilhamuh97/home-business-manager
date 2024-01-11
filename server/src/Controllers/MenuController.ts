import { NextFunction, Request, Response } from 'express';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../middlewares/googleSheets';
import { getRowsObject } from '../utils/googleSheets';
import { rawMenuToMenu } from '../utils/objectManipulation';
import { Menu, RawMenu } from '../types/Menu.model';

export class MenuController {
  public static async getAllMenu(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const doc = await initializeGoogleSheets();
      const menuSheet = await loadSheetByTitle(doc, 'Menu', 1);
      const rawMenu: Partial<RawMenu>[] = getRowsObject(
        await menuSheet.getRows<RawMenu>(),
      );
      const menu: Menu[] = rawMenuToMenu(rawMenu);

      res.send({
        data: menu,
        message: 'Successfully get all menu',
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
