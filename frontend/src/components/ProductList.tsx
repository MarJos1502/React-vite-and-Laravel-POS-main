import React from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => (
  <div className="p-3">
    <h4 className="text-center mb-3 fw-semibold">Products</h4>
    <ul className="list-group bg-light rounded shadow-sm">
      {products.length === 0 && (
        <li className="list-group-item text-center text-muted">
          No products available
        </li>
      )}
      {products.map((p) => (
        <li
          key={p.id}
          className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom"
          style={{ background: "transparent" }}
        >
          <span>
            <span className="fw-bold">{p.name}</span>
            <span className="text-muted ms-2">₱{p.price}</span>
            <span className="badge bg-secondary ms-2">Stock: {p.stock}</span>
          </span>
          <button
            className="btn btn-outline-primary btn-sm px-3"
            onClick={() => onAddToCart(p)}
            disabled={p.stock === 0}
          >
            Add
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default ProductList;
