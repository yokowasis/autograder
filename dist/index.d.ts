type TypeOfJawaban = {
    [no: number]: string;
};
type TypeOfKunci = {
    [no: number]: string;
};
type TypeOfBobot = {
    [no: number]: number;
};
export declare function hitungnilai(jawaban: TypeOfJawaban, kunci: TypeOfKunci, bobot: TypeOfBobot): {
    nilai: string;
    benar: string;
    salah: string;
};
export {};
