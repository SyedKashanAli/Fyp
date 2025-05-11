import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

    const fetchUserCart = async (userId) => {
      if (!userId) {
        setCart([]);
        return;
      }

        try {
          const response = await fetch(`/api/Customer/cart?userId=${userId}`);
          if (response.ok) {
            const { cart } = await response.json();
            setCart(cart || []); // Set the cart for the logged-in user
            localStorage.setItem("cart", JSON.stringify(cart || []));

          } else {
            console.error("Failed to fetch cart for user:", userId);
            setCart([]); // Reset cart on error
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          setCart([]); // Reset cart on error
        }
    };

  const syncCartToServer = async (userId, cart) => {
    if(!userId) return;

    try {
      // Ensure the cart contains bakeryId for all items
      const enrichedCart = cart.map((item) => {
        if (!item.bakeryId) {
          console.warn(`Missing bakeryId for item: ${item.itemId}`);
        }
        return item;
      });

      const response = await fetch("/api/Customer/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, cart: enrichedCart }), // Send enriched cart with bakeryId
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server responded with an error:", errorResponse.message);
        throw new Error("Failed to sync cart to server");
      }

      const data = await response.json();
      console.log("Cart synced to server successfully:", data);
      return data; // Return the server response if needed
    } catch (error) {
      console.error("Error syncing cart to server:", error.message);
      throw error; // Rethrow error to handle it further up the call stack
    }
  };

  const isStockAvailable = (itemId, remainingitem) => {
    const existingItem = cart.find((cartItem) => cartItem.itemId === itemId);
    if (existingItem && existingItem.quantity >= remainingitem) {
      return false; // No stock available
    }
    return true; // Stock available
  };

  const addToCart = async (itemId, title, price, remainingitem, bakeryId) => {
    // Validate stock before adding
    if (!isStockAvailable(itemId, remainingitem)) {
      alert("Cannot add more than the available stock");
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.itemId === itemId);

      const updatedCart = existingItem
       ? cart.map((cartItem) =>
        cartItem.itemId === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    : [...cart, { itemId, title, price, quantity: 1, bakeryId }];

      setCart(updatedCart);
        const userId = localStorage.getItem("userId");
    await syncCartToServer(userId, updatedCart);
    };

  //   } else {
  //     const newItem = { itemId, title, price, quantity: 1, bakeryId };
  //     const updatedCart = [...cart, newItem];
  //     setCart(updatedCart);
  //     await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  //   }
  // };

  const incrementItemQuantity = async (itemId, remainingitem) => {
    // Validate stock before incrementing
    if (!isStockAvailable(itemId, remainingitem)) {
      alert("Cannot add more than the available stock");
      return;
    }

    const updatedCart = cart.map((item) =>
      item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  };

  const decrementItemQuantity = async (itemId) => {
    const updatedCart = cart
      .map((item) =>
        item.itemId === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0); // Remove item if quantity becomes 0
    setCart(updatedCart);
    await syncCartToServer(localStorage.getItem("userId"), updatedCart);
  };

  const removeFromCart = async (itemId) => {
     const updatedCart = cart.filter((item) => item.itemId !== itemId);
    setCart(updatedCart);
    const userId = localStorage.getItem("userId");
    await syncCartToServer(userId, updatedCart);
  };

  const clearCart = async () => {
    setCart([]);
    const userId = localStorage.getItem("userId");
    await syncCartToServer(userId, []);
  };

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);

  const handleUserChange = () => {
    const userId = localStorage.getItem("userId");
    fetchUserCart(userId);
  };

  useEffect(() => {
    handleUserChange();
  }, []);


  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        incrementItemQuantity,
        decrementItemQuantity,
        removeFromCart,
        clearCart,
        fetchUserCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// Add this at the end of the file to satisfy Next.js page requirements
export default function CartContextPage() {
  return null;
}
