"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateScore = exports.extractNumber = void 0;
function extractNumber(str) {
    const regex = /-?(\d+\.\d+)|(-?\d+)/; // Regular expression to find number or float with optional -
    const match = str.match(regex);
    if (match !== null) {
        return parseFloat(match[0]);
    }
    else {
        return 0;
    }
}
exports.extractNumber = extractNumber;
function calculateScore(keywords, answer) {
    const keywordArray0 = keywords.split("|");
    let highestScore = 0;
    keywordArray0.forEach((keywords) => {
        // Split the keywords into an array
        const keywordArray = keywords.split(",");
        // Initialize a count variable for the number of matched keywords
        let matchedCount = 0;
        // Loop through each keyword and check if it exists in the answer
        keywordArray.forEach((keyword) => {
            const ans = answer.toLowerCase().replace(",", ".");
            const key = keyword.toLowerCase().trim();
            const keyAsFloat = parseFloat(key);
            if (isNaN(keyAsFloat)) {
                if (ans.includes(key)) {
                    matchedCount++;
                }
            }
            else {
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
exports.calculateScore = calculateScore;
