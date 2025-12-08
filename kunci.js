// Comprehensive test data covering all possible scenarios
const sampleData = /** @type {import("./types.js").TypeOfJawaban} */ ({
  // Regular multiple choice - correct answers
  1: "A",
  2: "B", 
  3: "C",
  4: "D",
  5: "S",
  
  // Regular multiple choice - incorrect answers
  6: "A",  // Should be B
  7: "C",  // Should be D
  
  // Check questions
  8: "check",     // Correct: check answer for check key
  9: "-check",    // Incorrect: -check answer for check key
  10: "",         // Incorrect: blank (empty string) answer for check key
  
  // -check questions  
  11: "-check",   // Correct: -check answer for -check key
  12: "",         // Correct: blank (empty string) answer for -check key
  13: "check",    // Incorrect: check answer for -check key
  
  // Mixed scenarios
  14: "check",    // Correct: check for check
  15: "",         // Correct: blank (empty string) for -check
});

const kunciJawaban = /** @type {import("./types.js").TypeOfKunci} */ ({
  // Regular multiple choice answer keys
  1: "A",
  2: "B",
  3: "C", 
  4: "D",
  5: "S",
  6: "B",
  7: "D",
  
  // Check answer keys (only "check" is correct)
  8: "check",
  9: "check",
  10: "check",
  
  // -check answer keys (both "-check" and "blank" are correct)
  11: "-check",
  12: "-check", 
  13: "-check",
  14: "check",
  15: "-check"
});

const bobot = /** @type {import("./types.js").TypeOfBobot} */ ({
  1: "5",   // Different weights to test scoring
  2: "5",
  3: "5",
  4: "5", 
  5: "5",
  6: "3",
  7: "3",
  8: "4",
  9: "4",
  10: "4",
  11: "2",
  12: "2",
  13: "2", 
  14: "4",
  15: "2"
});

/**
 * Calculate score based on answers, answer key, and weights
 * @param {import("./types.js").TypeOfJawaban} jawaban - Student answers
 * @param {import("./types.js").TypeOfKunci} kunci - Answer key
 * @param {import("./types.js").TypeOfBobot} bobot - Question weights
 * @returns {{nilai: number, benar: number, salah: number}} Score result with total score, correct count, and incorrect count
 */
function calculateScore(jawaban, kunci, bobot) {
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  
  for (const questionNum in kunci) {
    const studentAnswer = jawaban[questionNum];
    const correctAnswer = kunci[questionNum];
    const weight = parseInt(bobot[questionNum]);
    
    let isCorrect = false;
    
    // Handle check/uncheck questions
    if (correctAnswer === "check" || correctAnswer === "-check") {
      if (correctAnswer === "check") {
        // For "check" key: only "check" answer is correct
        isCorrect = (studentAnswer === "check");
      } else if (correctAnswer === "-check") {
        // For "-check" key: both "-check" and blank (empty string) answers are correct
        isCorrect = (studentAnswer === "-check" || studentAnswer === "");
      }
    } else {
      // Handle regular multiple choice questions (A, B, C, D, S, etc.)
      isCorrect = (studentAnswer === correctAnswer);
    }
    
    if (isCorrect) {
      totalScore += weight;
      correctCount++;
    } else {
      incorrectCount++;
    }
  }
  
  return {
    nilai: totalScore,
    benar: correctCount,
    salah: incorrectCount
  };
}

// Test data with check/uncheck questions
const testDataWithChecks = /** @type {import("./types.js").TypeOfJawaban} */ ({
  1: "A",        // Multiple choice
  2: "check",    // Check question
  3: "-check",   // Uncheck question  
  4: "blank",    // Blank answer
  5: "check",    // Check question
  6: "B"         // Multiple choice
});

const testKeyWithChecks = /** @type {import("./types.js").TypeOfKunci} */ ({
  1: "A",        // Correct: A
  2: "check",    // Correct: check
  3: "-check",   // Correct: -check or blank
  4: "-check",   // Correct: -check or blank  
  5: "-check",   // Correct: -check or blank (student answered check - should be wrong)
  6: "B"         // Correct: B
});

// Test comprehensive scenarios
const testResult = calculateScore(sampleData, kunciJawaban, bobot);
console.log("=== Comprehensive Test Scenarios ===");
console.log("Sample answers:", sampleData);
console.log("Answer key:", kunciJawaban);
console.log("Weights:", bobot);
console.log("Test result:", testResult);

// Detailed breakdown
console.log("\n=== Detailed Question Analysis ===");
for (const questionNum in kunciJawaban) {
  const studentAnswer = sampleData[questionNum];
  const correctAnswer = kunciJawaban[questionNum];
  const weight = parseInt(bobot[questionNum]);
  
  let isCorrect = false;
  let explanation = "";
  
  // Determine if answer is correct and provide explanation
  if (correctAnswer === "check" || correctAnswer === "-check") {
    if (correctAnswer === "check") {
      isCorrect = (studentAnswer === "check");
      explanation = `Check question: need "check", got "${studentAnswer || '(empty)'}"`;
    } else if (correctAnswer === "-check") {
      isCorrect = (studentAnswer === "-check" || studentAnswer === "");
      explanation = `Uncheck question: need "-check" or empty, got "${studentAnswer || '(empty)'}"`;
    }
  } else {
    isCorrect = (studentAnswer === correctAnswer);
    explanation = `Multiple choice: need "${correctAnswer}", got "${studentAnswer}"`;
  }
  
  console.log(`Q${questionNum}: ${isCorrect ? '✓' : '✗'} ${explanation} (Weight: ${weight})`);
}
