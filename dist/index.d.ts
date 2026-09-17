import { calculateScore, extractNumber } from "./uraian";
export type TypeOfJawaban = {
    [no: number]: string;
};
export type TypeOfKunci = {
    [no: number]: string;
};
export type TypeOfBobot = {
    [no: number]: number | string;
};
export type StatusDetail = "correct" | "wrong" | "partial";
export type TypeOfDetail = {
    [no: number]: StatusDetail;
};
declare function hitungnilai(jawaban: TypeOfJawaban, kunci: TypeOfKunci, bobot: TypeOfBobot): {
    nilai: string;
    benar: string;
    salah: string;
    detail: TypeOfDetail;
};
export { calculateScore, hitungnilai, extractNumber };
