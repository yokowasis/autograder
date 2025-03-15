import "dotenv/config";
export declare function hitungAI(payload: {
    question: string;
    correctAnswer: string;
    studentAnswers: {
        [username: string]: string;
    };
}): Promise<any>;
