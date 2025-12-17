import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import './Admin.css';

function Admin() {
    const { addProduct, products } = useStore();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'Clothing',
        image: ''
    });

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple client-side check. In a real app, this should be backend validated.
        if (password === 'smile123') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <form onSubmit={handleLogin} className="admin-form" style={{ maxWidth: '400px', width: '100%' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Access</h2>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                        />
                    </div>
                    <button type="submit" className="add-btn">Login</button>
                    <Link to="/store" className="back-link" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>← Back to Store</Link>
                </form>
            </div>
        );
    }

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        addProduct({
            ...newProduct,
            price: parseFloat(newProduct.price)
        });

        setNewProduct({
            name: '',
            price: '',
            category: 'Clothing',
            image: ''
        });

        alert('Product added successfully!');
    };

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <Link to="/store" className="back-link">← Back to Store</Link>
                <h1>Store Admin</h1>
            </nav>

            <div className="admin-content">
                <div className="add-product-section">
                    <h2>Add New Product</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Price (€)</label>
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={newProduct.category} onChange={handleChange}>
                                <option value="Clothing">Clothing</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {newProduct.image && (
                                <div className="image-preview">
                                    <img src={newProduct.image} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <button type="submit" className="add-btn">Add Product</button>
                    </form>
                </div>

                <div className="product-list-section">
                    <h2>Current Products</h2>
                    <div className="admin-product-list">
                        {products.map(product => (
                            <div key={product.id} className="admin-product-item">
                                <div className="admin-product-info">
                                    <span className="name">{product.name}</span>
                                    <span className="price">€{product.price.toFixed(2)}</span>
                                    <span className="category">{product.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
