"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNumber = exports.hitungnilai = exports.calculateScore = void 0;
const uraian_1 = require("./uraian");
Object.defineProperty(exports, "calculateScore", { enumerable: true, get: function () { return uraian_1.calculateScore; } });
Object.defineProperty(exports, "extractNumber", { enumerable: true, get: function () { return uraian_1.extractNumber; } });
function hitungnilai(jawaban, kunci, bobot) {
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
                    if (kuncijawaban.toLowerCase() === "x") {
                        bonus = true;
                    }
                    if (bonus) {
                        benar++;
                        skor += bobotsoal;
                    }
                    else if (kuncijawaban.toLowerCase() === jawabansoal.toLowerCase()) {
                        // Check Kunci PG
                        benar++;
                        skor += bobotsoal;
                    }
                    else if (kuncijawaban === "CHECK") {
                        salah++;
                    }
                    else if (jawabansoal === "" && kuncijawaban === "-CHECK") {
                        benar++;
                        skor += bobotsoal;
                    }
                    else {
                        const essayScore = (0, uraian_1.calculateScore)(kuncijawaban, jawabansoal);
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
exports.hitungnilai = hitungnilai;
console.log(hitungnilai({
    "0": "A",
    "1": "A",
    "2": "A",
    "3": "A",
    "4": "A",
    "5": "A",
    "6": "A",
    "2001": "CHECK",
    "2002": "CHECK",
}, {
    "1": "a",
    "2": "x",
    "3": "x",
    "4": "a",
    "5": "x",
    "6": "x",
    "2001": "check",
    "2002": "-check",
    "2003": "-check",
    "2004": "check",
    "3001": "saturnus",
    "5001": "check",
    "5002": "-check",
    "5003": "-check",
    "5004": "check",
    "6001": "saturnus",
}, {
    "1": 16,
    "2": 0,
    "3": 0,
    "4": 16,
    "5": 0,
    "6": 0,
    "2001": 4,
    "2002": 4,
    "2003": 4,
    "2004": 4,
    "3001": 16,
    "5001": 4,
    "5002": 4,
    "5003": 4,
    "5004": 4,
    "6001": 16,
}));
