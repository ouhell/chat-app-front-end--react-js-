import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import axios from "axios";
import classes from "./AiChatBox.module.scss";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface AiChatBoxProps {
  onClose?: () => void;
}

export default function AiChatBox({ onClose }: AiChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 64) + "px";
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    autoResize(e.target);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await axios.post(
        "api/ai/chat",
        {
          input: trimmed,
          sessionId: sessionIdRef.current,
        },
        { withCredentials: true },
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: res.data.content,
      };

      const sessionId = res.data.sessionId;
      sessionIdRef.current = sessionId;

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setError("Failed to get a response. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={classes.AiChatBox}>
      {/* Header */}
      <div className={classes.Header}>
        {onClose && (
          <button className={classes.BackButton} onClick={onClose}>
            <svg viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
        )}
        <div className={classes.AiAvatar}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <div className={classes.HeaderInfo}>
          <span>AI Assistant</span>
          <span>Always online</span>
        </div>
      </div>

      {/* Messages */}
      <div className={classes.Messages}>
        {messages.length === 0 && !loading && (
          <div className={classes.EmptyState}>
            <div className={classes.EmptyIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <span>Chat with AI</span>
            <span>Ask anything — get instant answers powered by AI.</span>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${classes.MessageBubble} ${
              msg.role === "user" ? classes.UserBubble : classes.AiBubble
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className={classes.TypingIndicator}>
            <span />
            <span />
            <span />
          </div>
        )}

        {error && <div className={classes.ErrorBubble}>{error}</div>}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={classes.InputArea}>
        <div className={classes.InputWrapper}>
          <textarea
            ref={textareaRef}
            className={classes.InputField}
            placeholder="Ask AI something..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={classes.SendButton}
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
