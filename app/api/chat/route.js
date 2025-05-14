import { OpenAI } from "openai";

// 環境変数から OpenAI APIキーを取得
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o", // 最新モデル。必要に応じて "gpt-3.5-turbo" に変えてOK
      messages: [
        { role: "system", content: "あなたは優しい心理カウンセラーです。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500, // 必要に応じて調整
    });

    return Response.json({
      result: chatResponse.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
