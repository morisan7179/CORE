export async function analyzeWithAI(prompt: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("API request failed");
  
  const data = await response.json();
  return data.result;
}
