import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PACKAGES } from '../data/packages';
import { useBooking } from '../context/BookingContext';
import './ServiceDetail.css';
import './Portfolio.css'; // Import to ensure variables are available

function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToBookingCart } = useBooking();

    const [pkg, setPkg] = useState(null);
    const [selectedTier, setSelectedTier] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);

    useEffect(() => {
        const foundPkg = PACKAGES.find(p => p.id === id);
        if (foundPkg) {
            setPkg(foundPkg);
            // Default to middle tier if available, else first
            if (foundPkg.tiers.length > 1) {
                setSelectedTier(foundPkg.tiers[1]);
            } else {
                setSelectedTier(foundPkg.tiers[0]);
            }
        }
    }, [id]);

    if (!pkg) return <div className="loading-screen">Loading...</div>;

    const handleAddonToggle = (addon) => {
        if (selectedAddons.find(a => a.id === addon.id)) {
            setSelectedAddons(prev => prev.filter(a => a.id !== addon.id));
        } else {
            setSelectedAddons(prev => [...prev, addon]);
        }
    };

    const calculateTotal = () => {
        let total = selectedTier ? selectedTier.price : 0;
        selectedAddons.forEach(addon => total += addon.price);
        return total;
    };

    const handleAddToCart = () => {
        if (!selectedTier) return;

        const item = {
            packageId: pkg.id,
            packageTitle: pkg.title,
            tier: selectedTier,
            addons: selectedAddons,
            totalPrice: calculateTotal()
        };

        addToBookingCart(item);
        navigate('/booking');
    };

    return (
        <div className="service-detail-container">
            {/* Navigation Placeholder or Simplified Nav */}
            {/* We can use the back link absolutely positioned in the hero */}

            {/* Hero Section */}
            <header className="service-hero">
                <div
                    className="service-hero-bg"
                    style={{ backgroundImage: `url(${pkg.image})` }}
                ></div>
                <div className="service-hero-overlay"></div>

                <Link to="/portfolio" className="back-link">
                    ← Back to Portfolio
                </Link>

                <div className="service-hero-content">
                    <h1>{pkg.title}</h1>
                    <p>{pkg.description}</p>
                </div>
            </header>

            <div className="service-content-wrapper">
                {/* Left Column: Details */}
                <div className="service-main">
                    <h2>Select Your Package Tier</h2>
                    <div className="tier-grid">
                        {pkg.tiers.map(tier => (
                            <div
                                key={tier.id}
                                onClick={() => setSelectedTier(tier)}
                                className={`tier-card ${selectedTier?.id === tier.id ? 'selected' : ''}`}
                            >
                                <div className="tier-header">
                                    <h3>{tier.name}</h3>
                                    <span className="tier-price">€{tier.price}</span>
                                </div>
                                <ul className="tier-features">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <h2>Enhance Your Experience</h2>
                    <div className="addon-grid">
                        {pkg.addons.map(addon => {
                            const isSelected = selectedAddons.find(a => a.id === addon.id);
                            return (
                                <div
                                    key={addon.id}
                                    onClick={() => handleAddonToggle(addon)}
                                    className={`addon-card ${isSelected ? 'selected' : ''}`}
                                >
                                    <span className="addon-name">{addon.name}</span>
                                    <span className="addon-price">+€{addon.price}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Summary */}
                <aside className="service-sidebar">
                    <div className="summary-card">
                        <h3>Booking Summary</h3>

                        {selectedTier ? (
                            <div className="summary-content">
                                <div className="summary-item tier">
                                    <span>{selectedTier.name}</span>
                                    <span>€{selectedTier.price}</span>
                                </div>
                                {selectedAddons.map(addon => (
                                    <div key={addon.id} className="summary-item addon">
                                        <span>+ {addon.name}</span>
                                        <span>€{addon.price}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>Select a package tier to begin.</p>
                        )}

                        <div className="summary-total">
                            <span>Total</span>
                            <span>€{calculateTotal()}</span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="primary-btn"
                            style={{ width: '100%', border: 'none' }}
                            disabled={!selectedTier}
                        >
                            Add to Booking
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default ServiceDetail;
