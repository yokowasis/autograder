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
    detail: {
      "1": "correct",
      "2": "correct",
      "3": "correct",
      "4": "correct",
      "5": "correct",
    },
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
    detail: {
      "1": "correct",
      "2": "correct",
      "3": "correct",
      "4": "wrong",
      "5": "wrong",
    },
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
    detail: {
      "1": "correct",
      "2": "correct",
      "3": "correct",
      "4": "correct",
      "5": "correct",
    },
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
    detail: {
      "1": "correct",
      "2": "wrong",
      "3": "correct",
      "4": "wrong",
      "5": "correct",
    },
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
    detail: {
      "1": "correct",
      "2": "correct",
      "3": "correct",
      "5": "wrong",
    },
  });
});

test("Soal AKM Campuran", () => {
  expect(
    hitungnilai(
      {
        "1": "D",
        "2": "C",
        "3": "D",
        "4": "B",
        "5": "A",
        "6": "A",
        "7": "B",
        "8": "C",
        "9": "B",
        "10": "B",
        "11": "A",
        "12": "A",
        "13": "A",
        "14": "A",
        "15": "A",
        "16": "A",
        "17": "A",
        "18": "A",
        "19": "A",
        "20": "A",
        "21": "A",
        "22": "A",
        "23": "A",
        "24": "A",
        "25": "A",
        "11001": "",
        "11002": "CHECK",
        "11003": "CHECK",
        "11004": "",
        "12001": "CHECK",
        "12002": "",
        "12003": "CHECK",
        "12004": "",
        "13001": "CHECK",
        "13002": "CHECK",
        "13003": "CHECK",
        "13004": "",
        "14001": "CHECK",
        "14002": "CHECK",
        "14003": "",
        "14004": "CHECK",
        "15001": "CHECK",
        "15002": "CHECK",
        "15003": "",
        "15004": "",
        "16001": "B",
        "16002": "C",
        "16003": "E",
        "16004": "A",
        "16005": "D",
        "17001": "E",
        "17002": "A",
        "17003": "B",
        "17004": "C",
        "17005": "D",
        "18001": "E",
        "18002": "A",
        "18003": "C",
        "18004": "B",
        "18005": "D",
        "19001": "B",
        "19002": "C",
        "19003": "D",
        "19004": "A",
        "20001": "C",
        "20002": "D",
        "20003": "A",
        "20004": "E",
        "20005": "B",
        "21001": "453600",
        "22001": "6",
        "23001": "105",
        "24001": "6/36",
        "25001": "1/4",
      },
      {
        "1": "D",
        "2": "C",
        "3": "D",
        "4": "B",
        "5": "A",
        "6": "A",
        "7": "B",
        "8": "C",
        "9": "B",
        "10": "B",
        "11": "A",
        "12": "A",
        "13": "A",
        "14": "A",
        "15": "A",
        "16": "A",
        "17": "A",
        "18": "A",
        "19": "A",
        "20": "A",
        "21": "A",
        "22": "A",
        "23": "A",
        "24": "A",
        "25": "A",
        "11001": "-CHECK",
        "11002": "CHECK",
        "11003": "CHECK",
        "11004": "-CHECK",
        "12001": "CHECK",
        "12002": "-CHECK",
        "12003": "CHECK",
        "12004": "-CHECK",
        "13001": "CHECK",
        "13002": "CHECK",
        "13003": "CHECK",
        "13004": "-CHECK",
        "14001": "CHECK",
        "14002": "CHECK",
        "14003": "-CHECK",
        "14004": "CHECK",
        "15001": "CHECK",
        "15002": "CHECK",
        "15003": "-CHECK",
        "15004": "-CHECK",
        "16001": "B",
        "16002": "C",
        "16003": "E",
        "16004": "A",
        "16005": "D",
        "17001": "E",
        "17002": "A",
        "17003": "B",
        "17004": "C",
        "17005": "D",
        "18001": "E",
        "18002": "A",
        "18003": "C",
        "18004": "B",
        "18005": "D",
        "19001": "B",
        "19002": "C",
        "19003": "D",
        "19004": "A",
        "20001": "C",
        "20002": "D",
        "20003": "A",
        "20004": "E",
        "20005": "B",
        "21001": "453600",
        "22001": "6",
        "23001": "105",
        "24001": "6/36",
        "25001": "1/4",
      },
      {
        "1": "1.5",
        "2": "1.5",
        "3": "1.5",
        "4": "1.5",
        "5": "1.5",
        "6": "1.5",
        "7": "1.5",
        "8": "1.5",
        "9": "1.5",
        "10": "1.5",
        "11": "0.00",
        "12": "0.00",
        "13": "0.00",
        "14": "0.00",
        "15": "0.00",
        "16": "0.00",
        "17": "0.00",
        "18": "0.00",
        "19": "0.00",
        "20": "0.00",
        "21": "0.00",
        "22": "0.00",
        "23": "0.00",
        "24": "0.00",
        "25": "0.00",
        "11001": "1.5",
        "11002": "1.5",
        "11003": "1.5",
        "11004": "1.5",
        "12001": "1.5",
        "12002": "1.5",
        "12003": "1.5",
        "12004": "1.5",
        "13001": "1.5",
        "13002": "1.5",
        "13003": "1.5",
        "13004": "1.5",
        "14001": "1.5",
        "14002": "1.5",
        "14003": "1.5",
        "14004": "1.5",
        "15001": "1.5",
        "15002": "1.5",
        "15003": "1.5",
        "15004": "1.5",
        "16001": "1.2",
        "16002": "1.2",
        "16003": "1.2",
        "16004": "1.2",
        "16005": "1.2",
        "17001": "1.2",
        "17002": "1.2",
        "17003": "1.2",
        "17004": "1.2",
        "17005": "1.2",
        "18001": "1.2",
        "18002": "1.2",
        "18003": "1.2",
        "18004": "1.2",
        "18005": "1.2",
        "19001": "1.5",
        "19002": "1.5",
        "19003": "1.5",
        "19004": "1.5",
        "20001": "1.2",
        "20002": "1.2",
        "20003": "1.2",
        "20004": "1.2",
        "20005": "1.2",
        "21001": "5.00",
        "22001": "5.00",
        "23001": "5.00",
        "24001": "5.00",
        "25001": "5.00",
      }
    )
  ).toStrictEqual({
    nilai: "100.00",
    benar: "74.00",
    salah: "0.00",
    detail: {
      "1": "correct",
      "2": "correct",
      "3": "correct",
      "4": "correct",
      "5": "correct",
      "6": "correct",
      "7": "correct",
      "8": "correct",
      "9": "correct",
      "10": "correct",
      "11": "correct",
      "12": "correct",
      "13": "correct",
      "14": "correct",
      "15": "correct",
      "16": "correct",
      "17": "correct",
      "18": "correct",
      "19": "correct",
      "20": "correct",
      "21": "correct",
      "22": "correct",
      "23": "correct",
      "24": "correct",
      "25": "correct",
      "11001": "correct",
      "11002": "correct",
      "11003": "correct",
      "11004": "correct",
      "12001": "correct",
      "12002": "correct",
      "12003": "correct",
      "12004": "correct",
      "13001": "correct",
      "13002": "correct",
      "13003": "correct",
      "13004": "correct",
      "14001": "correct",
      "14002": "correct",
      "14003": "correct",
      "14004": "correct",
      "15001": "correct",
      "15002": "correct",
      "15003": "correct",
      "15004": "correct",
      "16001": "correct",
      "16002": "correct",
      "16003": "correct",
      "16004": "correct",
      "16005": "correct",
      "17001": "correct",
      "17002": "correct",
      "17003": "correct",
      "17004": "correct",
      "17005": "correct",
      "18001": "correct",
      "18002": "correct",
      "18003": "correct",
      "18004": "correct",
      "18005": "correct",
      "19001": "correct",
      "19002": "correct",
      "19003": "correct",
      "19004": "correct",
      "20001": "correct",
      "20002": "correct",
      "20003": "correct",
      "20004": "correct",
      "20005": "correct",
      "21001": "correct",
      "22001": "correct",
      "23001": "correct",
      "24001": "correct",
      "25001": "correct",
    },
  });
});

