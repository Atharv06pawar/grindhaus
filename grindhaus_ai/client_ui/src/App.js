import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: 20 }}>
      <h2>GrindHaus AI</h2>

      <div style={{
        flex: 1,
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: 6,
        padding: 10,
        marginBottom: 10
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === "user" ? "right" : "left" }}>
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          style={{ flex: 1, padding: 10 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10 }}>Send</button>
      </div>
    </div>
  );
}

export default App;
