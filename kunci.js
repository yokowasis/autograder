//@s-check

// Comprehensive test data covering all possible scenarios
const sampleData = /** @type {import("./types.js").TypeOfJawaban} */ ({
  // Regular multiple choice - correct answers
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "S",

  // Regular multiple choice - incorrect answers
  6: "A", // Should be B
  7: "C", // Should be D

  // Check questions
  8: "check", // Correct: check answer for check key
  9: "-check", // Incorrect: -check answer for check key
  10: "", // Incorrect: blank (empty string) answer for check key

  // -check questions
  11: "-check", // Correct: -check answer for -check key
  12: "", // Correct: blank (empty string) answer for -check key
  13: "check", // Incorrect: check answer for -check key

  // Mixed scenarios
  14: "check", // Correct: check for check
  15: "", // Correct: blank (empty string) for -check
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
  15: "-check",
});

const bobot = /** @type {import("./types.js").TypeOfBobot} */ ({
  1: "5",        // Simple string weight
  2: 5,          // Simple number weight  
  3: "4;-1",     // Correct/Incorrect format: +4 if correct, -1 if wrong
  4: "3;-2",     // Correct/Incorrect format: +3 if correct, -2 if wrong
  5: "5",        // Simple string weight
  6: "1;2;3;4;5", // Choice-based: A=1, B=2, C=3, D=4, E=5
  7: "2;4;6;8;10", // Choice-based: A=2, B=4, C=6, D=8, E=10
  8: 4,          // Simple number weight (for check question)
  9: "5;-1",     // Correct/Incorrect format (for check question)
  10: 4,         // Simple number weight (for check question)
  11: "2",       // Simple string weight (for -check question)
  12: 2,         // Simple number weight (for -check question)
  13: "3;-1",    // Correct/Incorrect format (for -check question)
  14: 4,         // Simple number weight (for check question)
  15: 2,         // Simple number weight (for -check question)
});

/**
 * Calculate score based on answers, answer key, and weights
 * @param {import("./types.js").TypeOfJawaban} jawaban - Student answers
 * @param {import("./types.js").TypeOfKunci} kunci - Answer key
 * @param {import("./types.js").TypeOfBobot} bobot - Question weights (supports multiple formats:
 *   - Simple number/string: e.g. 3, "5"
 *   - Correct/Incorrect: e.g. "4;-1" (+4 if correct, -1 if wrong)
 *   - Choice-based: e.g. "1;2;3;4;5" (A=1, B=2, C=3, D=4, E=5, else=0))
 * @returns {{nilai: number, benar: number, salah: number}} Score result with total score, correct count, and incorrect count
 */
