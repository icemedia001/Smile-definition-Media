import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Landing() {
    const [hoveredSide, setHoveredSide] = useState(null);

    return (
        <div className={`container ${hoveredSide ? `hover-${hoveredSide}` : ''}`}>
            <div className="logo-container">
                <img src="/assets/logo.png" alt="Smiledefinition Media" className="logo" />
            </div>

            <div
                className="split left"
                onMouseEnter={() => setHoveredSide('left')}
                onMouseLeave={() => setHoveredSide(null)}
            >
                <div className="content">
                    <span className="subtitle">STREETWEAR & MERCH</span>
                    <h1 className="title">STORE</h1>
                    <p className="description">Shop exclusive streetwear, shoes, and limited edition merch.</p>
                    <Link to="/store" className="btn">ENTER STORE <span className="arrow">→</span></Link>
                </div>
                <div className="overlay"></div>
            </div>

            <div
                className="split right"
                onMouseEnter={() => setHoveredSide('right')}
                onMouseLeave={() => setHoveredSide(null)}
            >
                <div className="content">
                    <span className="subtitle">FILMS & STORIES</span>
                    <h1 className="title">PORTFOLIO</h1>
                    <p className="description">Building films, highlights & full cinematic love stories.</p>
                    <Link to="/portfolio" className="btn">VIEW PORTFOLIO <span className="arrow">→</span></Link>
                </div>
                <div className="overlay"></div>
            </div>

            <footer className="footer">
                <p>© 2026 Smiledefinition Media. Luxury Videography.</p>
            </footer>
        </div>
    );
}

export default Landing;
