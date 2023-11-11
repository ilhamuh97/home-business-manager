'use strict';

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';

export default async function errorHandlers(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  switch (error.name) {
    case 'Forbidden':
      res.status(httpStatus.FORBIDDEN).json({
        status: 'error',
        message: error.message,
      });
      break;
    case 'Invalid Auth':
      res.status(httpStatus.UNAUTHORIZED).json({
        status: 'error',
        message: error.message,
      });
      break;
    case 'Bad Request':
      res.status(httpStatus.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
      break;
    case 'Not Found':
      res.status(httpStatus.NOT_FOUND).json({
        status: 'error',
        message: error.message,
      });
      break;
    default:
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
      break;
  }
}
