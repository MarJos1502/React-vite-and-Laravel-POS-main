import React, { useState } from "react";

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [farewell, setFarewell] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order_id = 1;

    const res = await fetch("http://localhost:8000/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id, amount, method, reference }),
    });

    if (res.ok) {
      setMessage("Payment successful!");
      setAmount("");
      setReference("");
      setMethod("cash");

      // 🎉 Fetch and show farewell message after successful payment
      try {
        const farewellRes = await fetch(
          "http://localhost:8000/api/farewell-message"
        );
        const data = await farewellRes.json();
        setFarewell(data.message);
      } catch (err) {
        console.error("Failed to fetch farewell message:", err);
      }
    } else {
      setMessage("Payment failed.");
      setFarewell(""); // clear farewell if failed
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Method</label>
          <select
            className="form-select"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="gcash">GCash</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Reference (optional)</label>
          <input
            type="text"
            className="form-control"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Pay
        </button>
      </form>

      {message && <div className="mt-3">{message}</div>}
      {farewell && <div className="mt-2 text-success">{farewell}</div>}
    </div>
  );
}
