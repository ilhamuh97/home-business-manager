import {
  initializeGoogleSheets,
  loadSheetByTitle,
} from '../middlewares/googleSheets';

export function capitalizeFirstLetter(sentence: string) {
  let words: string[] = sentence.split(' ');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(' ');
}

export async function getReadableRawOrder() {
  try {
    const doc = await initializeGoogleSheets();
    const sheet = await loadSheetByTitle(doc, 'Order', 2);
    const rawRows = sheet.headerValues;

    return rawRows
      .map((rawRow) => {
        return `${rawRow}: `;
      })
      .join('\n');
  } catch (error: any) {
    console.log(error.message);
  }
}
