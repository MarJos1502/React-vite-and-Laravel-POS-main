import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Receipt from "../components/Receipt"; // Adjust path as needed

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Transactions() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transaction, setTransaction] = useState<any | null>(null); // Store latest transaction

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/products");
      setProducts(res.data);
    } catch (err) {
      setError("🚨 Failed to fetch products.");
    }
  };

  const addToCart = (product: Product) => {
    setTransaction(null); // Clear receipt on cart change
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        if (exists.quantity + 1 > product.stock) {
          setError(`🚨 Not enough stock for ${product.name}`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setTransaction(null); // Clear receipt on cart change
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const final = Math.max(total - discount, 0);

  const checkout = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("🚨 Please enter a valid email.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/transactions",
        {
          products: cart.map(({ id, quantity }) => ({ id, quantity })),
          email,
          discount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const latestTransaction = response.data.transaction;
      setTransaction(latestTransaction);

      await axios.post("http://localhost:8000/api/send-receipt-email", {
        email,
        transaction: latestTransaction,
      });

      setSuccess("✅ Transaction completed and receipt sent!");
      setCart([]);
      setEmail("");
      setDiscount(0);
    } catch (err) {
      setError("🚨 Transaction failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container text-center">
        <h2>Transactions</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="row mt-4">
          <div className="col-md-6">
            <h4>Products</h4>
            <ul className="list-group">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {p.name} - ₱{p.price} (Stock: {p.stock})
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => addToCart(p)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-6">
            <h4>Cart</h4>
            <ul className="list-group">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {item.name} x {item.quantity}
                  <div>
                    <span className="me-2">₱{item.price * item.quantity}</span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Customer Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
              <h5>Total: ₱{total}</h5>
              <h5>Final: ₱{final}</h5>
              <button className="btn btn-success w-100" onClick={checkout}>
                Checkout
              </button>
            </div>

            {transaction && (
              <div className="mt-4 p-3 border rounded bg-light">
                <h5>🧾 Receipt Preview</h5>
                <Receipt transaction={transaction} />
                <a
                  href={`http://localhost:8000/api/receipt/download/${transaction.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-dark mt-2"
                >
                  📥 Download PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
