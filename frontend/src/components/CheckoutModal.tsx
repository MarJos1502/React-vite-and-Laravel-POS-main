import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../lib/axios";

interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

interface CheckoutModalProps {
  show: boolean;
  handleClose: () => void;
  handleCheckout: () => void;
  cart: CartItem[];
  total: number;
  final: number;
  discount: number;
  email: string;
  setEmail: (email: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  show,
  handleClose,
  handleCheckout,
  cart,
  total,
  final,
  discount,
  email,
  setEmail,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // This function sends the correct payload to Make.com
  const fetchTransactionsFromMake = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://hook.eu2.make.com/snc4pm6kaapixwvaxnfcy3fvy08nctsg",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "fetch_transactions",
            timestamp: new Date().toISOString(),
            data: {
              cart: cart.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                stock: item.stock,
                quantity: item.quantity,
              })),
              total,
              final,
              discount,
              email,
            },
          }),
        }
      );
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);
      // No need to parse response, Make.com just needs the POST
    } catch (err) {
      setError("Failed to fetch transactions from make.com");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCheckout = async () => {
    setIsLoading(true);
    try {
      await handleCheckout(); // Your backend checkout
      await fetchTransactionsFromMake(); // Send to Make.com
      setEmail(""); // Clear email after checkout
      handleClose();
    } catch (err) {
      setError("Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Order Summary</h5>
        <ul className="list-group mb-3">
          {cart.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {item.name} x {item.quantity}
              <span>₱{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-between">
          <strong>Total:</strong>
          <strong>₱{total}</strong>
        </div>
        {discount > 0 && (
          <div className="d-flex justify-content-between">
            <strong>Discount:</strong>
            <strong className="text-danger">- ₱{discount}</strong>
          </div>
        )}
        <hr />
        <div className="d-flex justify-content-between">
          <h5>Final Amount:</h5>
          <h5>₱{final}</h5>
        </div>
        <Form.Group className="mt-3" controlId="customerEmail">
          <Form.Label>Customer Email (for receipt)</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter customer email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </Form.Group>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirmCheckout}
          disabled={isLoading || !email}
        >
          {isLoading ? "Processing..." : "Confirm Checkout"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal;
