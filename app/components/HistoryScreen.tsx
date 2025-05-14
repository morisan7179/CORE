// components/HistoryScreen.tsx
"use client";

import { useState } from "react";
import type { RecordType } from "../types/types";
import { positiveWords, negativeWords } from "../constants/data";

type Props = {
  theme: 'light' | 'dark';
  history: RecordType[];
  buttonStyle: React.CSSProperties;
};

export default function HistoryScreen({ theme, history, buttonStyle }: Props) {
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const filteredHistory = history.filter(record => {
    if (filter === 'all') return true;
    if (filter === 'positive') return positiveWords.includes(record.feelingWord);
    if (filter === 'negative') return negativeWords.includes(record.feelingWord);
    return true;
  });

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
        <h3>📖 記録履歴</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button style={buttonStyle} onClick={() => setFilter('all')}>すべて</button>
          <button style={buttonStyle} onClick={() => setFilter('positive')}>ポジティブ</button>
          <button style={buttonStyle} onClick={() => setFilter('negative')}>ネガティブ</button>
        </div>
      </div>

      {filteredHistory.map((record, index) => (
        <div key={index} style={cardStyle}>
          <p><strong>日時：</strong>{record.date}</p>
          <p><strong>誰と：</strong>{record.who}</p>
          <p><strong>何をした：</strong>{record.what}</p>
          <p><strong>何があった：</strong>{record.happened}</p>
          <p><strong>感情：</strong>{record.feelingWord}</p>
          <p><strong>感情強度：</strong>{record.feelingScore}</p>
          {record.memo && <p><strong>メモ：</strong>{record.memo}</p>}
        </div>
      ))}
    </div>
  );
}
