import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const AnswerFormat = z.object({
  data: z.array(
    z.object({
      username: z.string(),
      score: z.number(),
    })
  ),
});

(async () => {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `You are a teacher that grade students exams. You will give score 0 to 100.
      
      The question is Please explain what does mean of drama!. And the answer is Drama is a genre (type) of literary work that depicts human life with movement. Drama depicts the reality of life, character, and human behavior through roles and dialogues that are staged. The story and story in the drama contain conflicts and emotions that are specifically intended for theatrical performances. Drama scripts are made in such a way that they can later be staged to be enjoyed by the audience.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          alice:
            "Drama is a genre of storytelling that portrays emotional conflicts, intense character development, and compelling situations, often meant to evoke strong feelings in the audience.",
          bagus:
            "the collection of traditional beliefs, stories, customs, and practices passed down through generations within a culture or community.",
          charlie:
            "a brief fictional narrative that focuses on a single theme, character, or event, usually with a concise and impactful ending.",
          andy: "yo ndak tahu, kok tanya saya",
        }),
      },
    ],
    response_format: zodResponseFormat(AnswerFormat, "data"),
  });

  console.log(completion.choices[0].message.content);
})();
