import { calculateScore, extractNumber } from "./uraian";

type TypeOfJawaban = {
  [no: number]: string;
};

type TypeOfKunci = {
  [no: number]: string;
};

type TypeOfBobot = {
  [no: number]: number;
};

function hitungnilai(
  jawaban: TypeOfJawaban,
  kunci: TypeOfKunci,
  bobot: TypeOfBobot
) {
  let benar = 0;
  let salah = 0;
  let skor = 0;

  if (jawaban && kunci && bobot) {
    for (const no in jawaban) {
      if (Object.hasOwnProperty.call(jawaban, no)) {
        if (kunci[no]) {
          let kuncijawaban = kunci[no];
          let jawabansoal = jawaban[no];
          let bobotsoal = bobot[no];
          let bonus = false;

          if (kuncijawaban === "X") {
            bonus = true;
          }

          if (bonus) {
            benar++;
            skor += bobotsoal;
          } else if (kuncijawaban == jawabansoal) {
            // Check Kunci PG
            benar++;
            skor += bobotsoal;
          } else if (kuncijawaban === "CHECK") {
            salah++;
          } else if (jawabansoal === "" && kuncijawaban === "-CHECK") {
            benar++;
            skor += bobotsoal;
          } else {
            const essayScore = calculateScore(kuncijawaban, jawabansoal);
            benar += essayScore;
            skor += essayScore * bobotsoal;
            salah += 1 - essayScore;
          }
          // console.log({
          //   no,
          //   benar,
          //   salah,
          //   bobotsoal,
          //   skor,
          // });
        }
      }
    }
  }

  return {
    nilai: skor.toFixed(2),
    benar: benar.toFixed(2),
    salah: salah.toFixed(2),
  };
}

console.log(
  hitungnilai(
    {
      1: "Lionel Messi",
      2: "2",
      3: "A, C",
      4: "X",
      5: "6",
    },
    {
      1: "Lionel Messi",
      2: "3",
      3: "A, B, C",
      4: "X",
      5: "6",
    },
    {
      1: 3,
      2: 3,
      3: 3,
      4: 3,
      5: 3,
    }
  )
);

export { calculateScore, hitungnilai, extractNumber };
