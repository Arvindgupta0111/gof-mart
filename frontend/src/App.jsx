import Dashboard from "./Dashboard";
import Login from "./Login";
import "./App.css";
import { useEffect, useState } from "react";
import Cart from "./Cart";
import Checkout from "./Checkout";
import MyOrders from "./MyOrders";

function App() {
  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [cart, setCart] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("gofmart_cart")) || [];
  } catch {
    return [];
  }
});

function addToCart(product) {
  const existing = cart.find((item) => item._id === product._id);

  const updatedCart = existing
    ? cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    : [...cart, { ...product, quantity: 1 }];

  setCart(updatedCart);
  localStorage.setItem("gofmart_cart", JSON.stringify(updatedCart));
}


useEffect(() => {
  fetch("http://localhost:5000/api/products")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Products load nahi hue");
      }
      return response.json();
    })
    .then((data) => {
      setProducts(data.products || []);
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);
if (window.location.pathname === "/login") {
  return <Login />;
}
if (window.location.pathname === "/dashboard") {
  return <Dashboard />;
}
if (window.location.pathname === "/cart") {
  return <Cart />;
}
if (window.location.pathname === "/checkout") {
  return <Checkout />;
}
if (window.location.pathname === "/my-orders") {
  return <MyOrders />;
}
  return (
    <div className="app">
      <header className="navbar">
        <h1 className="logo">GOF <span>Mart</span></h1>

        <input
          className="search"
          type="text"
          placeholder="Search fruits, vegetables..."
        />

        <nav>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#contact">Contact</a>
          <a href="/my-orders">My Orders</a>
          
<button
  className="logout-btn"
  onClick={() => {
    localStorage.removeItem("gofmart_token");
    window.location.href = "/login";
  }}
>
  Logout
</button>

        </nav>

        
<button
  className="cart"
  onClick={() => {
    window.location.href = "/cart";
  }}
>
  🛒 Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
</button>

      </header>

      <main id="home">
        <section className="hero">
          <div>
            <p className="tagline">FRESHNESS AT YOUR DOORSTEP</p>
            <h2>Fresh Groceries,<br />Happy Families!</h2>
            <p>
              Shop fresh fruits, vegetables and daily essentials
              for your family.
            </p>
            <a className="shop-btn" href="#products">
              Shop Now →
            </a>
          </div>

          <div className="hero-emoji">🥦 🍎 🥕</div>
        </section>

        <section id="products" className="products">
          <h2>Shop by Category</h2>
          <p className="subtitle">Everything fresh, all in one place</p>

          <div className="category-grid">
            <div className="category-card">
              <span>🍎</span>
              <h3>Fresh Fruits</h3>
              <p>Sweet and healthy</p>
            </div>

            <div className="category-card">
              <span>🥦</span>
              <h3>Vegetables</h3>
              <p>Farm fresh daily</p>
            </div>

            <div className="category-card">
              <span>🥛</span>
              <h3>Dairy Products</h3>
              <p>Fresh and nutritious</p>
            </div>

            <div className="category-card">
              <span>🍞</span>
              <h3>Daily Essentials</h3>
              <p>For everyday needs</p>
            </div>
          </div>
          
<div className="api-products">
  <h2>Our Products</h2>

  {loading && <p>Loading products...</p>}

  {error && <p className="error-message">{error}</p>}

  {!loading && !error && products.length === 0 && (
    <p>Abhi koi product available nahi hai.</p>
  )}

  <div className="product-grid">
    {products.map((product) => (
      <div className="product-card" key={product._id}>
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-placeholder">🛒</div>
        )}

        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="product-price">₹{product.price}</p>
        
<button
  className="add-to-cart-btn"
  onClick={() => addToCart(product)}
>
  Add to Cart
</button>

        <p>Stock: {product.stock}</p>
      </div>
    ))}
  </div>
</div>

        </section>

        <footer id="contact">
          <h2>GOF Mart</h2>
          <p>Your family's everyday grocery partner.</p>
          <p>© 2026 GOF Mart. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
