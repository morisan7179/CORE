"use client";

import { useEffect, useState } from "react";
import type { RecordType } from "../types/types";
import { analyzeWithAI } from "../untils/openai";

type Props = {
  history: RecordType[];
  theme: 'light' | 'dark';
};

export default function AnalysisScreen({ history, theme }: Props) {
  const [aiResult, setAiResult] = useState("");

  const cardStyle = {
    backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c',
    padding: '1rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    marginBottom: '1.5rem'
  };

  useEffect(() => {
    if (history.length === 0) return;

    const allWords = history.flatMap(record => [
      record.who,
      record.what,
      record.happened,
      record.feelingWord,
      ...(record.memo ? record.memo.split(/\s+/) : [])
    ]);

    const wordCount = new Map<string, number>();
    allWords.forEach(word => {
      if (!word) return;
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    const topWords = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)
      .join(", ");

    const prompt = `
あなたは心理カウンセラーです。
以下の単語群は、ある人物の生活・感情・体験を表しています。
この人物の「最近の傾向」「特徴」「アドバイス」を優しくわかりやすく100文字程度でまとめてください。
---
${topWords}
---
`;

    analyzeWithAI(prompt).then(setAiResult).catch(() => setAiResult("AI解析に失敗しました。"));
  }, [history]);

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div style={cardStyle}>
        <h3>📝 AIによる総合傾向分析</h3>
        <p>{aiResult || "履歴データから分析中です..."}</p>
      </div>
    </div>
  );
}
