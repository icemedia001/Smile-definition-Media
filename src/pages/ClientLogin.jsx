import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import './Portfolio.css'; // Ensure variables are available

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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Image with Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url("/Studio Pictures/054A9422.jpg")', // Use a nice background
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4
            }}></div>

            <div style={{
                position: 'relative',
                zIndex: 2,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '3rem',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '450px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem',
                        color: '#1a1a1a'
                    }}>Client Access</h1>
                    <p style={{ color: '#666' }}>Enter your credentials to view your gallery</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#c5a059'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#c5a059'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#d32f2f',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            padding: '0.5rem',
                            background: 'rgba(211, 47, 47, 0.1)',
                            borderRadius: '4px'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: '#c5a059',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            letterSpacing: '1px',
                            marginTop: '1rem',
                            transition: 'background 0.3s'
                        }}
                        onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#a38343')}
                        onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#c5a059')}
                    >
                        {isLoading ? 'ACCESSING...' : 'ENTER GALLERY'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ClientLogin;
