import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './Store.css';

function Store() {
    const { products, addToCart, setIsCartOpen, cartCount } = useStore();

    return (
        <div className="store-container">
            {/* Navigation */}
            <nav className="store-nav">
                <Link to="/" className="nav-logo">
                    <img src="/assets/logo.png" alt="Smiledefinition Media" />
                    <span>Smiledefinition Media</span>
                </Link>
                <div className="nav-links">
                    <a href="#">New Arrivals</a>
                    <a href="#">Clothing</a>
                    <a href="#">Shoes</a>
                    <a href="#">Accessories</a>
                    <Link to="/" className="back-link">Back to Home</Link>
                </div>
                <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
                    CART ({cartCount})
                </div>
            </nav>

            {/* Hero */}
            <header className="store-hero">
                <div className="store-hero-content">
                    <h1>Elevate Your Style</h1>
                    <p>Exclusive Streetwear Collection</p>
                    <a href="#shop" className="shop-btn">Shop Now</a>
                </div>
            </header>

            {/* Categories */}
            <section className="categories-section">
                <div className="category-card" style={{ backgroundImage: "url('/assets/cat-clothing.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <h3>Clothing</h3>
                </div>
                <div className="category-card" style={{ backgroundImage: "url('/assets/cat-shoes.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <h3>Shoes</h3>
                </div>
                <div className="category-card" style={{ backgroundImage: "url('/assets/cat-accessories.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <h3>Accessories</h3>
                </div>
            </section>

            {/* Featured Products */}
            <section id="shop" className="products-section">
                <h2>Featured Drops</h2>
                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image">
                                {product.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            </div>
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <p>€{product.price.toFixed(2)}</p>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => addToCart(product)}
                                    style={{
                                        marginTop: '10px',
                                        padding: '0.5rem 1rem',
                                        background: '#fff',
                                        color: '#000',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="newsletter-section">
                <h2>Join the Community</h2>
                <p>Get early access to drops and exclusive offers.</p>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email" />
                    <button type="submit">SUBSCRIBE</button>
                </form>
            </section>

            {/* Footer */}
            <footer className="store-footer">
                <p>© 2024 Smiledefinition Media. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#">Shipping</a>
                    <a href="#">Returns</a>
                    <a href="#">Terms</a>
                    <a href="#">Privacy</a>
                </div>
            </footer>
        </div>
    );
}

export default Store;
