# AutoGrader

## Supported Answers

- Objective Test (Multiple Choice, and similar type)
- Short Answer (more on that below)

## Algorithm used for Short Answer

The code defines two functions `extractNumber` and `calculateScore` :

`extractNumber(str: string)`: This function takes a string input str and extracts the first occurrence of a number or a float value from it. If it finds a match, it returns the number as a float. If it doesn't find any number, it returns 0.

`calculateScore(keywords: string, answer: string)`: This function takes two string inputs keywords and answer. The keywords input contains a list of `comma-separated` values, and each value is a string of keywords separated by a pipe symbol `|`. The answer input is the answer provided by the user.

The function then calculates a score for the answer based on how many of the keywords in keywords are found in the answer. The score is calculated by counting the number of matched keywords and dividing it by the total number of keywords. If there are multiple sets of keywords in keywords, the function returns the highest score among all the sets.

The function first splits the keywords input by the pipe symbol | to get an array of keyword sets. It then loops through each set and splits it into an array of individual keywords. For each individual keyword, it checks if it exists in the answer input. If the keyword is a number, it extracts the number from the answer using the extractNumber function and compares it with the keyword as a float.

Finally, the function calculates the score by dividing the number of matched keywords by the total number of keywords in the set. It then updates the highestScore variable if the current score is higher. The function returns the highest score among all the sets of keywords.

## The Main Function

The code defines a function called `hitungnilai` that takes three inputs: jawaban, kunci, and bobot. The inputs are of type TypeOfJawaban, TypeOfKunci, and TypeOfBobot, respectively. The function returns an object containing three properties: nilai, benar, and salah.

The jawaban input is an object containing the user's answers to the questions. Each answer is associated with a question number. The kunci input is an object containing the answer keys for each question, and the bobot input is an object containing the weight or score of each question.

The function loops through each question in jawaban and checks if the question has a corresponding answer key in kunci. If it does, it compares the user's answer to the answer key and calculates the score for the question. The score is calculated based on whether the answer is correct, incorrect, partially correct or not attempted.

If the user's answer is correct, the function adds the weight of the question to the skor variable and increments the benar variable. If the answer is incorrect, it increments the salah variable. If the answer is partially correct, the function calculates the score using a calculateScore function (not shown in the code snippet) and adds the weighted score to the skor variable.

Example input:

```json
const jawaban = {
  1: "Lionel Messi",
  2: "2",
  3: "A, C",
  4: "X",
  5: "6"
};

const kunci = {
  1: "Lionel Messi",
  2: "3",
  3: "A, B, C",
  4: "X",
  5: "6"
};

const bobot = {
  1: "3",
  2: "3",
  3: "3",
  4: "3",
  5: "3"
};
```

```json
{
  "nilai": "11.00",
  "benar": "3.67",
  "salah": "1.33"
}
```

Explanation:

1. The answer is exactly as the key (benar+1, score+3)
2. The answer is different than the key (salah+1)
3. The answer is partially correct (benar+0.6, salah+0.3, score+2)
4. The answer is exactly as the key (benar+1, score+3)
5. The answer is exactly as the key (benar+1, score+3)
