import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../lib/axios";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

const Products: React.FC = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    sku: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch products from backend on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (err: any) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);
    setError("");
    try {
      // Parse price and stock to numbers before sending
      const payload = {
        name: formData.name,
        price: formData.price === "" ? 0 : parseFloat(formData.price),
        stock: formData.stock === "" ? 0 : parseInt(formData.stock),
        sku: formData.sku,
      };
      await axios.post("/api/products", payload);
      setShowModal(false);
      setFormData({ name: "", price: "", stock: "", sku: "" });
      await fetchProducts(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const generateSku = () => {
    return "PROD" + Date.now();
  };

  const openAddModal = () => {
    setFormData({ name: "", price: "", stock: "", sku: generateSku() });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      sku: product.sku,
    });
    setShowModal(true);
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: formData.name,
        price: formData.price === "" ? 0 : parseFloat(formData.price),
        stock: formData.stock === "" ? 0 : parseInt(formData.stock),
        sku: formData.sku,
      };
      await axios.put(`/api/products/${editingProduct.id}`, payload);
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: "", price: "", stock: "", sku: "" });
      await fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/api/products/${id}`);
      await fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="card-title h3 mb-0">Products</h1>
            {(user?.role === "administrator" || user?.role === "manager") && (
              <button className="btn btn-primary" onClick={openAddModal}>
                Add New Product
              </button>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div>Loading...</div>}

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  {(user?.role === "administrator" ||
                    user?.role === "manager") && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>₱{Number(product.price).toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          product.stock < 30 ? "bg-warning" : "bg-success"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    {(user?.role === "administrator" ||
                      user?.role === "manager") && (
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openEditModal(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
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

      {/* Add Product Modal */}
      {showModal && (
        <>
          <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Product</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      editingProduct ? handleEditProduct() : handleAddProduct();
                    }}
                  >
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        autoFocus
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.sku}
                        readOnly
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                      onClick={
                        editingProduct ? handleEditProduct : handleAddProduct
                      }
                    >
                      {loading
                        ? editingProduct
                          ? "Saving..."
                          : "Adding..."
                        : editingProduct
                        ? "Save Changes"
                        : "Add Product"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Clickable backdrop to close modal */}
          <div
            className="modal-backdrop show"
            style={{ zIndex: 1040 }}
            onClick={() => setShowModal(false)}
          ></div>
        </>
      )}
    </div>
  );
};

export default Products;
