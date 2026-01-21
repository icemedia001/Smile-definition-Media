import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import './BookingCart.css';

function BookingCart() {
    const { cart, removeFromBookingCart, createBooking } = useBooking();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [bookingDetails, setBookingDetails] = useState({
        phone: '',
        date: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Calculate minimum date (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const validateForm = () => {
        const newErrors = {};

        // Phone validation: only numbers, at least 8 digits
        const phoneRegex = /^[0-9]+$/;
        if (!bookingDetails.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(bookingDetails.phone)) {
            newErrors.phone = "Phone number must contain only numbers";
        } else if (bookingDetails.phone.length < 8) {
            newErrors.phone = "Please enter a valid phone number";
        }

        // Date validation: must be future date
        if (!bookingDetails.date) {
            newErrors.date = "Event date is required";
        } else {
            const selectedDate = new Date(bookingDetails.date);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()); // Compare against end of today practically

            if (selectedDate <= tomorrow) {
                newErrors.date = "Bookings must be for future dates (starting tomorrow)";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        if (!currentUser) {
            navigate('/login?redirect=/booking');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await createBooking({
                totalAmount: calculateTotal(),
                eventDate: bookingDetails.date,
                userPhone: bookingDetails.phone
            });

            alert('Booking request sent successfully! We will contact you shortly.');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="empty-cart-container">
                <h1 className="empty-title">Your Booking Cart is Empty</h1>
                <p className="empty-desc">Looks like you haven't selected any packages yet.</p>
                <button
                    onClick={() => navigate('/portfolio#packages')}
                    className="hero-btn"
                >
                    BROWSE SERVICES
                </button>
            </div>
        );
    }

    return (
        <div className="booking-cart-container">
            <h1 className="cart-title">Complete Your Booking</h1>

            <div className="cart-grid">

                {/* Left Column: Form & Items */}
                <div>
                    {!currentUser ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            marginBottom: '3rem',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>Login Required</h2>
                            <p style={{ color: '#aaa', marginBottom: '2rem' }}>You must be logged in to complete a booking.</p>
                            <button
                                onClick={() => navigate('/login?redirect=/booking')}
                                className="hero-btn"
                            >
                                Login or Sign Up
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 className="section-heading">Event Details</h2>
                            <div className="user-badge" style={{ marginBottom: '1.5rem' }}>
                                <p>Booking as <strong>{currentUser.displayName || currentUser.email}</strong></p>
                            </div>

                            <form id="booking-form" onSubmit={handleCheckout} className="contact-form">
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        className={`form-control ${errors.phone ? 'error' : ''}`}
                                        type="tel"
                                        required
                                        placeholder="Numbers only (e.g., 08012345678)"
                                        value={bookingDetails.phone}
                                        onChange={e => {
                                            const val = e.target.value;
                                            // Allow only numbers
                                            if (val === '' || /^[0-9]+$/.test(val)) {
                                                setBookingDetails({ ...bookingDetails, phone: val });
                                                // Clear error if valid
                                                if (errors.phone) setErrors({ ...errors, phone: null });
                                            }
                                        }}
                                    />
                                    {errors.phone && <span className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.3rem', display: 'block' }}>{errors.phone}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Event Date *</label>
                                    <input
                                        className={`form-control ${errors.date ? 'error' : ''}`}
                                        type="date"
                                        required
                                        min={getMinDate()}
                                        value={bookingDetails.date}
                                        onChange={e => {
                                            setBookingDetails({ ...bookingDetails, date: e.target.value });
                                            if (errors.date) setErrors({ ...errors, date: null });
                                        }}
                                    />
                                    {errors.date && <span className="error-text" style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.3rem', display: 'block' }}>{errors.date}</span>}
                                </div>
                            </form>
                        </div>
                    )}

                    <h2 className="section-heading">Selected Packages</h2>
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.cartId} className="cart-item">
                                <div className="item-header">
                                    <div>
                                        <h3 className="item-title">{item.packageTitle}</h3>
                                        <p className="item-tier">{item.tier.name}</p>
                                    </div>
                                    <span className="item-price">€{item.totalPrice}</span>
                                </div>

                                {item.addons.length > 0 && (
                                    <div className="item-addons">
                                        <p className="addons-label">Add-ons:</p>
                                        {item.addons.map(addon => (
                                            <div key={addon.id} className="addon-row">
                                                <span>{addon.name}</span>
                                                <span>+€{addon.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => removeFromBookingCart(item.cartId)}
                                    className="remove-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="cart-summary">
                    <div className="summary-box">
                        <h3 className="summary-title">Booking Summary</h3>

                        <div className="summary-details">
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>€{calculateTotal()}</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>€{calculateTotal()}</span>
                            </div>
                        </div>

                        <p className="terms-text">
                            * By clicking "Confirm Booking", you agree to our terms of service. We will review your request and contact you to finalize the details.
                        </p>

                        <button
                            onClick={currentUser ? handleCheckout : () => navigate('/login?redirect=/booking')}
                            form={currentUser ? "booking-form" : undefined}
                            type="submit"
                            disabled={isSubmitting} // Always enabled if not logged in so they can click to login
                            className="confirm-btn"
                        >
                            {isSubmitting ? 'Processing...' : (currentUser ? 'CONFIRM BOOKING' : 'LOGIN TO BOOK')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingCart;
