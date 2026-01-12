import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Portfolio.css';

import { PACKAGES } from '../data/packages';
import ServiceCard from '../components/ServiceCard';

function Portfolio() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: 'Wedding'
    });

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInquire = (pkg) => {
        setFormData({ ...formData, eventType: pkg });
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const subject = `New Inquiry: ${formData.eventType} - ${formData.eventDate}`;
        const body = `Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Event Date: ${formData.eventDate}
Event Type: ${formData.eventType}

Sent from Smiledefinition Media Portfolio`;

        const mailtoLink = `mailto:smiledefinitionpro@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    const videos = [
        { title: "Annabel & Genesis", src: "/videos/Annabel&Genesis HL.mp4", rotate: -90, scale: 1.78 },
        { title: "Chidinma & Onyeka", src: "/videos/Chidinma & Onyeka Hightlights.mp4" },
        { title: "Aisha & Najeem", src: "/videos/Aisha&Najeem Highlights1.mp4" },
        { title: "B & L", src: "/videos/B&L Highlights.mp4" },
        { title: "I & D", src: "/videos/I&D Highlights.mp4", rotate: -90, scale: 1.78 },
        { title: "Ronald Traditional", src: "/videos/Ronald Traditional Wedding Thriller.mp4", rotate: -90, scale: 1.78 }
    ];

    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };



    const aboutImages = [
        "/3L7A1025.jpeg",
        "/3L7A0991.jpeg",
        "/3L7A0984.jpeg"
    ];

    const [currentAboutImageIndex, setCurrentAboutImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAboutImageIndex((prevIndex) => (prevIndex + 1) % aboutImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`portfolio-container ${darkMode ? 'dark-mode' : ''}`}>
            {/* Navigation */}
            <nav className={`portfolio-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-logo">
                    <img src="/assets/logo.png" alt="SmiledefinitionMedia" />
                    <span>Smiledefinition Media</span>
                </div>
                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#portfolio">Portfolio</a>
                    <a href="#packages">Packages</a>
                    <a href="#about">About</a>
                    <a href="#contact" className="contact-link">Contact</a>
                    <Link to="/gallery" className="client-link">Client Access</Link>
                    <button onClick={toggleDarkMode} className="theme-toggle" style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent' }}>
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="hero-section">
                <div
                    className="hero-bg-slide active"
                    style={{ backgroundImage: `url('/Studio Pictures/054A9422.jpg')` }}
                ></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    {/* <span className="hero-subtitle">Cinematic Wedding Films & Photography</span> */}
                    <h1>Capturing Your<br />Love Story</h1>
                    <p>Timeless moments, elegantly preserved for generations.</p>
                    <div className="hero-buttons">
                        <a href="#contact" className="primary-btn">Book Your Date</a>
                        <a href="#portfolio" className="secondary-btn">View Our Work</a>
                    </div>
                </div>
            </section>

            {/* Video Showcase */}
            <section id="portfolio" className="video-section">
                <div className="section-header">
                    <span className="section-tag">Our Work</span>
                    <h2>Cinematic Highlights</h2>
                    <p>Relive the emotion, the laughter, and the love.</p>
                </div>
                <div className="video-grid">
                    {videos.map((video, index) => (
                        <div key={index} className="video-card">
                            <div className="video-wrapper">
                                <video
                                    muted
                                    loop
                                    playsInline
                                    style={{
                                        transform: `${video.rotate ? `rotate(${video.rotate}deg)` : ''} ${video.scale ? `scale(${video.scale})` : ''}`.trim()
                                    }}
                                    onMouseOver={(e) => e.target.play()}
                                    onMouseOut={(e) => {
                                        e.target.pause();
                                        e.target.currentTime = 0;
                                    }}
                                >
                                    <source src={`${video.src}#t=0.5`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <h3>{video.title}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Packages */}
            <section id="packages" className="packages-section">
                <div className="section-header">
                    <span className="section-tag">Packages</span>
                    <h2>2026 Packages</h2>
                    <p>Choose the perfect collection for your special day.</p>
                </div>
                <div className="packages-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    padding: '0 2rem'
                }}>
                    {PACKAGES.map(pkg => (
                        <ServiceCard key={pkg.id} packageData={pkg} />
                    ))}
                </div>
            </section>

            {/* About Me */}
            <section id="about" className="about-section">
                <div className="about-container">
                    <div className="about-image">
                        {aboutImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Olufunsho (Smile) ${index + 1}`}
                                className={`about-slide ${index === currentAboutImageIndex ? 'active' : ''}`}
                            />
                        ))}
                        <div className="image-frame"></div>
                    </div>
                    <div className="about-text">
                        <span className="section-tag">The Artist</span>
                        <h2>Meet Smile</h2>
                        <p className="lead-text">
                            "I believe every love story deserves to be told with authenticity and grace."
                        </p>
                        <p>
                            Hi, I'm Olufunsho, better known as Smile. Based in Waterford, I've been capturing weddings since 2015. My journey began at Waterford College where I studied photography, before expanding into cinematic videography.
                        </p>
                        <p>
                            My work is grounded in my artistic passion and personal values. I strive to create a relaxed atmosphere where you can be yourselves, allowing me to capture the genuine, unscripted moments that make your day unique.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="contact-section">
                <div className="contact-container">
                    <div className="contact-info">
                        <h2>Let's Create Magic</h2>
                        <p>We'd love to hear about your plans. Fill out the form or reach out directly.</p>
                        <div className="contact-details">
                            <div className="contact-item">
                                <span className="icon">📞</span>
                                <div>
                                    <label>Phone</label>
                                    <a href="tel:+353899882998">+353 89 988 2998</a>
                                </div>
                            </div>
                            <div className="contact-item">
                                <span className="icon">✉️</span>
                                <div>
                                    <label>Email</label>
                                    <a href="mailto:smiledefinitionpro@gmail.com">smiledefinitionpro@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" name="firstName" required onChange={handleChange} value={formData.firstName} />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" name="lastName" required onChange={handleChange} value={formData.lastName} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required onChange={handleChange} value={formData.email} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" name="phone" onChange={handleChange} value={formData.phone} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Event Date</label>
                                <input type="date" name="eventDate" required onChange={handleChange} value={formData.eventDate} />
                            </div>
                            <div className="form-group">
                                <label>Event Type</label>
                                <select name="eventType" onChange={handleChange} value={formData.eventType}>
                                    <option value="Wedding">Wedding</option>
                                    <option value="Wedding Film">Wedding Film</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Combo Package">Combo Package</option>
                                    <option value="Studio">Studio Session</option>
                                    <option value="Birthday">Birthday</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </section>

            <footer className="portfolio-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <h3>Smiledefinition Media</h3>
                        <p>Capturing moments, creating memories.</p>
                    </div>
                    <div className="footer-links">
                        <a href="#home">Home</a>
                        <a href="#portfolio">Portfolio</a>
                        <a href="#packages">Packages</a>
                        <Link to="/gallery">Client Access</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Smiledefinition Media. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Portfolio;
