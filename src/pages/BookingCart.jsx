import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

function BookingCart() {
    const { cart, removeFromBookingCart, createBooking } = useBooking();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [guestDetails, setGuestDetails] = useState({
        name: '',
        email: '',
        phone: '',
        date: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        // Validate guest details if not logged in
        if (!currentUser && (!guestDetails.name || !guestDetails.email || !guestDetails.date)) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            await createBooking({
                totalAmount: calculateTotal(),
                bookingDate: guestDetails.date || new Date().toISOString()
            }, !currentUser ? guestDetails : null);

            alert('Booking request sent successfully! We will contact you shortly.');
            // Redirect to a success page or home, since dashboard might not be accessible for guests
            navigate(currentUser ? '/dashboard' : '/');
        } catch (error) {
            console.error(error);
            alert('Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>Your Booking Cart is Empty</h1>
                <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Looks like you haven't selected any packages yet.</p>
                <button
                    onClick={() => navigate('/portfolio')}
                    style={{
                        padding: '1rem 2rem',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        letterSpacing: '1px'
                    }}
                >
                    BROWSE SERVICES
                </button>
            </div>
        );
    }

    return (
        <div className="booking-cart-page" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', fontFamily: 'Playfair Display, serif', textAlign: 'center' }}>Complete Your Booking</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem' }}>

                {/* Left Column: Form */}
                <div>
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Contact Details</h2>
                        {currentUser ? (
                            <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
                                <p>Logged in as <strong>{currentUser.displayName || currentUser.email}</strong></p>
                            </div>
                        ) : (
                            <form id="booking-form" onSubmit={handleCheckout} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={guestDetails.name}
                                        onChange={e => setGuestDetails({ ...guestDetails, name: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={guestDetails.email}
                                            onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })}
                                            style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={guestDetails.phone}
                                            onChange={e => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                                            style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Event Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={guestDetails.date}
                                        onChange={e => setGuestDetails({ ...guestDetails, date: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Cart Items List (Moved to left column under form or keep separate? Let's keep items on left, form on left too?) 
                        Actually, let's put items on the left, and the form IS the main action. 
                    */}
                    <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Selected Packages</h2>
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.cartId} style={{
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem',
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'Playfair Display, serif' }}>{item.packageTitle}</h3>
                                        <p style={{ color: '#c5a059', margin: 0, fontWeight: '600' }}>{item.tier.name}</p>
                                    </div>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>€{item.totalPrice}</span>
                                </div>

                                {item.addons.length > 0 && (
                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f5f5f5' }}>
                                        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem' }}>Add-ons:</p>
                                        {item.addons.map(addon => (
                                            <div key={addon.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                                                <span>{addon.name}</span>
                                                <span>+€{addon.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => removeFromBookingCart(item.cartId)}
                                    style={{
                                        marginTop: '1rem',
                                        background: 'none',
                                        border: 'none',
                                        color: '#999',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        padding: 0,
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="cart-summary">
                    <div style={{
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        padding: '2rem',
                        backgroundColor: '#fff',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <h3 style={{ marginTop: 0, fontFamily: 'Playfair Display, serif' }}>Booking Summary</h3>

                        <div style={{ margin: '2rem 0', padding: '1.5rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#666' }}>
                                <span>Subtotal</span>
                                <span>€{calculateTotal()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem', color: '#000' }}>
                                <span>Total</span>
                                <span>€{calculateTotal()}</span>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
                            * By clicking "Confirm Booking", you agree to our terms of service. We will review your request and contact you to finalize the details.
                        </p>

                        <button
                            onClick={currentUser ? handleCheckout : undefined} // If logged in, click triggers. If guest, form submit triggers.
                            form={currentUser ? undefined : "booking-form"} // Link to form if guest
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                backgroundColor: '#c5a059',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                letterSpacing: '1px',
                                transition: 'background 0.3s'
                            }}
                        >
                            {isSubmitting ? 'Processing...' : 'CONFIRM BOOKING'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingCart;
