import { sampleData } from "./data";
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
    for (const no in kunci) {
      if (Object.hasOwnProperty.call(kunci, no)) {
        if (kunci[no]) {
          let kuncijawaban = kunci[no].toLowerCase().trim();
          let jawabansoal = jawaban[no]?.toLowerCase().trim() || "";
          let bobotsoal = bobot[no];
          let bonus = false;
          const kunciAsNumber = extractNumber(
            jawabansoal.replace(",", ".").replace(" ", "")
          );
          const jawabanAsNumber = extractNumber(
            kuncijawaban.replace(",", ".").replace(" ", "")
          );

          if (
            kuncijawaban === "x" ||
            (kuncijawaban === "-check" && jawabansoal !== "check")
          ) {
            bonus = true;
          }

          if (bonus) {
            benar++;
            skor += bobotsoal;
          } else if (kuncijawaban === jawabansoal) {
            // Check Kunci PG
            benar++;
            skor += bobotsoal;
          } else if (kunciAsNumber !== 0 && kunciAsNumber === jawabanAsNumber) {
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
          console.log({
            no,
            benar,
            salah,
            bobotsoal,
            kuncijawaban,
            jawabansoal,
            extract: extractNumber(
              jawabansoal.replace(",", ".").replace(" ", "")
            ),
            extractKunci: extractNumber(
              kuncijawaban.replace(",", ".").replace(" ", "")
            ),
            skor,
          });
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

console.log(hitungnilai(sampleData.answer, sampleData.keys, sampleData.bobot));

export { calculateScore, hitungnilai, extractNumber };
