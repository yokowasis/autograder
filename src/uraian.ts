export function extractNumber(str: string) {
  const regex = /-?(\d+\.\d+)|(-?\d+)/; // Regular expression to find number or float with optional -
  const match = str.match(regex);
  if (match !== null) {
    return parseFloat(match[0]);
  } else {
    return 0;
  }
}

export function calculateScore(keywords: string, answer: string): number {
  const keywordArray0: string[] = keywords.split("|");
  let highestScore = 0;

  keywordArray0.forEach((keywords: string) => {
    // Split the keywords into an array
    const keywordArray: string[] = keywords.split(",");

    // Initialize a count variable for the number of matched keywords
    let matchedCount = 0;

    // Loop through each keyword and check if it exists in the answer
    keywordArray.forEach((keyword: string) => {
      const ans = answer.toLowerCase().replace(",", ".");
      const key = keyword.toLowerCase().trim();
      const keyAsFloat = parseFloat(key);

      if (isNaN(keyAsFloat)) {
        if (ans.includes(key)) {
          matchedCount++;
        }
      } else {
        if (extractNumber(ans) === keyAsFloat) {
          console.log(extractNumber(ans));
          console.log(keyAsFloat);
          matchedCount++;
        }
      }
    });

    const score = matchedCount / keywordArray.length;

    if (score > highestScore) {
      highestScore = score;
    }
  });

  return highestScore;
}
