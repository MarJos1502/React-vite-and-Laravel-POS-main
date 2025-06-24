import { useEffect, useState } from "react";

// Type for message (string or object)
type Message = string | { message: string };

export default function FarewellMessages(props: {
  setLoading?: (b: boolean) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use prop setLoading if provided, else use local loading
  const setLoadingSafe = (b: boolean) => {
    setLoading(b);
    if (props.setLoading) props.setLoading(b);
  };

  // Always use the correct backend URL (adjust if needed)
  const API_URL = "/api/farewell-messages";

  // Load messages on mount
  useEffect(() => {
    setLoadingSafe(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load messages");
        return res.json();
      })
      .then(setMessages)
      .catch(() => setError("Failed to load messages"))
      .finally(() => setLoadingSafe(false));
    // eslint-disable-next-line
  }, []);

  // Add a new message
  const addMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setLoadingSafe(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMsg }),
      });
      if (!res.ok) throw new Error("Failed to add message");
      const msgs = await res.json();
      setMessages(msgs);
      setNewMsg("");
    } catch {
      setError("Failed to add message");
    } finally {
      setLoadingSafe(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>Farewell Messages</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form
        onSubmit={addMessage}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="New message"
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading || !newMsg.trim()}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
      {loading && <div>Loading...</div>}
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{typeof msg === "string" ? msg : msg.message}</li>
        ))}
      </ul>
    </div>
  );
}
