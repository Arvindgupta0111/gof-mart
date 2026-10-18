
import { useState } from "react";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gofmart_cart")) || [];
    } catch {
      return [];
    }
  });

  function updateCart(updatedCart) {
    setCart(updatedCart);
    localStorage.setItem("gofmart_cart", JSON.stringify(updatedCart));
  }

  function changeQuantity(id, amount) {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + amount }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  }

  function removeItem(id) {
    updateCart(cart.filter((item) => item._id !== id));
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h1>My Shopping Cart 🛒</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty. Please add some products!</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              <div>
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>Subtotal: ₹{Number(item.price) * item.quantity}</p>
              </div>

              <div className="cart-actions">
                <button onClick={() => changeQuantity(item._id, -1)}>
                  -
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => changeQuantity(item._id, 1)}>
                  +
                </button>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2>Total Amount: ₹{total.toFixed(2)}</h2>
          
<button
  className="back-btn"
  onClick={() => {
    window.location.href = "/checkout";
  }}
>
  Proceed to Checkout
</button>

        </>
      )}

      <button className="back-btn" onClick={() => {
        window.location.href = "/";
      }}>
        Continue Shopping
      </button>
    </div>
  );
}

export default Cart;
