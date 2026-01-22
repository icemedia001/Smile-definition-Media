import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useGallery } from '../context/GalleryContext';
import { useBooking } from '../context/BookingContext';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import ImageModal from '../components/ImageModal';
import './Admin.css';

function Admin() {
    const { addProduct, products } = useStore();
    const { fetchAllBookings, updateBookingStatus } = useBooking();

    // State Declarations (Must be before effects)
    const [bookings, setBookings] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('adminAuth') === 'true');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeView, setActiveView] = useState('galleries');
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [activeTab, setActiveTab] = useState('photos');
    const [previewImage, setPreviewImage] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newClientName, setNewClientName] = useState('');
    const [newClientEmail, setNewClientEmail] = useState('');
    const [createdClientCreds, setCreatedClientCreds] = useState(null);

    const [newListData, setNewListData] = useState({ name: '', limit: 50 });

    const [isUploading, setIsUploading] = useState(false);

    const loadBookings = async () => {
        const all = await fetchAllBookings();
        setBookings(all);
    };

    // Load bookings when view changes to bookings or on initial auth
    useEffect(() => {
        if (isAuthenticated) {
            loadBookings();
        }
    }, [isAuthenticated, activeView]);

    const handleUpdateStatus = async (id, status, reason = '') => {
        if (confirm(`Are you sure you want to ${status} this booking?`)) {
            await updateBookingStatus(id, status, reason);
            alert(`Booking ${status}!`);
            loadBookings(); // Refresh list
        }
    };

    const {
        galleries,
        createGallery,
        addImagesToGallery,
        deleteGallery,
        uploadEditedImage,
        updateGallery,
        addFavoriteList
    } = useGallery();


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Security Check: Only allow specific admin email
            // In a production app, use Custom Claims or a Firestore 'admins' collection
            const ADMIN_EMAILS = ['smiledefinitionpro@gmail.com', 'admin@smiledefinition.com', 'teniopemipo@gmail.com']; // Add user's email if testing

            if (ADMIN_EMAILS.includes(user.email)) {
                setIsAuthenticated(true);
                localStorage.setItem('adminAuth', 'true');
                // Fetch bookings on login
                const allBookings = await fetchAllBookings();
                setBookings(allBookings);
            } else {
                alert('Access Denied: You do not have administrator privileges.');
                await auth.signOut(); // Log them out immediately
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert('Incorrect email or password');
        }
    };

    const handleCreateGallery = async (e) => {
        e.preventDefault();
        try {
            const { password } = await createGallery(newClientName, newClientEmail);
            setCreatedClientCreds({ email: newClientEmail, password });
            setNewClientName('');
            setNewClientEmail('');
        } catch (error) {
            alert('Error creating gallery');
        }
    };

    const handleImageUpload = async (e, galleryId) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            await addImagesToGallery(galleryId, files);
            alert('Images uploaded successfully!');
        } catch (error) {
            alert('Failed to upload images.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSetCover = async (galleryId, imageUrl) => {
        try {
            await updateGallery(galleryId, { coverPhotoUrl: imageUrl });
            alert('Cover photo updated!');
        } catch (error) {
            alert('Failed to update cover photo');
        }
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        if (!selectedGallery) return;
        try {
            await addFavoriteList(selectedGallery.id, newListData.name, newListData.limit);
            setNewListData({ name: '', limit: 50 });
            alert('List created!');
        } catch (error) {
            alert('Failed to create list');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login">
                <div className="login-box">
                    <form onSubmit={handleLogin}>
                        <h2>Admin Access</h2>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Admin Email"
                            required
                            style={{ marginBottom: '1rem', width: '100%', padding: '0.8rem' }}
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    if (selectedGallery) {
        const gallery = galleries.find(g => g.id === selectedGallery.id) || selectedGallery;

        return (
            <div className="admin-container">
                <Sidebar activeView={activeView} setActiveView={(view) => { setActiveView(view); setSelectedGallery(null); }} />
                <main className="admin-main">
                    <div className="detail-header">
                        <div>
                            <button onClick={() => setSelectedGallery(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '1rem' }}>← Back to Galleries</button>
                            <h1 className="page-title">{gallery.clientName}</h1>
                            <p style={{ color: '#888', marginTop: '0.5rem' }}>{gallery.clientEmail}</p>
                            <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '4px', display: 'inline-block' }}>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Password: </span>
                                <code style={{ fontWeight: 'bold' }}>{gallery.password}</code>
                            </div>
                        </div>
                        <div style={{ width: '200px', height: '150px', background: '#f0f0f0', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                            {gallery.coverPhotoUrl ? (
                                <img src={gallery.coverPhotoUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '0.8rem' }}>No Cover Photo</div>
                            )}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.7rem', padding: '0.3rem', textAlign: 'center' }}>Current Cover</div>
                        </div>
                    </div>

                    <div className="detail-tabs">
                        <button className={`tab ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>Photos ({gallery.images?.length || 0})</button>
                        <button className={`tab ${activeTab === 'lists' ? 'active' : ''}`} onClick={() => setActiveTab('lists')}>Lists & Limits</button>
                        <button className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
                    </div>

                    {activeTab === 'photos' && (
                        <div>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <input
                                    type="file"
                                    id="upload-photos"
                                    multiple
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(e, gallery.id)}
                                />
                                <label htmlFor="upload-photos" className="primary-btn">
                                    {isUploading ? 'Uploading...' : '+ Upload Photos'}
                                </label>
                            </div>

                            <div className="admin-gallery-grid">
                                {gallery.images?.map(img => (
                                    <div key={img.id} className="admin-img-card">
                                        <img
                                            src={img.url}
                                            alt="gallery"
                                            onClick={() => setPreviewImage(img.url)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <div className="img-actions">
                                            <button className="action-btn" onClick={() => handleSetCover(gallery.id, img.url)}>Set Cover</button>
                                            {/* Add more actions like Delete or Edit here */}
                                        </div>
                                        {img.selected && <div className="selection-badge">Selected</div>}
                                    </div>
                                ))}
                            </div>

                            <ImageModal
                                isOpen={!!previewImage}
                                onClose={() => setPreviewImage(null)}
                                imageUrl={previewImage}
                            />
                        </div>
                    )}

                    {activeTab === 'lists' && (
                        <div>
                            <div className="create-section" style={{ maxWidth: '500px', marginBottom: '3rem' }}>
                                <h3>Create Selection List</h3>
                                <form onSubmit={handleCreateList} className="create-form">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="List Name (e.g. Album Selection)"
                                            value={newListData.name}
                                            onChange={(e) => setNewListData({ ...newListData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            placeholder="Limit (e.g. 50)"
                                            value={newListData.limit}
                                            onChange={(e) => setNewListData({ ...newListData, limit: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="create-btn">Create List</button>
                                </form>
                            </div>

                            <h3>Active Lists</h3>
                            {gallery.favoriteLists?.length > 0 ? (
                                <div>
                                    {gallery.favoriteLists.map((list, index) => (
                                        <div key={index} className="list-item">
                                            <div>
                                                <h4>{list.name}</h4>
                                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Limit: {list.limit} photos</p>
                                            </div>
                                            <div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${(list.selections?.length || 0) / list.limit * 100}%` }}
                                                    ></div>
                                                </div>
                                                <p style={{ fontSize: '0.8rem', textAlign: 'right', marginTop: '0.3rem' }}>
                                                    {list.selections?.length || 0} / {list.limit} selected
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#999' }}>No lists created yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <div className="create-section" style={{ border: '1px solid #ffcccc' }}>
                                <h3 style={{ color: '#d32f2f' }}>Danger Zone</h3>
                                <p>Deleting a gallery is irreversible.</p>
                                <button
                                    className="danger-btn"
                                    onClick={() => {
                                        if (window.confirm('Are you sure?')) {
                                            deleteGallery(gallery.id);
                                            setSelectedGallery(null);
                                        }
                                    }}
                                >
                                    Delete Gallery
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <main className="admin-main">
                <header className="admin-header">
                    <h1 className="page-title">
                        {activeView === 'galleries' && 'Client Galleries'}
                        {activeView === 'products' && 'Store Products'}
                        {activeView === 'bookings' && 'Service Bookings'}
                    </h1>
                    {activeView === 'galleries' && (
                        <button className="primary-btn" onClick={() => setShowCreateModal(true)}>+ New Client</button>
                    )}
                </header>

                {activeView === 'galleries' && (
                    <div className="clients-grid">
                        {galleries.map(gallery => (
                            <div key={gallery.id} className="client-card" onClick={() => setSelectedGallery(gallery)}>
                                <div
                                    className="card-cover"
                                    style={{ backgroundImage: `url(${gallery.coverPhotoUrl || gallery.images?.[0]?.url || ''})` }}
                                >
                                    {!gallery.coverPhotoUrl && !gallery.images?.[0] && (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>No Images</div>
                                    )}
                                </div>
                                <div className="card-info">
                                    <h3>{gallery.clientName}</h3>
                                    <p>{gallery.images?.length || 0} Photos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeView === 'products' && (
                    <div>
                        {/* Product management (simplified for now to focus on gallery features) */}
                        <p>Product management goes here...</p>
                    </div>
                )}

                {activeView === 'bookings' && (
                    <div className="bookings-list">
                        {bookings.length === 0 ? (
                            <p>No bookings found.</p>
                        ) : (
                            bookings.map(booking => (
                                <div key={booking.id} style={{
                                    padding: '1.5rem',
                                    backgroundColor: '#fff',
                                    marginBottom: '1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #eee'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{booking.userName}</h3>
                                            <p style={{ color: '#666', margin: 0 }}>{booking.userEmail}</p>
                                            {booking.userPhone && <p style={{ color: '#666', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>📞 {booking.userPhone}</p>}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '20px',
                                                backgroundColor: booking.status === 'confirmed' ? '#e8f5e9' : (booking.status === 'rejected' ? '#ffebee' : '#fff3e0'),
                                                color: booking.status === 'confirmed' ? '#2e7d32' : (booking.status === 'rejected' ? '#c62828' : '#ef6c00'),
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold',
                                                display: 'inline-block',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {booking.status.toUpperCase()}
                                            </span>

                                            {booking.status === 'pending' && (
                                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                        style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const reason = prompt("Enter reason for rejection:");
                                                            if (reason) handleUpdateStatus(booking.id, 'rejected', reason);
                                                        }}
                                                        style={{ background: '#c62828', color: 'white', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#888' }}>
                                                Booked: {new Date(booking.createdAt?.seconds * 1000).toLocaleDateString()}
                                            </p>
                                            {booking.eventDate && (
                                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.95rem', fontWeight: 'bold', color: '#333' }}>
                                                    Event: {new Date(booking.eventDate).toLocaleDateString()}
                                                </p>
                                            )}
                                            {booking.rejectionReason && (
                                                <p style={{ color: '#c62828', fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                                    Reason: "{booking.rejectionReason}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                                        {booking.items.map((item, idx) => (
                                            <div key={idx} style={{ marginBottom: '0.5rem' }}>
                                                <strong>{item.packageTitle}</strong> - {item.tier.name}
                                                {item.addons.length > 0 && (
                                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                                        {' '}(+ {item.addons.map(a => a.name).join(', ')})
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                                            Total: €{booking.totalAmount}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Create Client Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>New Client Gallery</h2>
                            <button className="close-btn" onClick={() => { setShowCreateModal(false); setCreatedClientCreds(null); }}>×</button>
                        </div>

                        {!createdClientCreds ? (
                            <form onSubmit={handleCreateGallery}>
                                <div className="form-group">
                                    <label>Client Name</label>
                                    <input
                                        type="text"
                                        value={newClientName}
                                        onChange={(e) => setNewClientName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={newClientEmail}
                                        onChange={(e) => setNewClientEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="primary-btn" style={{ width: '100%' }}>Create Gallery</button>
                            </form>
                        ) : (
                            <div className="credentials-box">
                                <h3 style={{ color: 'green' }}>Gallery Created!</h3>
                                <p><strong>Email:</strong> {createdClientCreds.email}</p>
                                <p><strong>Password:</strong> <code className="password-display">{createdClientCreds.password}</code></p>
                                <p className="copy-hint">Please copy these credentials now.</p>
                                <button className="secondary-btn" onClick={() => { setShowCreateModal(false); setCreatedClientCreds(null); }} style={{ width: '100%', marginTop: '1rem' }}>Done</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Sidebar({ activeView, setActiveView }) {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">Smile Admin</div>
            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${activeView === 'galleries' ? 'active' : ''}`}
                    onClick={() => setActiveView('galleries')}
                >
                    Galleries
                </button>
                <button
                    className={`nav-item ${activeView === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveView('products')}
                >
                    Products
                </button>
                <button
                    className={`nav-item ${activeView === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveView('bookings')}
                >
                    Bookings
                </button>
            </nav>
            <div className="sidebar-footer">
                <Link to="/store" className="nav-item">← Back to Store</Link>
            </div>
        </aside>
    );
}

export default Admin;
