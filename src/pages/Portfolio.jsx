import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Portfolio.css';

function Portfolio() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: 'Wedding'
    });

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

        // Optional: Reset form or show success message
        alert('Opening your email client to send the inquiry...');
    };

    return (
        <div className="portfolio-container">
            {/* Navigation */}
            <nav className="portfolio-nav">
                <div className="nav-logo">
                    <img src="/assets/logo.png" alt="SmiledefinitionMedia" />
                    <span>Smiledefinition Media</span>
                </div>
                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#packages">Packages</a>
                    <a href="#contact">Contact</a>
                    <Link to="/" className="back-link">Back to Landing</Link>
                </div>
            </nav>

            {/* Hero / Highlights */}
            <section id="home" className="hero-section">
                <div className="hero-content">
                    <h1>Capturing Love Stories</h1>
                    <p>Cinematic Wedding Films & Photography</p>
                    <a href="#contact" className="cta-btn">Book Your Date</a>
                </div>
            </section>

            {/* About Me */}
            <section id="about" className="about-section">
                <div className="about-container">
                    <div className="about-image">
                        <img src="/assets/smile-portrait.png" alt="Olufunsho (Smile)" />
                    </div>
                    <div className="about-text">
                        <h2>About Me</h2>
                        <p>
                            Hi my Name is Olufunsho known as me as Smile. I began filming weddings in 2015, and ever since, I’ve been dedicated to capturing beautiful love stories with creativity and care. I’m based in Waterford, where I studied photography at Waterford College before expanding my skills into professional wedding videography.
                        </p>
                        <p>
                            My work is guided by my artistic passion as well as my religious values, which permit me to film weddings between a man and a woman. Alongside wedding films, I also provide professional studio photography, delivering high-quality images that preserve life’s most meaningful moments.
                        </p>
                    </div>
                </div>
            </section>

            {/* Packages */}
            <section id="packages" className="packages-section">
                <h2>Packages & Add Ons</h2>
                <div className="packages-grid">
                    <div className="package-card">
                        <h3>Wedding Film</h3>
                        <p>Full cinematic coverage of your special day.</p>
                        <button onClick={() => handleInquire('Wedding Film')}>Inquire</button>
                    </div>
                    <div className="package-card">
                        <h3>Photography</h3>
                        <p>Professional studio and event photography.</p>
                        <button onClick={() => handleInquire('Photography')}>Inquire</button>
                    </div>
                    <div className="package-card">
                        <h3>Combo</h3>
                        <p>The complete package: Film & Photo.</p>
                        <button onClick={() => handleInquire('Combo Package')}>Inquire</button>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <h2>Testimonials</h2>
                <div className="testimonial">
                    <p>"Smile captured our day perfectly. The video brings tears to our eyes every time we watch it."</p>
                    <span>- Sarah & John</span>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="contact-section">
                <h2>Get In Touch</h2>
                <div className="contact-info">
                    <p>Contact: +353899882998</p>
                    <p>Email: smiledefinitionpro@gmail.com</p>
                </div>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" required onChange={handleChange} value={formData.firstName} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" required onChange={handleChange} value={formData.lastName} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required onChange={handleChange} value={formData.email} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" onChange={handleChange} value={formData.phone} />
                    </div>
                    <div className="form-group">
                        <label>Event Date</label>
                        <input type="date" name="eventDate" required onChange={handleChange} value={formData.eventDate} />
                    </div>
                    <div className="form-group">
                        <label>Event Type</label>
                        <select name="eventType" onChange={handleChange} value={formData.eventType}>
                            <option value="Wedding">Wedding</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Studio">Studio Session</option>
                            <option value="Wedding Film">Wedding Film</option>
                            <option value="Photography">Photography</option>
                            <option value="Combo Package">Combo Package</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </section>

            <footer className="portfolio-footer">
                <p>© 2026 Smiledefinition Media. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Portfolio;
