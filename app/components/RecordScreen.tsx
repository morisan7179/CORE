// components/RecordScreen.tsx
"use client";

import { useState } from "react";
import type { RecordType } from "../types/types";
import { defaultOptions } from "../constants/data";

type Props = {
  theme: 'light' | 'dark';
  setTheme: (value: 'light' | 'dark') => void;
  addRecord: (record: Omit<RecordType, 'date'>) => void;
  buttonStyle: React.CSSProperties;
  options: typeof defaultOptions;
  setOptions: (options: typeof defaultOptions) => void;
};

export default function RecordScreen({ theme, setTheme, addRecord, buttonStyle, options, setOptions }: Props) {
  const [who, setWho] = useState("");
  const [what, setWhat] = useState("");
  const [happened, setHappened] = useState("");
  const [feelingWord, setFeelingWord] = useState("");
  const [feelingScore, setFeelingScore] = useState(3);
  const [memo, setMemo] = useState("");

  const [newWord, setNewWord] = useState("");
  const [targetList, setTargetList] = useState<'who' | 'what' | 'happened' | 'feeling'>('who');
  const [longPressWord, setLongPressWord] = useState<string | null>(null);

  const handleAddWord = () => {
    if (!newWord.trim()) return;
    const updated = { ...options, [targetList]: [...options[targetList], newWord.trim()] };
    setOptions(updated);
    if (typeof window !== "undefined") localStorage.setItem("options_v1", JSON.stringify(updated));
    setNewWord("");
  };
const handleDeleteWord = (listName: string, word: string) => {
    const updated = { 
        ...options, 
        [listName]: (options as any)[listName].filter((w: string) => w !== word) 
    };
    setOptions(updated);
    if (typeof window !== "undefined") {
        localStorage.setItem("options_v1", JSON.stringify(updated));
    }
};


  const cardStyle = {
    backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c',
    padding: '1rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    marginBottom: '1.5rem'
  };

  const choiceButton = (value: string, selected: string, setSelected: any, listName: string) => {
    let timer: NodeJS.Timeout;
    return (
      <button
        key={value}
        style={{
          padding: "0.5rem 0.75rem",
          margin: "0.25rem",
          border: selected === value ? "2px solid #007bff" : "1px solid #ccc",
          borderRadius: "20px",
          backgroundColor: selected === value ? "#007bff" : (theme === 'light' ? '#fff' : '#555'),
          color: selected === value ? "#fff" : (theme === 'light' ? '#333' : '#eee'),
          cursor: "pointer",
          position: "relative"
        }}
        onMouseDown={() => {
          timer = setTimeout(() => setLongPressWord(value), 500);
        }}
        onMouseUp={() => clearTimeout(timer)}
        onMouseLeave={() => clearTimeout(timer)}
        onClick={() => {
          if (longPressWord === value) return;
          setSelected(value);
          setLongPressWord(null);
        }}
      >
        {value}
        {longPressWord === value && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              cursor: "pointer"
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteWord(listName, value);
              setLongPressWord(null);
            }}
          >
            🗑️
          </span>
        )}
      </button>
    );
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          style={{
            padding: "0.4rem 0.8rem",
            fontSize: "0.9rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            borderRadius: "9999px",
            backgroundColor: theme === 'light' ? '#fff' : '#555',
            color: theme === 'light' ? '#333' : '#eee',
            cursor: "pointer",
            border: "1px solid #ccc"
          }}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          🌙 ダークモード {theme === 'light' ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={cardStyle}>
        <h2>📥 単語追加</h2>
        <select value={targetList} onChange={e => setTargetList(e.target.value as any)}>
          <option value="who">誰と</option>
          <option value="what">何をした</option>
          <option value="happened">何があった</option>
          <option value="feeling">感情単語</option>
        </select>
        <input type="text" value={newWord} onChange={e => setNewWord(e.target.value)} placeholder="追加単語" />
        <button onClick={handleAddWord}>追加</button>
      </div>

      <div style={cardStyle}><p>👥 誰と</p>{options.who.map(option => choiceButton(option, who, setWho, 'who'))}</div>
      <div style={cardStyle}><p>🎯 何をした</p>{options.what.map(option => choiceButton(option, what, setWhat, 'what'))}</div>
      <div style={cardStyle}><p>📋 何があった</p>{options.happened.map(option => choiceButton(option, happened, setHappened, 'happened'))}</div>
      <div style={cardStyle}><p>💡 感情単語</p>{options.feeling.map(option => choiceButton(option, feelingWord, setFeelingWord, 'feeling'))}</div>

      <div style={cardStyle}>
        <p>📊 感情の強さ（1〜5）</p>
        <input type="range" min="1" max="5" value={feelingScore} onChange={e => setFeelingScore(Number(e.target.value))} />
        <div>{feelingScore}</div>
      </div>

      <div style={cardStyle}>
        <p>📝 メモ（任意）</p>
        <textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder="自由記入欄" style={{ width: "100%", minHeight: "80px" }} />
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={() => {
          if (!who || !what || !happened || !feelingWord) return;
          addRecord({ who, what, happened, feelingWord, feelingScore, memo });
          setWho(""); setWhat(""); setHappened(""); setFeelingWord(""); setFeelingScore(3); setMemo("");
        }} style={{
          padding: "0.5rem 1.2rem",
          fontSize: "1rem",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          borderRadius: "9999px",
          backgroundColor: theme === 'light' ? '#fff' : '#555',
          color: theme === 'light' ? '#333' : '#eee',
          cursor: "pointer",
          border: "1px solid #aaa"
        }}>
          記録する
        </button>
      </div>
    </div>
  );
}
