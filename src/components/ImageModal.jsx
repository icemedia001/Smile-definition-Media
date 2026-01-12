import React, { useEffect } from 'react';
import './ImageModal.css';

const ImageModal = ({ isOpen, onClose, imageUrl, altText }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                <button className="image-modal-close" onClick={onClose}>×</button>
                <img src={imageUrl} alt={altText || 'Full size preview'} className="image-modal-img" />
            </div>
        </div>
    );
};

export default ImageModal;
