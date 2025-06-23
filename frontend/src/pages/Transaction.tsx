import { useEffect, useState } from "react";
import axios from "../lib/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Receipt from "../components/Receipt"; // Adjust path as needed
import CheckoutModal from "../components/CheckoutModal";

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
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transaction, setTransaction] = useState<any | null>(null); // Store latest transaction
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
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
    setTransaction(null);
    setCart((prev) => [...prev.filter((item) => item.id !== id)]);
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, quantity) };
        }
        return item;
      });
      return newCart;
    });
  };

  const handleCartFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Optionally, you can validate or process the cart here
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const final = Math.max(total - discount, 0);

  const checkout = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/transactions",
        {
          products: cart.map(({ id, quantity }) => ({ id, quantity })),
          discount,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const latestTransaction = response.data.transaction;
      setTransaction(latestTransaction);

      setSuccess("✅ Transaction completed!");
      setCart([]);
      setDiscount(0);
      setShowCheckoutModal(false);
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
            <form onSubmit={handleCartFormSubmit}>
              <h4>Cart</h4>
              <ul className="list-group">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {item.name}
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartQuantity(item.id, Number(e.target.value))
                        }
                        style={{ width: 60, marginLeft: 10, marginRight: 10 }}
                      />
                      <span className="text-muted">
                        / {item.stock} in stock
                      </span>
                    </span>
                    <div>
                      <span className="me-2">
                        ₱{item.price * item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 row g-2 align-items-center">
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
              <h5>Total: ₱{total}</h5>
              <h5>Final: ₱{final}</h5>
              <button
                className="btn btn-success w-100"
                onClick={() => setShowCheckoutModal(true)}
                type="button"
              >
                Checkout
              </button>
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
            </form>
          </div>
        </div>
        <CheckoutModal
          show={showCheckoutModal}
          handleClose={() => setShowCheckoutModal(false)}
          handleCheckout={checkout}
          cart={cart}
          total={total}
          final={final}
          discount={discount}
          email={email}
          setEmail={setEmail}
        />
      </div>
    </div>
  );
}
