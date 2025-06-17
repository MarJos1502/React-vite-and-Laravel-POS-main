import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  stock: number;
  // Add other fields as needed
}

export default function StockMonitoring() {
  const [products, setProducts] = useState<Product[]>([]);
  const lowStockThreshold = 5;

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h2>Stock Monitoring</h2>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr
              key={prod.id}
              className={prod.stock <= lowStockThreshold ? "table-warning" : ""}
            >
              <td>{prod.id}</td>
              <td>{prod.name}</td>
              <td>{prod.stock}</td>
              <td>
                {prod.stock <= lowStockThreshold ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    Low Stock
                  </span>
                ) : (
                  "OK"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
