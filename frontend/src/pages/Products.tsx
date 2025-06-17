import React from 'react';
import { useAuth } from '../context/AuthContext';

const Products: React.FC = () => {
  const { user } = useAuth();

  // Sample product data
  const products = [
    { id: 1, name: 'Product 1', price: 19.99, stock: 50 },
    { id: 2, name: 'Product 2', price: 29.99, stock: 30 },
    { id: 3, name: 'Product 3', price: 39.99, stock: 20 },
  ];

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="card-title h3 mb-0">Products</h1>
            {(user?.role === 'administrator' || user?.role === 'manager') && (
              <button className="btn btn-primary">
                Add New Product
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  {(user?.role === 'administrator' || user?.role === 'manager') && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${product.stock < 30 ? 'bg-warning' : 'bg-success'}`}>
                        {product.stock}
                      </span>
                    </td>
                    {(user?.role === 'administrator' || user?.role === 'manager') && (
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary">Edit</button>
                          <button className="btn btn-outline-danger">Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
