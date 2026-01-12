import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const { currentUser, logout } = useAuth();
    const { userBookings, loadingBookings } = useBooking();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="dashboard-page" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Welcome, {currentUser.displayName}</h1>
                    <p style={{ color: '#666' }}>Manage your bookings and account details.</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ddd',
                        background: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Log Out
                </button>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>Your Bookings</h2>

            {loadingBookings ? (
                <p>Loading bookings...</p>
            ) : userBookings.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>You haven't made any bookings yet.</p>
                    <button
                        onClick={() => navigate('/portfolio')}
                        style={{
                            padding: '0.8rem 1.5rem',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Browse Services
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {userBookings.map(booking => (
                        <div key={booking.id} style={{
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            backgroundColor: '#fff'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f5f5f5' }}>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        backgroundColor: booking.status === 'confirmed' ? '#e8f5e9' : '#fff3e0',
                                        color: booking.status === 'confirmed' ? '#2e7d32' : '#ef6c00',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                    <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                        Booked on {new Date(booking.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>€{booking.totalAmount}</div>
                                </div>
                            </div>

                            <div>
                                {booking.items.map((item, idx) => (
                                    <div key={idx} style={{ marginBottom: '1rem' }}>
                                        <h4 style={{ margin: '0 0 0.3rem 0' }}>{item.packageTitle} - {item.tier.name}</h4>
                                        {item.addons.length > 0 && (
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                                                Add-ons: {item.addons.map(a => a.name).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserDashboard;
