// components/AnalysisScreen.tsx
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { positiveWords, negativeWords } from "../constants/data";
import type { RecordType } from "../types/types";

const COLORS = ["#00C49F", "#FF8042", "#0088FE"];

type Props = {
  history: RecordType[];
  theme: 'light' | 'dark';
};

export default function AnalysisScreen({ history, theme }: Props) {
  const feelingCategoryCount = new Map<string, number>();
  const whoCount = new Map<string, number>();
  const whatCount = new Map<string, number>();
  const happenedCount = new Map<string, number>();
  const feelingWordCount = new Map<string, number>();
  const keywordCount = new Map<string, number>();

  history.forEach((record) => {
    const category = positiveWords.includes(record.feelingWord) ? "ポジティブ" :
                     negativeWords.includes(record.feelingWord) ? "ネガティブ" : "その他";
    feelingCategoryCount.set(category, (feelingCategoryCount.get(category) || 0) + 1);

    whoCount.set(record.who, (whoCount.get(record.who) || 0) + 1);
    whatCount.set(record.what, (whatCount.get(record.what) || 0) + 1);
    happenedCount.set(record.happened, (happenedCount.get(record.happened) || 0) + 1);
    feelingWordCount.set(record.feelingWord, (feelingWordCount.get(record.feelingWord) || 0) + 1);

    [record.who, record.what, record.happened, record.feelingWord].forEach(word => {
      keywordCount.set(word, (keywordCount.get(word) || 0) + 1);
    });
  });

  const getTop3 = (map: Map<string, number>) =>
    Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

  const pieData = Array.from(feelingCategoryCount.entries()).map(([name, value]) => ({ name, value }));
  const keywordRanking = Array.from(keywordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const cardStyle = {
    backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c',
    padding: '1rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    marginBottom: '1.5rem'
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🧭 感情カテゴリ総合スコア</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h3>📝 あなたの傾向</h3>
        <p>
          あなたは「{getTop3(whoCount).join('」「')}」いるとき、
          「{getTop3(whatCount).join('」「')}」したとき、
          「{getTop3(happenedCount).join('」「')}」あったとき、
          よく「{getTop3(feelingWordCount).join('」「')}」を感じる傾向があります。
        </p>
      </div>

      <div style={cardStyle}>
        <h3>📋 キーワードランキング</h3>
        <ol>
          {keywordRanking.map(([word, count]) => (
            <li key={word}>{word}：{count}回</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
