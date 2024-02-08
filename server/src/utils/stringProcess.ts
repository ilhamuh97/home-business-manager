export function capitalizeFirstLetter(sentence: string) {
  // Split the sentence into an array of words
  let words: string[] = sentence.split(' ');

  // Loop through each word in the array
  for (let i = 0; i < words.length; i++) {
    // Capitalize the first letter of each word
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the words back into a sentence and return
  return words.join(' ');
}
