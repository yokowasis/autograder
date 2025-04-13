import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process?.env?.OPENAI_KEY || "",
});

const AnswerFormat = z.object({
  data: z.array(
    z.object({
      username: z.string(),
      score: z.number(),
    })
  ),
});

export async function hitungAI(payload: {
  question: string;
  correctAnswer: string;
  studentAnswers: {
    [username: string]: string;
  };
}) {
  const completion = await client.chat.completions.create({
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
    response_format: zodResponseFormat(AnswerFormat, "data"),
  });

  return JSON.parse(completion?.choices?.[0]?.message?.content || "{}");
}
