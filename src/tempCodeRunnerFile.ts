sole.log({
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