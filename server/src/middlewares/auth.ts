import { Request, Response, NextFunction } from 'express';
import { getRowsObject } from '../utils/googleSheets';
import { initializeGoogleSheets, loadSheetByTitle } from './googleSheets';

async function authAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // const { access_token: accessToken } = req.headers;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      throw { name: 'Invalid Auth', message: 'Invalid Access Token' };
    } else {
      const userData = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${authorization}`,
            Accept: 'application/json',
          },
        },
      );

      if (!userData.ok) {
        throw {
          name: 'Invalid Auth',
          message: 'Failed to fetch user data',
        };
      }

      const user: any = await userData.json();
      const doc = await initializeGoogleSheets();
      const AuthSheet = await loadSheetByTitle(doc, 'Auth', 1);
      const rawAuths: Partial<any>[] = getRowsObject(
        await AuthSheet.getRows<any>(),
      );

      const existingAuth: any = rawAuths.find(
        (auth) => auth.Email === user.email,
      );

      if (
        !(
          existingAuth &&
          existingAuth.Name.toLowerCase() === user.name.toLowerCase()
        )
      ) {
        throw { name: 'Invalid Auth', message: 'Invalid Access Token' };
      }
      next();
    }
  } catch (error) {
    next(error);
  }
}

export { authAdmin };
