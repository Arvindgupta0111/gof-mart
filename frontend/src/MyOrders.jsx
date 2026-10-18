
import { useEffect, useState } from "react";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      const token = localStorage.getItem("gofmart_token");

      if (!token) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders.");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>
      <p className="orders-subtitle">
        Track your GOF Mart purchases.
      </p>

      {loading && <p>Loading your orders...</p>}

      {!loading && error && (
        <p className="orders-error">{error}</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-orders">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <button onClick={() => {
            window.location.href = "/";
          }}>
            Continue Shopping
          </button>
        </div>
      )}

      {!loading && !error && orders.map((order) => (
        <article className="order-card" key={order._id}>
          <div className="order-header">
            <div>
              <h3>Order #{order._id.slice(-8)}</h3>
              <p>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "Date unavailable"}
              </p>
            </div>

            <span className="order-status">
              {order.status || "Pending"}
            </span>
          </div>

          <div className="order-items">
            {order.items?.map((item, index) => (
              <div
                className="order-item"
                key={`${order._id}-${item.productId || index}`}
              >
                <span>{item.name} × {item.quantity}</span>
                <span>
                  ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <span>
              Payment: {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : order.paymentMethod}
            </span>
            <strong>
              Total: ₹{Number(order.total).toFixed(2)}
            </strong>
          </div>
        </article>
      ))}
    </div>
  );
}

export default MyOrders;
