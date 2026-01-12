import { Link } from 'react-router-dom';

function ServiceCard({ packageData }) {
    return (
        <div className="service-card" style={{
            border: '1px solid #eee',
            borderRadius: '8px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            backgroundColor: '#fff',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                height: '250px',
                backgroundColor: '#e0e0e0',
                backgroundImage: `url('${packageData.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: packageData.imagePosition || 'center',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)'
                }}></div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontFamily: 'Playfair Display, serif' }}>{packageData.title}</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6', flex: 1 }}>
                    {packageData.description}
                </p>
                <Link
                    to={`/services/${packageData.id}`}
                    style={{
                        display: 'block',
                        padding: '1rem',
                        backgroundColor: 'transparent',
                        color: '#c5a059',
                        textDecoration: 'none',
                        border: '1px solid #c5a059',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#c5a059';
                        e.target.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#c5a059';
                    }}
                >
                    View Packages
                </Link>
            </div>
        </div>
    );
}

export default ServiceCard;