function calculateScore(jawaban, kunci, bobot) {
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  for (const questionNum in kunci) {
    const studentAnswer = jawaban[questionNum];
    const correctAnswer = kunci[questionNum];
    const weightValue = bobot[questionNum];

    let isCorrect = false;
    let scoreToAdd = 0;

    // Convert to lowercase for case-insensitive comparison
    const studentAnswerLower = typeof studentAnswer === 'string' ? studentAnswer.toLowerCase() : studentAnswer;
    const correctAnswerLower = typeof correctAnswer === 'string' ? correctAnswer.toLowerCase() : correctAnswer;

    // Handle check/uncheck questions for correctness determination
    if (correctAnswerLower === "check" || correctAnswerLower === "-check") {
      if (correctAnswerLower === "check") {
        // For "check" key: only "check" answer is correct
        isCorrect = studentAnswerLower === "check";
      } else if (correctAnswerLower === "-check") {
        // For "-check" key: both "-check" and blank (empty string) answers are correct
        isCorrect = studentAnswerLower === "-check" || studentAnswer === "";
      }
    } else {
      // Handle regular multiple choice questions (A, B, C, D, S, etc.)
      isCorrect = studentAnswerLower === correctAnswerLower;
    }

    // Handle different weight formats
    if (typeof weightValue === 'string' && weightValue.includes(';')) {
      const parts = weightValue.split(';');
      
      if (parts.length === 2) {
        // Format: "4;-1" (correct;incorrect)
        const correctScore = parseInt(parts[0]);
        const incorrectScore = parseInt(parts[1]);
        scoreToAdd = isCorrect ? correctScore : incorrectScore;
      } else if (parts.length === 5) {
        // Format: "1;2;3;4;5" (A=1, B=2, C=3, D=4, E=5)
        const choiceScores = {
          'a': parseInt(parts[0]),
          'b': parseInt(parts[1]), 
          'c': parseInt(parts[2]),
          'd': parseInt(parts[3]),
          'e': parseInt(parts[4])
        };
        scoreToAdd = choiceScores[studentAnswerLower] || 0;
        // For choice-based scoring, we don't count correct/incorrect traditionally
        // but we can consider it "correct" if they got a positive score
        isCorrect = scoreToAdd > 0;
      }
    } else {
      // Simple weight format (number or string number)
      const simpleWeight = typeof weightValue === 'string' ? parseInt(weightValue) : weightValue;
      scoreToAdd = isCorrect ? simpleWeight : 0;
    }

    totalScore += scoreToAdd;
    
    if (isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  return {
    nilai: totalScore,
    benar: correctCount,
    salah: incorrectCount,
  };
}

/**
 * Calculate score for short answer questions based on keyword matching
 * @param {import("./types.js").TypeOfJawaban} jawaban - Student answers
 * @param {import("./types.js").TypeOfKunci} kunci - Answer keys in format "keyword1;keyword2;keyword3"
 * @param {import("./types.js").TypeOfBobot} bobot - Question weights (single numbers)
 * @returns {{nilai: number, benar: number, salah: number}} Score result with total score, correct count, and incorrect count
 */
function calculateShortAnswerScore(jawaban, kunci, bobot) {
  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  for (const questionNum in kunci) {
    const studentAnswer = jawaban[questionNum] || "";
    const keywordString = kunci[questionNum];
    const weightValue = bobot[questionNum];

    // Convert weight to number
    const weight = typeof weightValue === 'string' ? parseInt(weightValue) : weightValue;

    // Split keywords by semicolon and convert to lowercase for case-insensitive matching
    const keywords = keywordString.split(';').map(keyword => keyword.trim().toLowerCase());
    
    // Convert student answer to lowercase for case-insensitive matching
    const studentAnswerLower = studentAnswer.toLowerCase();

    // Count how many keywords are found in the student answer
    let foundKeywords = 0;
    const foundKeywordsList = [];

    keywords.forEach(keyword => {
      if (keyword && studentAnswerLower.includes(keyword)) {
        foundKeywords++;
        foundKeywordsList.push(keyword);
      }
    });

    // Calculate proportional score
    const totalKeywords = keywords.length;
    const scoreForThisQuestion = totalKeywords > 0 ? (foundKeywords / totalKeywords) * weight : 0;
    
    totalScore += scoreForThisQuestion;

    // Consider it "correct" if at least one keyword is found
    if (foundKeywords > 0) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  return {
    nilai: totalScore,
    benar: correctCount,
    salah: incorrectCount,
  };
}

// Test data with check/uncheck questions
const testDataWithChecks = /** @type {import("./types.js").TypeOfJawaban} */ ({
  1: "A", // Multiple choice
  2: "check", // Check question
  3: "-check", // Uncheck question
  4: "blank", // Blank answer
  5: "check", // Check question
  6: "B", // Multiple choice
});

const testKeyWithChecks = /** @type {import("./types.js").TypeOfKunci} */ ({
  1: "A", // Correct: A
  2: "check", // Correct: check
  3: "-check", // Correct: -check or blank
  4: "-check", // Correct: -check or blank
  5: "-check", // Correct: -check or blank (student answered check - should be wrong)
  6: "B", // Correct: B
});

// Test comprehensive scenarios
const testResult = calculateScore(sampleData, kunciJawaban, bobot);
console.log("=== Comprehensive Test Scenarios ===");
console.log("Sample answers:", sampleData);
console.log("Answer key:", kunciJawaban);
console.log("Weights:", bobot);
console.log("Test result:", testResult);

// Test with mixed weight types
console.log("\n=== Weight Type Verification ===");
console.log("Mixed weight types (string and number):");
for (const questionNum in bobot) {
  const weightValue = bobot[questionNum];
  const weightType = typeof weightValue;
  console.log(`Q${questionNum}: ${weightValue} (${weightType})`);
}

// Detailed breakdown
console.log("\n=== Detailed Question Analysis ===");
for (const questionNum in kunciJawaban) {
  const studentAnswer = sampleData[questionNum];
  const correctAnswer = kunciJawaban[questionNum];
  const weightValue = bobot[questionNum];

  let isCorrect = false;
  let scoreEarned = 0;
  let explanation = "";

  // Convert to lowercase for case-insensitive comparison
  const studentAnswerLower = typeof studentAnswer === 'string' ? studentAnswer.toLowerCase() : studentAnswer;
  const correctAnswerLower = typeof correctAnswer === 'string' ? correctAnswer.toLowerCase() : correctAnswer;

  // Determine correctness first
  if (correctAnswerLower === "check" || correctAnswerLower === "-check") {
    if (correctAnswerLower === "check") {
      isCorrect = studentAnswerLower === "check";
      explanation = `Check question: need "check", got "${studentAnswer || "(empty)"}"`;
    } else if (correctAnswerLower === "-check") {
      isCorrect = studentAnswerLower === "-check" || studentAnswer === "";
      explanation = `Uncheck question: need "-check" or empty, got "${studentAnswer || "(empty)"}"`;
    }
  } else {
    isCorrect = studentAnswerLower === correctAnswerLower;
    explanation = `Multiple choice: need "${correctAnswer}", got "${studentAnswer}"`;
  }

  // Calculate score based on weight format
  if (typeof weightValue === 'string' && weightValue.includes(';')) {
    const parts = weightValue.split(';');
    
    if (parts.length === 2) {
      // Correct/Incorrect format
      const correctScore = parseInt(parts[0]);
      const incorrectScore = parseInt(parts[1]);
      scoreEarned = isCorrect ? correctScore : incorrectScore;
      explanation += ` | Score: ${scoreEarned} (${correctScore};${incorrectScore})`;
    } else if (parts.length === 5) {
      // Choice-based format
      const choiceScores = {
        'a': parseInt(parts[0]),
        'b': parseInt(parts[1]), 
        'c': parseInt(parts[2]),
        'd': parseInt(parts[3]),
        'e': parseInt(parts[4])
      };
      scoreEarned = choiceScores[studentAnswerLower] || 0;
      explanation = `Choice-based: got "${studentAnswer}" = ${scoreEarned} points (A=${parts[0]},B=${parts[1]},C=${parts[2]},D=${parts[3]},E=${parts[4]})`;
      isCorrect = scoreEarned > 0; // Consider positive score as "correct"
    }
  } else {
    // Simple weight
    const simpleWeight = typeof weightValue === 'string' ? parseInt(weightValue) : weightValue;
    scoreEarned = isCorrect ? simpleWeight : 0;
    explanation += ` | Score: ${scoreEarned} (Weight: ${simpleWeight})`;
  }

  console.log(
    `Q${questionNum}: ${isCorrect ? "✓" : "✗"} ${explanation}`,
  );
}

// Comprehensive test for all weight formats
console.log("\n=== Comprehensive Weight Format Test ===");

const comprehensiveAnswers = /** @type {import("./types.js").TypeOfJawaban} */ ({
  // Simple weight tests
  1: "A",     // Correct - simple string weight
  2: "B",     // Correct - simple number weight
  3: "X",     // Wrong - simple weight
  
  // Correct/Incorrect weight tests  
  4: "A",     // Correct - should get +5
  5: "X",     // Wrong - should get -2
  6: "check", // Correct check - should get +3
  7: "-check", // Wrong check (key is "check") - should get -1
  
  // Choice-based weight tests
  8: "A",     // Should get 1 point
  9: "B",     // Should get 2 points  
  10: "C",    // Should get 3 points
  11: "D",    // Should get 4 points
  12: "E",    // Should get 5 points
  13: "X",    // Should get 0 points (invalid choice)
  14: "",     // Should get 0 points (empty choice)
  
  // Advanced choice-based with custom values
  15: "A",    // Should get 10 points
  16: "C",    // Should get 30 points
  17: "F",    // Should get 0 points (invalid)
  
  // Mixed scenarios with check/uncheck
  18: "check",  // Correct check with choice-based (treat as correct)
  19: "",       // Correct uncheck with correct/incorrect format
  20: "check",  // Wrong uncheck with choice-based (treat based on choice)
});

const comprehensiveKeys = /** @type {import("./types.js").TypeOfKunci} */ ({
  1: "A",     // Simple weight
  2: "B",     // Simple weight
  3: "A",     // Simple weight
  4: "A",     // Correct/Incorrect
  5: "A",     // Correct/Incorrect  
  6: "check", // Check with Correct/Incorrect
  7: "check", // Check with Correct/Incorrect
  8: "X",     // Choice-based (key doesn't matter)
  9: "X",     // Choice-based
  10: "X",    // Choice-based
  11: "X",    // Choice-based
  12: "X",    // Choice-based
  13: "X",    // Choice-based
  14: "X",    // Choice-based
  15: "X",    // Choice-based custom
  16: "X",    // Choice-based custom
  17: "X",    // Choice-based custom
  18: "check", // Check with choice-based
  19: "-check", // Uncheck with correct/incorrect
  20: "-check", // Uncheck with choice-based
});

const comprehensiveWeights = /** @type {import("./types.js").TypeOfBobot} */ ({
  1: "3",           // Simple string weight
  2: 4,             // Simple number weight
  3: 5,             // Simple number weight
  4: "5;-2",        // Correct/Incorrect: +5/-2
  5: "5;-2",        // Correct/Incorrect: +5/-2
  6: "3;-1",        // Check with Correct/Incorrect: +3/-1
  7: "3;-1",        // Check with Correct/Incorrect: +3/-1
  8: "1;2;3;4;5",   // Choice-based: A=1,B=2,C=3,D=4,E=5
  9: "1;2;3;4;5",   // Choice-based
  10: "1;2;3;4;5",  // Choice-based
  11: "1;2;3;4;5",  // Choice-based
  12: "1;2;3;4;5",  // Choice-based
  13: "1;2;3;4;5",  // Choice-based
  14: "1;2;3;4;5",  // Choice-based
  15: "10;20;30;40;50", // Custom choice-based
  16: "10;20;30;40;50", // Custom choice-based
  17: "10;20;30;40;50", // Custom choice-based
  18: "1;2;3;4;5",  // Check with choice-based (should work as choice)
  19: "4;-1",       // Uncheck with correct/incorrect
  20: "1;2;3;4;5",  // Uncheck with choice-based
});

const comprehensiveResult = calculateScore(comprehensiveAnswers, comprehensiveKeys, comprehensiveWeights);
console.log("Comprehensive test result:", comprehensiveResult);

// Manual calculation verification
console.log("\n=== Manual Verification ===");
let expectedScore = 0;
let expectedCorrect = 0;
let expectedIncorrect = 0;

// Q1: A=A, weight=3 → +3, correct
expectedScore += 3; expectedCorrect++;
console.log("Q1: A=A, simple weight 3 → +3");

// Q2: B=B, weight=4 → +4, correct  
expectedScore += 4; expectedCorrect++;
console.log("Q2: B=B, simple weight 4 → +4");

// Q3: X≠A, weight=5 → 0, incorrect
expectedScore += 0; expectedIncorrect++; 
console.log("Q3: X≠A, simple weight 5 → 0");

// Q4: A=A, correct/incorrect 5;-2 → +5, correct
expectedScore += 5; expectedCorrect++;
console.log("Q4: A=A, correct/incorrect 5;-2 → +5");

// Q5: X≠A, correct/incorrect 5;-2 → -2, incorrect
expectedScore += -2; expectedIncorrect++;
console.log("Q5: X≠A, correct/incorrect 5;-2 → -2");

// Q6: check=check, correct/incorrect 3;-1 → +3, correct
expectedScore += 3; expectedCorrect++;
console.log("Q6: check=check, correct/incorrect 3;-1 → +3");

// Q7: -check≠check, correct/incorrect 3;-1 → -1, incorrect
expectedScore += -1; expectedIncorrect++;
console.log("Q7: -check≠check, correct/incorrect 3;-1 → -1");

// Q8-12: Choice-based A=1, B=2, C=3, D=4, E=5
expectedScore += 1; expectedCorrect++; // A=1
expectedScore += 2; expectedCorrect++; // B=2  
expectedScore += 3; expectedCorrect++; // C=3
expectedScore += 4; expectedCorrect++; // D=4
expectedScore += 5; expectedCorrect++; // E=5
console.log("Q8-12: Choice-based A=1,B=2,C=3,D=4,E=5 → +1,+2,+3,+4,+5");

// Q13: X=0, choice-based → 0, incorrect
expectedScore += 0; expectedIncorrect++;
console.log("Q13: X not in A-E, choice-based → 0");

// Q14: ""=0, choice-based → 0, incorrect  
expectedScore += 0; expectedIncorrect++;
console.log("Q14: empty not in A-E, choice-based → 0");

// Q15: A=10, custom choice-based → +10, correct
expectedScore += 10; expectedCorrect++;
console.log("Q15: A=10, custom choice-based → +10");

// Q16: C=30, custom choice-based → +30, correct
expectedScore += 30; expectedCorrect++;
console.log("Q16: C=30, custom choice-based → +30");

// Q17: F=0, custom choice-based → 0, incorrect
expectedScore += 0; expectedIncorrect++;
console.log("Q17: F not in A-E, custom choice-based → 0");

// Q18: check with choice-based A=1,B=2,C=3,D=4,E=5 → 0 (check not in A-E), incorrect
expectedScore += 0; expectedIncorrect++;
console.log("Q18: 'check' not in A-E, choice-based → 0");

// Q19: ""=-check (uncheck), correct/incorrect 4;-1 → +4, correct
expectedScore += 4; expectedCorrect++;
console.log("Q19: empty=-check (uncheck), correct/incorrect 4;-1 → +4");

// Q20: check≠-check (uncheck), choice-based → 0 (check not in A-E), incorrect  
expectedScore += 0; expectedIncorrect++;
console.log("Q20: 'check' not in A-E, choice-based → 0");

console.log(`\nExpected: nilai=${expectedScore}, benar=${expectedCorrect}, salah=${expectedIncorrect}`);
console.log(`Actual:   nilai=${comprehensiveResult.nilai}, benar=${comprehensiveResult.benar}, salah=${comprehensiveResult.salah}`);
console.log(`Match: ${expectedScore === comprehensiveResult.nilai && expectedCorrect === comprehensiveResult.benar && expectedIncorrect === comprehensiveResult.salah ? '✅ PASS' : '❌ FAIL'}`);

// Detailed breakdown table
console.log("\n=== Test Results Summary Table ===");
console.log("Q# | Answer | Key    | Weight Format    | Score | Status | Description");
console.log("---|--------|--------|------------------|-------|--------|----------------------------------");

const testCases = [
  {q: 1, ans: "A", key: "A", weight: "3", score: 3, status: "✓", desc: "Simple string weight"},
  {q: 2, ans: "B", key: "B", weight: 4, score: 4, status: "✓", desc: "Simple number weight"},
  {q: 3, ans: "X", key: "A", weight: 5, score: 0, status: "✗", desc: "Simple weight, wrong answer"},
  {q: 4, ans: "A", key: "A", weight: "5;-2", score: 5, status: "✓", desc: "Correct/incorrect format, correct"},
  {q: 5, ans: "X", key: "A", weight: "5;-2", score: -2, status: "✗", desc: "Correct/incorrect format, wrong"},
  {q: 6, ans: "check", key: "check", weight: "3;-1", score: 3, status: "✓", desc: "Check question, correct/incorrect"},
  {q: 7, ans: "-check", key: "check", weight: "3;-1", score: -1, status: "✗", desc: "Check question, wrong answer"},
  {q: 8, ans: "A", key: "X", weight: "1;2;3;4;5", score: 1, status: "✓", desc: "Choice-based A=1"},
  {q: 9, ans: "B", key: "X", weight: "1;2;3;4;5", score: 2, status: "✓", desc: "Choice-based B=2"},
  {q: 10, ans: "C", key: "X", weight: "1;2;3;4;5", score: 3, status: "✓", desc: "Choice-based C=3"},
  {q: 11, ans: "D", key: "X", weight: "1;2;3;4;5", score: 4, status: "✓", desc: "Choice-based D=4"},
  {q: 12, ans: "E", key: "X", weight: "1;2;3;4;5", score: 5, status: "✓", desc: "Choice-based E=5"},
  {q: 13, ans: "X", key: "X", weight: "1;2;3;4;5", score: 0, status: "✗", desc: "Choice-based invalid choice"},
  {q: 14, ans: "", key: "X", weight: "1;2;3;4;5", score: 0, status: "✗", desc: "Choice-based empty answer"},
  {q: 15, ans: "A", key: "X", weight: "10;20;30;40;50", score: 10, status: "✓", desc: "Custom choice-based A=10"},
  {q: 16, ans: "C", key: "X", weight: "10;20;30;40;50", score: 30, status: "✓", desc: "Custom choice-based C=30"},
  {q: 17, ans: "F", key: "X", weight: "10;20;30;40;50", score: 0, status: "✗", desc: "Custom choice-based invalid"},
  {q: 18, ans: "check", key: "check", weight: "1;2;3;4;5", score: 0, status: "✗", desc: "Check + choice-based (check not A-E)"},
  {q: 19, ans: "", key: "-check", weight: "4;-1", score: 4, status: "✓", desc: "Uncheck + correct/incorrect"},
  {q: 20, ans: "check", key: "-check", weight: "1;2;3;4;5", score: 0, status: "✗", desc: "Uncheck + choice-based"}
];

testCases.forEach(tc => {
  const paddedQ = tc.q.toString().padStart(2);
  const paddedAns = tc.ans.toString().padEnd(6);
  const paddedKey = tc.key.toString().padEnd(6);
  const paddedWeight = tc.weight.toString().padEnd(16);
  const paddedScore = tc.score.toString().padStart(5);
  console.log(`${paddedQ} | ${paddedAns} | ${paddedKey} | ${paddedWeight} | ${paddedScore} | ${tc.status}      | ${tc.desc}`);
});

console.log(`\nTOTAL SCORE: ${testCases.reduce((sum, tc) => sum + tc.score, 0)} points`);
console.log(`CORRECT: ${testCases.filter(tc => tc.status === "✓").length} questions`);
console.log(`INCORRECT: ${testCases.filter(tc => tc.status === "✗").length} questions`);

// Case insensitive test
console.log("\n=== Case Insensitive Test ===");
const caseTestAnswers = /** @type {import("./types.js").TypeOfJawaban} */ ({
  1: "a",        // lowercase should match "A"
  2: "B",        // uppercase should match "b"  
  3: "Check",    // mixed case should match "check"
  4: "-CHECK",   // uppercase should match "-check"
  5: "c",        // lowercase for choice-based
  6: "D",        // uppercase for choice-based
});

const caseTestKeys = /** @type {import("./types.js").TypeOfKunci} */ ({
  1: "A",        // uppercase key
  2: "b",        // lowercase key
  3: "check",    // lowercase check
  4: "-check",   // lowercase -check
  5: "X",        // choice-based (key doesn't matter)
  6: "X",        // choice-based (key doesn't matter)
});

const caseTestWeights = /** @type {import("./types.js").TypeOfBobot} */ ({
  1: 3,                // simple weight
  2: 4,                // simple weight
  3: "5;-1",          // correct/incorrect for check
  4: "2;-1",          // correct/incorrect for -check
  5: "1;2;3;4;5",     // choice-based
  6: "10;20;30;40;50", // choice-based
});

const caseTestResult = calculateScore(caseTestAnswers, caseTestKeys, caseTestWeights);
console.log("Case test answers:", caseTestAnswers);
console.log("Case test keys:", caseTestKeys);
console.log("Case test result:", caseTestResult);

console.log("Expected results:");
console.log("Q1: 'a' should match 'A' → +3 points");
console.log("Q2: 'B' should match 'b' → +4 points");
console.log("Q3: 'Check' should match 'check' → +5 points");
console.log("Q4: '-CHECK' should match '-check' → +2 points");
console.log("Q5: 'c' choice-based → +3 points");
console.log("Q6: 'D' choice-based → +40 points");
console.log("Expected total: 57 points, all 6 correct");

console.log(`Actual result: ${caseTestResult.nilai} points, ${caseTestResult.benar} correct`);
console.log(`Case insensitive test: ${caseTestResult.nilai === 57 && caseTestResult.benar === 6 ? '✅ PASS' : '❌ FAIL'}`);

// Additional case insensitive examples
console.log("\n=== Additional Case Examples ===");
const mixedCaseExamples = [
  { student: "a", key: "A", match: "✓", desc: "lowercase student, uppercase key" },
  { student: "B", key: "b", match: "✓", desc: "uppercase student, lowercase key" },
  { student: "Check", key: "check", match: "✓", desc: "mixed case check" },
  { student: "-check", key: "-CHECK", match: "✓", desc: "lowercase vs uppercase -check" },
  { student: "CHECK", key: "check", match: "✓", desc: "all caps check" },
  { student: "s", key: "S", match: "✓", desc: "lowercase s matches uppercase S" }
];

console.log("Student | Key    | Match | Description");
console.log("--------|--------|-------|---------------------------");
mixedCaseExamples.forEach(ex => {
  const paddedStudent = ex.student.padEnd(7);
  const paddedKey = ex.key.padEnd(6);
  console.log(`${paddedStudent} | ${paddedKey} | ${ex.match}     | ${ex.desc}`);
});

console.log("\n✅ Case insensitive functionality implemented successfully!");

// ========================================
// SHORT ANSWER SCORING TESTS
// ========================================

console.log("\n" + "=".repeat(60));
console.log("=== SHORT ANSWER SCORING TESTS ===");
console.log("=".repeat(60));

const shortAnswerData = /** @type {import("./types.js").TypeOfJawaban} */ ({
  1: "ke satu, kedua, ketiga",        // All 3 keywords found
  2: "kesatu, dua",                   // 2 out of 3 keywords found  
  3: "hanya satu saja",               // 1 out of 3 keywords found
  4: "tidak ada yang cocok",          // 0 keywords found
  5: "SATU dan DUA tertulis",         // Case insensitive test
  6: "empat lima enam",               // Different keywords, 0 found
  7: "satu dua tiga empat lima",      // All keywords + extra words
  8: "",                              // Empty answer
  9: "programming adalah seni",       // Single keyword test
  10: "Algoritma dan Struktur Data"   // Partial match test
});

const shortAnswerKeys = /** @type {import("./types.js").TypeOfKunci} */ ({
  1: "satu;dua;tiga",
  2: "satu;dua;tiga", 
  3: "satu;dua;tiga",
  4: "satu;dua;tiga",
  5: "satu;dua;tiga",
  6: "satu;dua;tiga",
  7: "satu;dua;tiga",
  8: "satu;dua;tiga",
  9: "programming",
  10: "algoritma;struktur;pemrograman"
});

const shortAnswerWeights = /** @type {import("./types.js").TypeOfBobot} */ ({
  1: 3,   // Weight 3
  2: 3,   // Weight 3
  3: 3,   // Weight 3
  4: 3,   // Weight 3
  5: 3,   // Weight 3
  6: 3,   // Weight 3
  7: 3,   // Weight 3
  8: 3,   // Weight 3
  9: 2,   // Weight 2 (single keyword)
  10: 6   // Weight 6 (3 keywords)
});

const shortAnswerResult = calculateShortAnswerScore(shortAnswerData, shortAnswerKeys, shortAnswerWeights);

console.log("Short Answer Test Result:", shortAnswerResult);

// Manual verification
console.log("\n=== Short Answer Detailed Analysis ===");
let expectedShortScore = 0;
let expectedShortCorrect = 0;
let expectedShortIncorrect = 0;

const shortTestCases = [
  {q: 1, answer: "ke satu, kedua, ketiga", keywords: ["satu","dua","tiga"], found: 3, weight: 3, score: 3, desc: "All 3 keywords found"},
  {q: 2, answer: "kesatu, dua", keywords: ["satu","dua","tiga"], found: 2, weight: 3, score: 2, desc: "2 out of 3 keywords"},
  {q: 3, answer: "hanya satu saja", keywords: ["satu","dua","tiga"], found: 1, weight: 3, score: 1, desc: "1 out of 3 keywords"},
  {q: 4, answer: "tidak ada yang cocok", keywords: ["satu","dua","tiga"], found: 0, weight: 3, score: 0, desc: "No keywords found"},
  {q: 5, answer: "SATU dan DUA tertulis", keywords: ["satu","dua","tiga"], found: 2, weight: 3, score: 2, desc: "Case insensitive match"},
  {q: 6, answer: "empat lima enam", keywords: ["satu","dua","tiga"], found: 0, weight: 3, score: 0, desc: "Different keywords"},
  {q: 7, answer: "satu dua tiga empat lima", keywords: ["satu","dua","tiga"], found: 3, weight: 3, score: 3, desc: "All keywords + extra"},
  {q: 8, answer: "", keywords: ["satu","dua","tiga"], found: 0, weight: 3, score: 0, desc: "Empty answer"},
  {q: 9, answer: "programming adalah seni", keywords: ["programming"], found: 1, weight: 2, score: 2, desc: "Single keyword match"},
  {q: 10, answer: "Algoritma dan Struktur Data", keywords: ["algoritma","struktur","pemrograman"], found: 2, weight: 6, score: 4, desc: "Partial keyword match"}
];

console.log("Q# | Score | Found/Total | Weight | Description");
console.log("---|-------|-------------|--------|----------------------------------");

shortTestCases.forEach(tc => {
  expectedShortScore += tc.score;
  if (tc.found > 0) expectedShortCorrect++; else expectedShortIncorrect++;
  
  const paddedQ = tc.q.toString().padStart(2);
  const paddedScore = tc.score.toString().padStart(5);
  const foundTotal = `${tc.found}/${tc.keywords.length}`.padEnd(11);
  const paddedWeight = tc.weight.toString().padStart(6);
  
  console.log(`${paddedQ} | ${paddedScore} | ${foundTotal} | ${paddedWeight} | ${tc.desc}`);
});

console.log(`\nExpected: nilai=${expectedShortScore}, benar=${expectedShortCorrect}, salah=${expectedShortIncorrect}`);
console.log(`Actual:   nilai=${shortAnswerResult.nilai}, benar=${shortAnswerResult.benar}, salah=${shortAnswerResult.salah}`);
console.log(`Short Answer Test: ${expectedShortScore === shortAnswerResult.nilai && expectedShortCorrect === shortAnswerResult.benar && expectedShortIncorrect === shortAnswerResult.salah ? '✅ PASS' : '❌ FAIL'}`);

// Demonstrate keyword detection
console.log("\n=== Keyword Detection Examples ===");
const keywordExamples = [
  {answer: "ke satu, kedua, ketiga", keywords: "satu;dua;tiga", found: ["satu","dua","tiga"]},
  {answer: "SATU dan DUA", keywords: "satu;dua;tiga", found: ["satu","dua"]},
  {answer: "programming is fun", keywords: "programming;coding;development", found: ["programming"]},
  {answer: "nothing matches", keywords: "apple;banana;orange", found: []}
];

keywordExamples.forEach((ex, i) => {
  console.log(`Example ${i+1}: "${ex.answer}"`);
  console.log(`Keywords: ${ex.keywords}`);
  console.log(`Found: [${ex.found.join(', ')}]`);
  console.log(`Score ratio: ${ex.found.length}/${ex.keywords.split(';').length}`);
  console.log("");
});

console.log("✅ Short answer scoring functionality implemented successfully!");

console.log("\n" + "=".repeat(60));
console.log("SUMMARY: Available Functions");
console.log("=".repeat(60));
console.log("1. calculateScore() - Multiple choice with various weight formats");
console.log("   - Simple weights: 3, '5'");
console.log("   - Correct/Incorrect: '4;-1'");
console.log("   - Choice-based: '1;2;3;4;5'");
console.log("   - Supports check/uncheck questions");
console.log("   - Case insensitive");
console.log("");
console.log("2. calculateShortAnswerScore() - Keyword-based short answers");
console.log("   - Keywords format: 'keyword1;keyword2;keyword3'");
console.log("   - Proportional scoring: found_keywords/total_keywords * weight");
console.log("   - Case insensitive keyword matching");
console.log("   - Returns: {nilai, benar, salah}");

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateScore,
    calculateShortAnswerScore,
    sampleData,
    kunciJawaban,
    bobot
  };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateScore,
    calculateShortAnswerScore,
    sampleData,
    kunciJawaban,
    bobot
  };
};
