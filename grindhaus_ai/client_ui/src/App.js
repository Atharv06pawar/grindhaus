import React, { useEffect, useRef, useState } from "react";

const USER_ID = "demo-user";
const API_URL = "http://localhost:5000/message";

const shellStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, rgba(255, 77, 77, 0.16), transparent 28%), linear-gradient(180deg, #111111 0%, #070707 100%)",
  color: "#f5f5f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  fontFamily: "Inter, system-ui, sans-serif"
};

const panelStyle = {
  width: "100%",
  maxWidth: "920px",
  height: "min(88vh, 860px)",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(12, 12, 12, 0.92)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.4)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
};

const headerStyle = {
  padding: "24px 24px 18px",
  borderBottom: "1px solid rgba(255,255,255,0.08)"
};

const messagesStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const composerStyle = {
  display: "flex",
  gap: "12px",
  padding: "18px 24px 24px",
  borderTop: "1px solid rgba(255,255,255,0.08)"
};

const inputStyle = {
  flex: 1,
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "#ffffff",
  fontSize: "16px",
  padding: "16px 18px",
  outline: "none"
};

const buttonStyle = {
  border: "none",
  borderRadius: "16px",
  background: "#ff3b30",
  color: "#ffffff",
  padding: "0 22px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer"
};

const initialMessages = [
  {
    id: "boot-message",
    from: "bot",
    text: "State your name, weight, or goal. Keep it precise."
  }
];

function MessageBubble({ message }) {
  const isUser = message.from === "user";

  return (
    <div
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "78%",
        padding: "14px 16px",
        borderRadius: isUser ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
        background: isUser ? "#ff3b30" : "rgba(255,255,255,0.08)",
        color: "#ffffff",
        lineHeight: 1.5,
        whiteSpace: "pre-wrap"
      }}
    >
      {message.text}
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || isSending) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text: trimmedInput
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: USER_ID,
          text: trimmedInput
        })
      });

      const data = await response.json();
      const replyText = typeof data.reply === "string" ? data.reply : "No reply received.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `bot-${Date.now()}`,
          from: "bot",
          text: replyText
        }
      ]);
    } catch (_error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `bot-error-${Date.now()}`,
          from: "bot",
          text: "Backend offline. Start the Node server and retry."
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={shellStyle}>
      <div style={panelStyle}>
        <div style={headerStyle}>
          <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em" }}>GrindHaus AI</div>
          <div style={{ marginTop: "6px", color: "rgba(255,255,255,0.64)" }}>
            Local trainer engine. React to Node to C++ with persistent user memory.
          </div>
        </div>

        <div style={messagesStyle}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={composerStyle}>
          <input
            style={inputStyle}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type update: my weight is 80"
            disabled={isSending}
          />
          <button type="button" style={buttonStyle} onClick={sendMessage} disabled={isSending}>
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
