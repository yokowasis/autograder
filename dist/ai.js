"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hitungAI = void 0;
const openai_1 = require("openai");
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("zod");
require("dotenv/config");
const client = new openai_1.default({
    apiKey: process.env.OPENAI_KEY,
});
const AnswerFormat = zod_2.z.object({
    data: zod_2.z.array(zod_2.z.object({
        username: zod_2.z.string(),
        score: zod_2.z.number(),
    })),
});
function hitungAI(payload) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const completion = yield client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `You are a teacher that grade students exams. You will give score either 0 to 100. Do not afraid to give 0, or 100.
      
      The question is ${payload.question}. And the answer is ${payload.correctAnswer}`,
                },
                {
                    role: "user",
                    content: JSON.stringify(payload.studentAnswers),
                },
            ],
            response_format: (0, zod_1.zodResponseFormat)(AnswerFormat, "data"),
        });
        return JSON.parse(((_c = (_b = (_a = completion === null || completion === void 0 ? void 0 : completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || "{}");
    });
}
exports.hitungAI = hitungAI;
