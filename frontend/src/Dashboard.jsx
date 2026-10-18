
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");
const [price, setPrice] = useState("");
const [category, setCategory] = useState("");
const [stock, setStock] = useState("");
const [description, setDescription] = useState("");
const [image, setImage] = useState("");

  const token = localStorage.getItem("gofmart_token");

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Products load nahi hue");
      }

      setProducts(data.products || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);
  
async function addProduct(e) {
  e.preventDefault();
  setMessage("");

  const token = localStorage.getItem("gofmart_token");

  if (!token) {
    setMessage("Please login first!");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: productName,
          price: Number(price),
          category,
          stock: Number(stock),
          description,
          image,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Product add nahi hua.");
    }

    setMessage("Product successfully added!");
    setProductName("");
    setPrice("");
    setCategory("");
    setStock("");
    setDescription("");
    setImage("");

    await loadProducts();
  } catch (error) {
    setMessage(error.message || "Backend connection error!");
  }
}


  async function deleteProduct(id) {
    if (!window.confirm("Kya tum ye product delete karna chahte ho?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Product deleted successfully");
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <h2>GOF <span>Mart</span></h2>
        <p>Seller / Admin</p>
        <a href="/">🏠 Home</a>
        <a href="/login">🔐 Login</a>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p>GOF Mart Management</p>
            <h1>Dashboard</h1>
          </div>
          <span className="dashboard-badge">Local Demo</span>
        </header>

        {message && <p className="dashboard-message">{message}</p>}

        <section className="dashboard-stats">
          <div className="stat-card">
            <p>Total Products</p>
            <h2>{products.length}</h2>
          </div>
          <div className="stat-card">
            <p>Dashboard</p>
            <h2>Active</h2>
          </div>
        </section>
        <section className="dashboard-add-product">
  <h2>Add New Product</h2>

  <form onSubmit={addProduct} className="add-product-form">
    <input
      placeholder="Product Name"
      value={productName}
      onChange={(e) => setProductName(e.target.value)}
      required
    />

    <input
      type="number"
      placeholder="Price (₹)"
      min="0.01"
      step="0.01"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      required
    />

    <input
      placeholder="Category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      required
    />

    <input
      type="number"
      placeholder="Stock Quantity"
      min="0"
      value={stock}
      onChange={(e) => setStock(e.target.value)}
      required
    />

    <input
      placeholder="Image URL (optional)"
      value={image}
      onChange={(e) => setImage(e.target.value)}
    />

    <textarea
      placeholder="Product Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    <button type="submit">Add Product</button>
  </form>
</section>

        <section className="dashboard-products">
          <div className="products-heading">
            <div>
              <h2>Product Inventory</h2>
              <p>Database mein saved products</p>
            </div>
            <button onClick={loadProducts}>Refresh</button>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>Abhi koi product available nahi hai.</p>
          ) : (
            <div className="dashboard-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => deleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
