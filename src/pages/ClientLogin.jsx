import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import './ClientLogin.css';

function ClientLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { clientLogin } = useGallery();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const client = await clientLogin(email, password);
            if (client) {
                navigate(`/gallery/${client.id}`);
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            console.error(err);
            setError('Unable to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="client-login-container">
            <div className="login-overlay"></div>
            <div className="login-card">
                <h1>Client Access</h1>
                <p>Please log in to view your gallery</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="login-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="login-input"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Enter Gallery'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ClientLogin;
