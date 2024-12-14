import { calculateScore, extractNumber } from "./uraian";

type TypeOfJawaban = {
  [no: number]: string;
};

type TypeOfKunci = {
  [no: number]: string;
};

type TypeOfBobot = {
  [no: number]: number | string;
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
          let bobotsoalString = (
            bobot?.[no]?.toString().replace(",", ".") || "0"
          ).split(";");
          let bobotBenar = parseFloat(bobotsoalString[0]);
          let bobotSalah = parseFloat(bobotsoalString?.[1] || "0");

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

          let d = 0;

          if (bonus) {
            benar++;
            skor += bobotBenar;
            d = 1;
            continue;
          }

          if (kuncijawaban === "check" || kuncijawaban === "-check") {
            // pilgan kompleks
            if (kuncijawaban === "-check" && jawabansoal !== "check") {
              benar++;
              skor += bobotBenar;
              d = 1;
            } else if (kuncijawaban === jawabansoal) {
              benar++;
              skor += bobotBenar;
              d = 2;
            } else {
              salah++;
              skor += bobotSalah;
              d = 3;
            }

            continue;
          }

          // pilihan ganda, benar salah, penjodohan
          if (/^[a-zA-Z]$/.test(kuncijawaban)) {
            if (kuncijawaban === jawabansoal) {
              benar++;
              skor += bobotBenar;
              d = 2;
            } else {
              salah++;
              skor += bobotSalah;
              d = 3;
            }
            continue;
          }

          // uraian matematika bilangan bulat
          if (kunciAsNumber !== 0 && kunciAsNumber === jawabanAsNumber) {
            benar++;
            skor += bobotBenar;
            d = 4;
            continue;
          }

          // uraian text biasa
          const essayScore = calculateScore(kuncijawaban, jawabansoal);
          benar += essayScore;
          skor += essayScore * bobotBenar;
          salah += 1 - essayScore;
          d = 6;
        }
      }
    }
  }

  return {
    nilai: skor?.toFixed(2) || "0",
    benar: benar?.toFixed(2) || "0",
    salah: salah?.toFixed(2) || "0",
  };
}

// console.log(hitungnilai(sampleData.answer, sampleData.keys, sampleData.bobot));

export { calculateScore, hitungnilai, extractNumber };
