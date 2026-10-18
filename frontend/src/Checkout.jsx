
import { useState } from "react";
import "./Checkout.css";

function Checkout() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const cart = (() => {
    try {
      return JSON.parse(localStorage.getItem("gofmart_cart")) || [];
    } catch {
      return [];
    }
  })();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  
async function placeOrder(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const token = localStorage.getItem("gofmart_token");

  if (!token) {
    alert("Please login before placing an order.");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customer: { name, phone, address, city, pincode },
        items: cart,
        paymentMethod: "COD",
      }),
    });

    const text = await response.text();
console.log("Order API status:", response.status);
console.log("Order API response:", text);

let data;

try {
  data = JSON.parse(text);
} catch {
  throw new Error(
    `Server ne JSON ke badle HTML bheja. Status: ${response.status}. Browser Console check karo.`
  );
}

    if (!response.ok) {
      throw new Error(data.message || "Order place nahi hua.");
    }

    localStorage.setItem("gofmart_last_order", JSON.stringify(data.order));
    localStorage.setItem("gofmart_cart", JSON.stringify([]));

    alert("Order successfully placed! Order ID: " + data.order._id);
    window.location.href = "/";
  } catch (error) {
    alert(error.message || "Backend connection error!");
  }
}

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <form onSubmit={placeOrder} className="checkout-form">
        <h2>Delivery Address</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          pattern="[0-9]{10}"
          title="Enter a 10-digit phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <textarea
          placeholder="Full Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <input
          placeholder="6-digit PIN Code"
          pattern="[0-9]{6}"
          title="Enter a 6-digit PIN code"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          required
        />

        <h2>Order Total: ₹{total.toFixed(2)}</h2>
        <p>Payment Method: Cash on Delivery (COD)</p>

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;
