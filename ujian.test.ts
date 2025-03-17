import { hitungAI } from "./src/ai";
import { hitungnilai, TypeOfJawaban, TypeOfKunci } from "./src/index";

function testai() {
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
}

test("Pilihan Ganda Benar Semua", () => {
  expect(
    hitungnilai(
      {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
        "5": "E",
      },
      {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
        "5": "E",
      },
      {
        "1": 2,
        "2": 2,
        "3": 2,
        "4": 2,
        "5": 2,
      }
    )
  ).toStrictEqual({
    nilai: "10.00",
    benar: "5.00",
    salah: "0.00",
  });
});

test("Pilihan Benar Sebagian", () => {
  expect(
    hitungnilai(
      {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "A",
        "5": "A",
      },
      {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
        "5": "E",
      },
      {
        "1": 2,
        "2": 2,
        "3": 2,
        "4": 2,
        "5": 2,
      }
    )
  ).toStrictEqual({
    nilai: "6.00",
    benar: "3.00",
    salah: "2.00",
  });
});

test("Pilihan Ganda Kompleks Benar Semua", () => {
  expect(
    hitungnilai(
      {
        "1": "CHECK",
        "2": "CHECK",
        "3": "",
        "4": "-CHECK",
        "5": "-CHECK",
      },
      {
        "1": "CHECK",
        "2": "CHECK",
        "3": "-CHECK",
        "4": "-CHECK",
        "5": "-CHECK",
      },
      {
        "1": 2,
        "2": 2,
        "3": 2,
        "4": 2,
        "5": 2,
      }
    )
  ).toStrictEqual({
    nilai: "10.00",
    benar: "5.00",
    salah: "0.00",
  });
});

test("Pilihan Ganda Kompleks Benar Sebagian", () => {
  expect(
    hitungnilai(
      {
        "1": "CHECK",
        "2": "-CHECK",
        "3": "",
        "4": "CHECK",
        "5": "-CHECK",
      },
      {
        "1": "CHECK",
        "2": "CHECK",
        "3": "-CHECK",
        "4": "-CHECK",
        "5": "-CHECK",
      },
      {
        "1": 2,
        "2": 2,
        "3": 2,
        "4": 2,
        "5": 2,
      }
    )
  ).toStrictEqual({
    nilai: "6.00",
    benar: "3.00",
    salah: "2.00",
  });
});

test("Pilihan Ganda Benar +4, Salah -1, Kosong +0", () => {
  expect(
    hitungnilai(
      {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "",
        "5": "A",
      },
      {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
        "5": "E",
      },
      {
        "1": "4;-1",
        "2": "4;-1",
        "3": "4;-1",
        "4": "4;-1",
        "5": "4;-1",
      }
    )
  ).toStrictEqual({
    nilai: "11.00",
    benar: "3.00",
    salah: "1.00",
  });
});
