"use client";

import { useEffect, useState } from "react";
import type { RecordType } from "../types/types";
import { analyzeWithAI } from "../untils/openai";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { positiveWords, negativeWords } from "../constants/data";



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

  const feelingCategoryCount = new Map<string, number>();
  const whoCount = new Map<string, number>();
  const whatCount = new Map<string, number>();
  const happenedCount = new Map<string, number>();
  const feelingWordCount = new Map<string, number>();
  const keywordCount = new Map<string, number>();

  history.forEach((record) => {
    let category = "その他";
    if (positiveWords.includes(record.feelingWord)) category = "ポジティブ";
    if (negativeWords.includes(record.feelingWord)) category = "ネガティブ";
    feelingCategoryCount.set(category, (feelingCategoryCount.get(category) || 0) + record.feelingScore);

    whoCount.set(record.who, (whoCount.get(record.who) || 0) + 1);
    whatCount.set(record.what, (whatCount.get(record.what) || 0) + 1);
    happenedCount.set(record.happened, (happenedCount.get(record.happened) || 0) + 1);
    feelingWordCount.set(record.feelingWord, (feelingWordCount.get(record.feelingWord) || 0) + 1);

    [record.who, record.what, record.happened, record.feelingWord].forEach(word => {
      if (!word) return;
      const score = record.feelingScore || 1;
      keywordCount.set(word, (keywordCount.get(word) || 0) + score);
    });
  });

  const getTop3 = (map: Map<string, number>) =>
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(e => e[0]);

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
        <h3>🎨 感情ドーナツグラフ</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={Array.from(feelingCategoryCount.entries()).map(([name, value]) => ({ name, value }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {Array.from(feelingCategoryCount.keys()).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={
                  entry === "ポジティブ" ? "#82ca9d" :
                  entry === "ネガティブ" ? "#ff7f7f" :
                  "#d3d3d3"
                } />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h3>📊 単語統計による傾向分析</h3>
        <p>
          あなたは「{getTop3(whoCount).join("」「")}」いるとき、<br />
          「{getTop3(whatCount).join("」「")}」したとき、<br />
          「{getTop3(happenedCount).join("」「")}」とき、<br />
          「{getTop3(feelingWordCount).join("」「")}」と感じる傾向があります。
        </p>
      </div>

      <div style={cardStyle}>
        <h3>🧭 AIによる総合傾向分析</h3>
        <p>{aiResult || "履歴データから分析中です..."}</p>
      </div>

      <div style={cardStyle}>
        <h3>📋 キーワードランキング</h3>
        <ol>
          {Array.from(keywordCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([word, count]) => (
              <li key={word}>{word}：{count}pt</li>
          ))}
        </ol>
      </div>

      
    </div>
  );
}
