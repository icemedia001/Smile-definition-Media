import { useStore } from '../context/StoreContext';
import './Cart.css';

function Cart() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useStore();

    if (!isCartOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
            <div className="cart-drawer">
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-btn" onClick={() => setIsCartOpen(false)}>×</button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <p className="empty-cart">Your cart is empty.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="item-info">
                                    <h4>{item.name}</h4>
                                    <p>€{item.price.toFixed(2)}</p>
                                </div>
                                <div className="item-controls">
                                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="total">
                        <span>Total:</span>
                        <span>€{cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => alert('Checkout functionality coming soon!')}>
                        CHECKOUT
                    </button>
                </div>
            </div>
        </>
    );
}

export default Cart;
