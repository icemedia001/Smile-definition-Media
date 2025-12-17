import { createContext, useState, useContext, useEffect } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [products, setProducts] = useState([
        { id: 1, name: 'Essential Hoodie', price: 85.00, category: 'Clothing', image: '/assets/prod-hoodie.png' },
        { id: 2, name: 'Street Runner V1', price: 120.00, category: 'Shoes', image: '/assets/prod-shoes.png' },
        { id: 3, name: 'Logo Cap', price: 35.00, category: 'Accessories', image: '/assets/prod-cap.png' },
        { id: 4, name: 'Oversized Tee', price: 45.00, category: 'Clothing', image: '/assets/prod-tee.png' },
    ]);

    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === productId) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const addProduct = (newProduct) => {
        setProducts(prev => [...prev, { ...newProduct, id: Date.now() }]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <StoreContext.Provider value={{
            products,
            cart,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            addProduct,
            cartTotal,
            cartCount
        }}>
            {children}
        </StoreContext.Provider>
    );
};
