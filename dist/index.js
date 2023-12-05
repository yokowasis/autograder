"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNumber = exports.hitungnilai = exports.calculateScore = void 0;
const uraian_1 = require("./uraian");
Object.defineProperty(exports, "calculateScore", { enumerable: true, get: function () { return uraian_1.calculateScore; } });
Object.defineProperty(exports, "extractNumber", { enumerable: true, get: function () { return uraian_1.extractNumber; } });
function hitungnilai(jawaban, kunci, bobot) {
    var _a, _b;
    let benar = 0;
    let salah = 0;
    let skor = 0;
    if (jawaban && kunci && bobot) {
        for (const no in kunci) {
            if (Object.hasOwnProperty.call(kunci, no)) {
                if (kunci[no]) {
                    let kuncijawaban = kunci[no].toLowerCase().trim();
                    let jawabansoal = ((_a = jawaban[no]) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || "";
                    let bobotsoal = parseFloat(((_b = bobot === null || bobot === void 0 ? void 0 : bobot[no]) === null || _b === void 0 ? void 0 : _b.toString().replace(",", ".")) || "0");
                    let bonus = false;
                    const kunciAsNumber = (0, uraian_1.extractNumber)(jawabansoal.replace(",", ".").replace(" ", ""));
                    const jawabanAsNumber = (0, uraian_1.extractNumber)(kuncijawaban.replace(",", ".").replace(" ", ""));
                    if (kuncijawaban === "x" ||
                        (kuncijawaban === "-check" && jawabansoal !== "check")) {
                        bonus = true;
                    }
                    let d = 0;
                    if (bonus) {
                        benar++;
                        skor += bobotsoal;
                        d = 1;
                    }
                    else if (kuncijawaban === jawabansoal) {
                        // Check Kunci PG
                        benar++;
                        skor += bobotsoal;
                        d = 2;
                    }
                    else if (kunciAsNumber !== 0 && kunciAsNumber === jawabanAsNumber) {
                        benar++;
                        skor += bobotsoal;
                        d = 3;
                    }
                    else if (kuncijawaban === "check") {
                        salah++;
                        d = 4;
                    }
                    else if (kuncijawaban === "-check" && jawabansoal !== "check") {
                        benar++;
                        skor += bobotsoal;
                        d = 5;
                    }
                    else {
                        const essayScore = (0, uraian_1.calculateScore)(kuncijawaban, jawabansoal);
                        benar += essayScore;
                        skor += essayScore * bobotsoal;
                        salah += 1 - essayScore;
                        d = 6;
                    }
                }
            }
        }
    }
    return {
        nilai: (skor === null || skor === void 0 ? void 0 : skor.toFixed(2)) || "0",
        benar: (benar === null || benar === void 0 ? void 0 : benar.toFixed(2)) || "0",
        salah: (salah === null || salah === void 0 ? void 0 : salah.toFixed(2)) || "0",
    };
}
exports.hitungnilai = hitungnilai;
