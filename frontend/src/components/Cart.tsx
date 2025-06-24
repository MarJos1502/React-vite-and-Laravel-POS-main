import React from "react";
import Receipt from "./Receipt";

interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  discount: number;
  setDiscount: (d: number) => void;
  email: string;
  setEmail: (e: string) => void;
  total: number;
  final: number;
  onCheckout: () => void;
  transaction: Record<string, unknown> | null;
  receiptUrl?: string;
}

const Cart: React.FC<CartProps> = ({
  cart,
  onUpdateQuantity,
  onRemove,
  discount,
  setDiscount,
  email,
  setEmail,
  total,
  final,
  onCheckout,
  transaction,
  receiptUrl,
}) => (
  <form onSubmit={(e) => e.preventDefault()} className="p-3">
    <h4 className="text-center mb-3 fw-semibold">Cart</h4>
    <ul className="list-group bg-light rounded shadow-sm mb-3">
      {cart.length === 0 && (
        <li className="list-group-item text-center text-muted">
          Cart is empty
        </li>
      )}
      {cart.map((item) => (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom"
          style={{ background: "transparent" }}
        >
          <span>
            <span className="fw-bold">{item.name}</span>
            <input
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) =>
                onUpdateQuantity(item.id, Number(e.target.value))
              }
              style={{ width: 60, marginLeft: 10, marginRight: 10 }}
              className="form-control d-inline-block"
            />
            <span className="text-muted">/ {item.stock} in stock</span>
          </span>
          <div>
            <span className="me-2">₱{item.price * item.quantity}</span>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
    <div className="row g-2 align-items-center mb-3">
      <div className="col">
        <input
          type="number"
          className="form-control"
          placeholder="Discount"
          value={discount > 0 ? discount : ""}
          onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
        />
      </div>
      <div className="col">
        <input
          type="email"
          className="form-control"
          placeholder="Customer Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
    </div>
    <div className="d-flex justify-content-between mb-2">
      <span className="fw-semibold">Total:</span>
      <span>₱{total}</span>
    </div>
    <div className="d-flex justify-content-between mb-3">
      <span className="fw-semibold">Final:</span>
      <span>₱{final}</span>
    </div>
    <button
      className="btn btn-success w-100 mb-2 fw-bold py-2"
      onClick={onCheckout}
      type="button"
      disabled={cart.length === 0 || !email}
    >
      Checkout
    </button>
    {transaction && (
      <div className="mt-4 p-3 border rounded bg-white shadow-sm">
        <h5 className="fw-bold mb-2">🧾 Receipt Preview</h5>
        <Receipt transaction={transaction} />
        {receiptUrl && (
          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-dark mt-2"
          >
            📥 Download PDF
          </a>
        )}
      </div>
    )}
  </form>
);

export default Cart;
