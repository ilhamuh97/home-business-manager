import WAWebJS from 'whatsapp-web.js';
import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../../middlewares/googleSheets';
import { RawAuth } from '../../types/Auth.model';
import { getRowsObject } from '../../utils/googleSheets';

export async function isAuthenticated(message: WAWebJS.Message) {
  try {
    const auths = await getAuthPhoneNumbers(); // Fetch authorized phone numbers
    const phoneNumber = message.author || message.from; // Use message author or sender's number
    return auths.includes(phoneNumber); // Check if the phone number is authorized
  } catch (error) {
    console.error('Error occurred while checking authentication:', error);
    return false; // Return false if any error occurs
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
