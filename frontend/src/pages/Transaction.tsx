import { useEffect, useState } from "react";
import axios from "../lib/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";
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

const Transaction = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transaction, setTransaction] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch {
      setError("🚨 Failed to fetch products.");
    }
  };

  const addToCart = (product: Product) => {
    setTransaction(null);
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
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
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
    } catch {
      setError("🚨 Transaction failed. Please try again.");
    }
  };

  return (
    <div
      className="transaction-bg py-5"
      style={{ minHeight: "100vh", background: "#f7f8fa" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow border-0 p-4">
              <h2
                className="mb-4 text-center fw-bold"
                style={{ letterSpacing: 1 }}
              >
                Transactions
              </h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <div className="row mt-4">
                <div className="col-md-6 border-end">
                  <ProductList products={products} onAddToCart={addToCart} />
                </div>
                <div className="col-md-6">
                  <Cart
                    cart={cart}
                    onUpdateQuantity={updateCartQuantity}
                    onRemove={removeFromCart}
                    discount={discount}
                    setDiscount={setDiscount}
                    email={email}
                    setEmail={setEmail}
                    total={total}
                    final={final}
                    onCheckout={() => setShowCheckoutModal(true)}
                    transaction={transaction}
                    receiptUrl={
                      transaction
                        ? `http://localhost:8000/api/receipt/download/${transaction.id}`
                        : undefined
                    }
                  />
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
        </div>
      </div>
    </div>
  );
};

export default Transaction;
