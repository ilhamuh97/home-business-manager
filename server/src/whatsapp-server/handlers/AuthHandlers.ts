import WAWebJS from 'whatsapp-web.js';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../../middlewares/googleSheets';
import { RawAuth } from '../../types/Auth.model';
import { getRowsObject } from '../../utils/googleSheets';

export async function isAuthenticated(message: WAWebJS.Message) {
  try {
    const auths = await getAuthPhoneNumbers();
    const phoneNumber = message.author || message.from;
    return auths.includes(phoneNumber);
  } catch (error) {
    console.error('Error occurred while checking authentication:', error);
    return false;
  }
}

async function getAuthPhoneNumbers() {
  const doc = await initializeGoogleSheets();
  const sheet = await loadSheetByTitle(doc, 'Auth', 1);
  const rawAuths = getRowsObject<RawAuth>(await sheet.getRows<RawAuth>());

  return rawAuths
    .filter(
      (auth) =>
        auth['Phone Number'] !== undefined && auth['Phone Number'] !== '',
    )
    .map((auth) => `${auth['Phone Number']}@c.us`);
}
