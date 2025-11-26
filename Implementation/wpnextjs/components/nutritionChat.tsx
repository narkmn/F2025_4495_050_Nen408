"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X } from "lucide-react";

export default function NutritionChat({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const restUrl = "https://healthacademy.ca/wp-json/nutrition-bot/v1";

  /* Load history */
  useEffect(() => {
    if (!open) return;
    fetch(restUrl + "/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setMessages(d.history || []));
  }, [open, token]);

  /* Auto-scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Send message */
  const sendMessage = async () => {
    const text = inputRef.current?.value.trim();
    if (!text) return;

    const userMsg = { role: "user", message: text };
    setMessages((prev) => [...prev, userMsg]);
    inputRef.current!.value = "";
    setLoading(true);

    const resp = await fetch(restUrl + "/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: text }),
    });

    setLoading(false);
    const data = await resp.json();

    setMessages((prev) => [...prev, { role: "assistant", message: data.reply }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {/* Toggle Button - Green */}
        <button
          onClick={() => setOpen(!open)}
          className="group flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-2xl transition-all duration-200 hover:bg-green-700 hover:scale-110 focus:outline-none"
          aria-label="Open nutrition chat"
        >
          {open ? (
            <X className="h-8 w-8" />
          ) : (
            <MessageCircle className="h-9 w-9" />
          )}
        </button>

        {/* Chat Panel - Slides in/out */}
        <div
          className={`absolute bottom-20 right-0 w-96 transform transition-all duration-300 ease-out ${
            open
              ? "translate-y-0 opacity-100"
              : "translate-y-8 scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <div className="h-[540px] w-full overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between bg-green-600 px-5 py-4 text-white">
              <h3 className="text-lg font-semibold">Nutrition Coach</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl leading-none hover:opacity-80"
              >
                ×
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {messages.length === 0 && !loading && (
                <p className="text-center text-gray-500 mt-10">
                  Ask me anything about nutrition!
                </p>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {m.message}
                    <div
                      className={`mt-1 text-xs opacity-70 ${
                        m.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                    Thinking…
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Ask about nutrition…"
                  className="flex-1 rounded-full border border-gray-300 px-5 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="rounded-full bg-green-600 px-6 py-3 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}