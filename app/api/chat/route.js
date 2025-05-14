// app/api/chat/route.js
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { message } = await req.json();

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: message }],
  });

  return new Response(JSON.stringify({
    reply: chatCompletion.choices[0].message.content,
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