test("Uraian / Short Answer dengan status correct, wrong, dan partial", () => {
  expect(
    hitungnilai(
      {
        "1": "fotosintesis klorofil matahari",
        "2": "fotosintesis",
        "3": "oksigen karbon",
      },
      {
        "1": "fotosintesis,klorofil,matahari",
        "2": "fotosintesis,klorofil,matahari",
        "3": "fotosintesis,klorofil,matahari",
      },
      {
        "1": 3,
        "2": 3,
        "3": 3,
      }
    )
  ).toStrictEqual({
    nilai: "4.00",
    benar: "1.33",
    salah: "1.67",
    detail: {
      "1": "correct",
      "2": "partial",
      "3": "wrong",
    },
  });
});

test("Uraian AI Score [AISCORE:XX] dengan status correct, partial, dan wrong", () => {
  expect(
    hitungnilai(
      {
        "1": "jawaban sempurna",
        "2": "jawaban separuh",
        "3": "jawaban salah",
      },
      {
        "1": "[AISCORE:100]",
        "2": "[AISCORE:50]",
        "3": "[AISCORE:0]",
      },
      {
        "1": 10,
        "2": 10,
        "3": 10,
      }
    )
  ).toStrictEqual({
    nilai: "15.00",
    benar: "1.50",
    salah: "1.50",
    detail: {
      "1": "correct",
      "2": "partial",
      "3": "wrong",
    },
  });
});

test("Soal Bonus dengan status correct", () => {
  expect(
    hitungnilai(
      {
        "1": "apa saja",
        "2": "sembarang",
      },
      {
        "1": "x",
        "2": "-check",
      },
      {
        "1": 2,
        "2": 2,
      }
    )
  ).toStrictEqual({
    nilai: "4.00",
    benar: "2.00",
    salah: "0.00",
    detail: {
      "1": "correct",
      "2": "correct",
    },
  });
});

