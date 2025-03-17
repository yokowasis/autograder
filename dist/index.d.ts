import { calculateScore, extractNumber } from "./uraian";
import { hitungAI } from "./ai";
export type TypeOfJawaban = {
    [no: number]: string;
};
export type TypeOfKunci = {
    [no: number]: string;
};
export type TypeOfBobot = {
    [no: number]: number | string;
};
declare function hitungnilai(jawaban: TypeOfJawaban, kunci: TypeOfKunci, bobot: TypeOfBobot): {
    nilai: string;
    benar: string;
    salah: string;
};
export { calculateScore, hitungnilai, extractNumber, hitungAI };
