import { useEffect, useState } from "react";

export default function FarewellMessages({
  setLoading,
}: {
  setLoading: (b: boolean) => void;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Show farewell message after transaction (feature not implemented)

  useEffect(() => {
    setLoading(true);
    fetch("/api/farewell-messages")
      .then((res) => res.json())
      .then(setMessages)
      .catch(() => setError("Failed to load messages"))
      .finally(() => setLoading(false));
  }, [setLoading]);

  const addMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setLoading(true);
    fetch("/api/farewell-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMsg }),
    })
      .then((res) => res.json())
      .then((msgs) => setMessages(msgs))
      .catch(() => setError("Failed to add message"))
      .finally(() => {
        setLoading(false);
        setNewMsg("");
      });
  };

  return (
    <div>
      <h2>Farewell Messages</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={addMessage}>
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="New message"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
