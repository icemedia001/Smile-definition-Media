import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

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
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Welcome, {currentUser.displayName}</h1>
                    <p className="dashboard-subtitle">Manage your bookings and account details.</p>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    Log Out
                </button>
            </div>

            <h2 className="section-title">Your Bookings</h2>

            {loadingBookings ? (
                <p>Loading bookings...</p>
            ) : userBookings.length === 0 ? (
                <div className="empty-state">
                    <p className="empty-text">You haven't made any bookings yet.</p>
                    <button
                        onClick={() => {
                            navigate('/portfolio#packages');
                            // Small timeout to allow navigation to happen before scroll check if it was same page (rare here)
                            // But since it's a diff page, the Portfolio useEffect will catch it.
                        }}
                        className="browse-btn"
                    >
                        Browse Services
                    </button>
                </div>
            ) : (
                <div className="bookings-grid">
                    {userBookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <div>
                                    <span className={`booking-status ${booking.status === 'confirmed' ? 'status-confirmed' : 'status-pending'}`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                    <div className="booking-date">
                                        Booked on {new Date(booking.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="booking-amount">€{booking.totalAmount}</div>
                                </div>
                            </div>

                            <div>
                                {booking.items.map((item, idx) => (
                                    <div key={idx} className="booking-item">
                                        <h4 className="item-title">{item.packageTitle} - {item.tier.name}</h4>
                                        {item.addons.length > 0 && (
                                            <p className="item-addons">
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
