// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import RecordScreen from "./components/RecordScreen";
import AnalysisScreen from "./components/AnalysisScreen";
import HistoryScreen from "./components/HistoryScreen";
import { defaultOptions } from "./constants/data";
import type { RecordType } from "./types/types";

export default function Page() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [page, setPage] = useState<'record' | 'analysis' | 'history'>('record');
  const [history, setHistory] = useState<RecordType[]>([]);
  // ✅ 修正版：defaultOptionsで初期化 → useEffectでlocalStorage読み込み
  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOptions = localStorage.getItem("options_v1");
      if (storedOptions) setOptions(JSON.parse(storedOptions));

      const storedHistory = localStorage.getItem("records_v4");
      if (storedHistory) setHistory(JSON.parse(storedHistory));

      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === 'dark') setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const addRecord = (record: Omit<RecordType, 'date'>) => {
    const newRecord = { ...record, date: new Date().toLocaleString() };
    const updated = [newRecord, ...history];
    setHistory(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("records_v4", JSON.stringify(updated));
    }
  };

  const buttonStyle = {
    padding: "0.5rem 1.2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    borderRadius: "16px",
    backgroundColor: theme === 'light' ? '#fff' : '#555',
    color: theme === 'light' ? '#333' : '#f0f0f0',
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out"
  };

  return (
    <main style={{
      backgroundColor: theme === 'light' ? '#f3f4f6' : '#1a1a2e',
      color: theme === 'light' ? '#333' : '#eee',
      minHeight: '100vh',
      fontFamily: 'Poppins, Inter, Roboto, sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>CORE</h1>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button style={buttonStyle} onClick={() => setPage('record')}>📋 記録</button>
        <button style={buttonStyle} onClick={() => setPage('analysis')}>📊 分析</button>
        <button style={buttonStyle} onClick={() => setPage('history')}>📖 履歴</button>
      </div>

      {page === 'record' && (
        <RecordScreen
          theme={theme}
          setTheme={setTheme}
          addRecord={addRecord}
          buttonStyle={buttonStyle}
          options={options}
          setOptions={setOptions}
        />
      )}
      {page === 'analysis' && (
        <AnalysisScreen
          history={history}
          theme={theme}
        />
      )}
      {page === 'history' && (
        <HistoryScreen
          history={history}
          theme={theme}
          buttonStyle={buttonStyle}
        />
      )}
    </main>
  );
}
