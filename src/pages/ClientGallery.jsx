import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import './ClientGallery.css';

function ClientGallery() {
    const { code } = useParams();
    const navigate = useNavigate();
    const { currentClient, clientLogout, toggleImageSelection } = useGallery();
    const [activeTab, setActiveTab] = useState('all');
    const [selectedCount, setSelectedCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (!currentClient) {
            navigate('/gallery');
        }
    }, [currentClient, navigate]);

    useEffect(() => {
        if (currentClient?.images) {
            const count = currentClient.images.filter(img => img.selected).length;
            setSelectedCount(count);
        }
    }, [currentClient]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!currentClient) return null;

    const handleToggleSelect = async (imageId, currentStatus) => {
        try {
            await toggleImageSelection(currentClient.id, imageId, currentStatus);
        } catch (error) {
            console.error("Selection failed", error);
        }
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed", error);
            window.open(url, '_blank');
        }
    };

    const filteredImages = currentClient.images.filter(img => {
        if (activeTab === 'selected') return img.selected;
        if (activeTab === 'edited') return img.editedUrl;
        return true;
    });

    const coverPhotoUrl = currentClient.coverPhotoUrl || (currentClient.images.length > 0 ? currentClient.images[0].url : null);

    const scrollToGallery = () => {
        const galleryElement = document.getElementById('gallery-content');
        if (galleryElement) {
            galleryElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="client-gallery-container">
            {/* Hero Section */}
            <div className="gallery-hero" style={{ backgroundImage: `url(${coverPhotoUrl})` }}>
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1>{currentClient.clientName}</h1>
                        <p className="hero-date">Wedding Gallery</p>
                        <button onClick={scrollToGallery} className="view-gallery-btn">
                            View Gallery
                        </button>
                    </div>
                    <div className="scroll-indicator" onClick={scrollToGallery}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Sticky Header */}
            <header className={`gallery-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-left">
                    <h2>{currentClient.clientName}</h2>
                </div>

                <nav className="gallery-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Photos
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'selected' ? 'active' : ''}`}
                        onClick={() => setActiveTab('selected')}
                    >
                        Favorites ({selectedCount})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'edited' ? 'active' : ''}`}
                        onClick={() => setActiveTab('edited')}
                    >
                        Edited
                    </button>
                </nav>

                <div className="header-right">
                    <button onClick={() => { clientLogout(); navigate('/gallery'); }} className="logout-btn">
                        Log Out
                    </button>
                </div>
            </header>

            <div id="gallery-content" className="gallery-content">
                <div className="gallery-grid">
                    {filteredImages.length === 0 ? (
                        <div className="empty-state">
                            <p>
                                {activeTab === 'selected' ? "No favorites selected yet." :
                                    activeTab === 'edited' ? "No edited photos available yet." :
                                        "No photos in this gallery."}
                            </p>
                        </div>
                    ) : (
                        filteredImages.map((img) => (
                            <div key={img.id} className="image-item">
                                <img
                                    src={activeTab === 'edited' && img.editedUrl ? img.editedUrl : img.url}
                                    alt={img.name}
                                    loading="lazy"
                                />

                                <div className="image-overlay">
                                    <div className="overlay-actions">
                                        {activeTab !== 'edited' && (
                                            <button
                                                className={`icon-btn ${img.selected ? 'active' : ''}`}
                                                onClick={() => handleToggleSelect(img.id, img.selected)}
                                                title={img.selected ? "Unfavorite" : "Favorite"}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={img.selected ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                            </button>
                                        )}

                                        <button
                                            className="icon-btn"
                                            onClick={() => handleDownload(
                                                activeTab === 'edited' && img.editedUrl ? img.editedUrl : img.url,
                                                img.name
                                            )}
                                            title="Download"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="7 10 12 15 17 10"></polyline>
                                                <line x1="12" y1="15" x2="12" y2="3"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {img.editedUrl && activeTab !== 'edited' && (
                                    <div className="edited-badge">Edited</div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClientGallery;
