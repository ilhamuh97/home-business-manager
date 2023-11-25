'use strict';

import { google } from 'googleapis';
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';

export async function initializeGoogleSheets(): Promise<GoogleSpreadsheet> {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: process.env.SCOPES,
  });

  const spreadsheetId = process.env.SPREAD_SHEETS_ID;
  if (typeof spreadsheetId !== 'string') {
    throw new Error('Spreadsheet ID is not valid');
  }

  const doc = new GoogleSpreadsheet(spreadsheetId, auth);
  await doc.loadInfo();

  return doc;
}

export async function loadSheetByTitle(
  doc: GoogleSpreadsheet,
  sheetTitle: string,
  headerRow: number = 1,
): Promise<GoogleSpreadsheetWorksheet> {
  const sheet = doc.sheetsByTitle[sheetTitle];
  if (!sheet) {
    throw new Error(`Sheet '${sheetTitle}' not found`);
  }
  await sheet.loadHeaderRow(headerRow);
  return sheet;
}
