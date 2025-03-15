import { hitungAI } from "./src/ai";

hitungAI({
  question: "Apa ibukota dari Indonesia",
  correctAnswer: "Ibukota indonesia adalah Jakarta",
  studentAnswers: {
    student1: "Jakarta",
    student2: "ibukota nya indonesia adalah Jakarta",
    student3: "ibukota dari Indonesia adalah Yogyakarta",
    student4: "Bandung",
  },
}).then((s) => {
  console.log(s);
});
