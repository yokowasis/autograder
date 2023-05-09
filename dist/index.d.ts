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
declare function hitungnilai(jawaban: TypeOfJawaban, kunci: TypeOfKunci, bobot: TypeOfBobot): {
    nilai: string;
    benar: string;
    salah: string;
};
export { calculateScore, hitungnilai, extractNumber };
