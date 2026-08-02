import { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Bot, MessageCircle, Send, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AiAssistant() {
  const { t } = useTranslation();
  const chat = useAction(api.assistant.chat);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: t('errors.aiWelcome'),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length, open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMessage: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const history = nextMessages.slice(0, -1).slice(-10);
      const { reply } = await chat({ message: text, history });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : t('errors.errorOccurred');
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t('errors.aiError', { error: errMsg }) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex w-[min(100vw-2rem,380px)] flex-col rounded-2xl bg-white shadow-2xl border border-gray-100"
      dir="rtl"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-bold">{t('errors.aqraplyAssistant')}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-1 hover:bg-white/20"
          aria-label={t('errors.close')}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96 min-h-[200px]">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  isUser
                    ? "bg-orange-500 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-end">
            <div className="rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin inline ml-1" />
              جاري الكتابة...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-100 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب سؤالك..."
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          disabled={loading}
          dir="rtl"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-orange-500 p-2 text-white disabled:opacity-50 hover:bg-orange-600"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
}
