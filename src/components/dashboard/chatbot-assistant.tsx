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
      // TODO: Replace with real AI API call
      // Fallback: echo or quota error message
      const quotaExceeded = false; // Set true to simulate quota error
      let botText = "";
      if (quotaExceeded) {
        botText = "Sorry, the AI assistant is temporarily unavailable due to quota limits. Please try again later.";
      } else {
        botText = `You said: "${userMsg.text}" (AI response placeholder)`;
      }
      setMessages((msgs) => [...msgs, { sender: "bot", text: botText }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[500px]">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2 mb-2">
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
        className="flex gap-2 p-2 border-t"
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
