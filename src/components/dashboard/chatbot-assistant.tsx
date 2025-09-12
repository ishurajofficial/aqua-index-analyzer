import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export function ChatbotAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user" as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await res.json();
      const botText = data.reply || data.error || 'No response';
      setMessages((msgs) => [...msgs, { sender: 'bot', text: botText }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <Card className="flex flex-col h-[400px] shadow-none border-dashed">
      <CardHeader className="p-4">
        <CardTitle className="text-base">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2 mb-2 p-4 pt-0">
        {messages.length === 0 && (
          <div className="text-muted-foreground text-sm">Ask me anything about water quality, indices, or this dashboard!</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm p-2 rounded ${msg.sender === "user" ? "bg-primary/10 text-primary" : "bg-muted"}`}>
            <b>{msg.sender === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}
      </CardContent>
      <form
        className="flex gap-2 p-4 border-t"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          ref={inputRef}
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()} size="sm">
          {loading ? "..." : "Send"}
        </Button>
      </form>
    </Card>
  );
}
