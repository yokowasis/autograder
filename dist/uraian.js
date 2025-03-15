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
    // check if keywords has [AISCORE
    if (keywords.indexOf("[AISCORE:") !== -1) {
        // extract XX from [AISCORE:XX] using regex
        const regex = /\[AISCORE:(\d+)\]/;
        const match = keywords.match(regex);
        let score = 0;
        if (match !== null) {
            score = Number.parseFloat(match[1]) / 100;
        }
        return score;
    }
    const keywordArray0 = keywords.split("|");
    let highestScore = 0;
    for (let i = 0; i < keywordArray0.length; i++) {
        const keywords = keywordArray0[i];
        const keywordArray = keywords.split(",");
        let matchedCount = 0;
        for (let j = 0; j < keywordArray.length; j++) {
            const keyword = keywordArray[j];
            const ans = answer.replace(",", ".");
            const key = keyword.trim();
            const keyAsFloat = parseFloat(key);
            if (isNaN(keyAsFloat)) {
                if (ans.includes(key)) {
                    matchedCount++;
                }
            }
        }
        const score = matchedCount / keywordArray.length;
        if (score > highestScore) {
            highestScore = score;
        }
    }
    return highestScore;
}
exports.calculateScore = calculateScore;
