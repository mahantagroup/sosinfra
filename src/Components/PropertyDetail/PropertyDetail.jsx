import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import './PropertyDetail.css';

const PremiumPropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const docRef = doc(db, 'properties', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setProperty({ id: docSnap.id, ...docSnap.data() });
                } else {
                    alert('Property not found');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching property:', error);
                alert('Error loading property');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="premium-property-loading">
                <div className="premium-loading-spinner">
                    <div className="premium-spinner-circle"></div>
                </div>
                <p className="premium-loading-text">Loading Premium Property</p>
            </div>
        );
    }

    if (!property) {
        return null;
    }

    const images = property.images || [property.image].filter(Boolean);
    const mainImage = images[selectedImage] || images[0];

    // Sample amenities data
    const amenities = [
        { name: 'Swimming Pool', available: true },
        { name: 'Gym', available: true },
        { name: 'Parking', available: true },
        { name: 'Security', available: true },
        { name: 'Garden', available: false },
        { name: 'Balcony', available: true }
    ];

    return (
        <div className="premium-property-detail">
            {/* Header Navigation */}
            <div className="premium-property-header">
                <div className="premium-container">
                    <button className="premium-back-btn" onClick={() => navigate(-1)}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Back to Properties
                    </button>
                </div>
            </div>

            <div className="premium-container">
                <div className="premium-property-layout">
                    {/* Main Content */}
                    <div className="premium-property-main">
                        {/* Image Gallery */}
                        <div className="premium-gallery-section">
                            <div className="premium-main-image">
                                <img src={mainImage} alt={property.title} />
                                <div className="premium-image-badges">
                                    {property.featured && (
                                        <span className="premium-badge premium-featured">Featured</span>
                                    )}
                                    <span className={`premium-badge premium-type ${property.forSale ? 'sale' : 'rent'}`}>
                                        {property.forSale ? 'For Sale' : 'For Rent'}
                                    </span>
                                </div>
                                <button className="premium-gallery-fullscreen">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M6 7V3M6 7H2M14 7V3M14 7H18M6 13V17M6 13H2M14 13V17M14 13H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                            
                            {images.length > 1 && (
                                <div className="premium-thumbnail-grid">
                                    {images.slice(0, 4).map((img, index) => (
                                        <div
                                            key={index}
                                            className={`premium-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={img} alt={`${property.title} ${index + 1}`} />
                                            {index === 3 && images.length > 4 && (
                                                <div className="premium-thumbnail-overlay">
                                                    +{images.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Property Info Tabs */}
                        <div className="premium-info-tabs">
                            <div className="premium-tab-nav">
                                <button 
                                    className={`premium-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button 
                                    className={`premium-tab-btn ${activeTab === 'amenities' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('amenities')}
                                >
                                    Amenities
                                </button>
                                <button 
                                    className={`premium-tab-btn ${activeTab === 'location' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('location')}
                                >
                                    Location
                                </button>
                            </div>

                            <div className="premium-tab-content">
                                {activeTab === 'overview' && (
                                    <div className="premium-tab-panel">
                                        <div className="premium-property-highlights">
                                            {property.propertyType !== 'office' && (
                                                <>
                                                    <div className="premium-highlight-item">
                                                        <div className="premium-highlight-icon">🛏️</div>
                                                        <div className="premium-highlight-content">
                                                            <div className="premium-highlight-value">{property.beds || 0}</div>
                                                            <div className="premium-highlight-label">Bedrooms</div>
                                                        </div>
                                                    </div>
                                                    <div className="premium-highlight-item">
                                                        <div className="premium-highlight-icon">🚿</div>
                                                        <div className="premium-highlight-content">
                                                            <div className="premium-highlight-value">{property.baths || 0}</div>
                                                            <div className="premium-highlight-label">Bathrooms</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div className="premium-highlight-item">
                                                <div className="premium-highlight-icon">📐</div>
                                                <div className="premium-highlight-content">
                                                    <div className="premium-highlight-value">{property.sqft}</div>
                                                    <div className="premium-highlight-label">Sq Ft</div>
                                                </div>
                                            </div>
                                            <div className="premium-highlight-item">
                                                <div className="premium-highlight-icon">🏠</div>
                                                <div className="premium-highlight-content">
                                                    <div className="premium-highlight-value">{property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) : 'Apartment'}</div>
                                                    <div className="premium-highlight-label">Type</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Property Type Specific Details */}
                                        {property.propertyType === 'apartment' && (
                                            <div className="premium-property-specs">
                                                <h3>Apartment Details</h3>
                                                <div className="premium-specs-grid">
                                                    {property.floorNumber && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Floor Number</span>
                                                            <span className="premium-spec-value">{property.floorNumber}</span>
                                                        </div>
                                                    )}
                                                    {property.buildingName && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Building Name</span>
                                                            <span className="premium-spec-value">{property.buildingName}</span>
                                                        </div>
                                                    )}
                                                    {property.parkingSpaces && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Parking Spaces</span>
                                                            <span className="premium-spec-value">{property.parkingSpaces}</span>
                                                        </div>
                                                    )}
                                                    {property.hasElevator && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Elevator</span>
                                                            <span className="premium-spec-value">✓ Available</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {property.propertyType === 'villa' && (
                                            <div className="premium-property-specs">
                                                <h3>Villa Details</h3>
                                                <div className="premium-specs-grid">
                                                    {property.plotSize && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Plot Size</span>
                                                            <span className="premium-spec-value">{property.plotSize} sqft</span>
                                                        </div>
                                                    )}
                                                    {property.numberOfFloors && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Number of Floors</span>
                                                            <span className="premium-spec-value">{property.numberOfFloors}</span>
                                                        </div>
                                                    )}
                                                    {property.gardenArea && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Garden Area</span>
                                                            <span className="premium-spec-value">{property.gardenArea} sqft</span>
                                                        </div>
                                                    )}
                                                    {property.hasSwimmingPool && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Swimming Pool</span>
                                                            <span className="premium-spec-value">✓ Available</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {property.propertyType === 'studio' && (
                                            <div className="premium-property-specs">
                                                <h3>Studio Details</h3>
                                                <div className="premium-specs-grid">
                                                    {property.studioType && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Studio Type</span>
                                                            <span className="premium-spec-value">{property.studioType.charAt(0).toUpperCase() + property.studioType.slice(1)}</span>
                                                        </div>
                                                    )}
                                                    {property.kitchenType && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Kitchen Type</span>
                                                            <span className="premium-spec-value">{property.kitchenType.charAt(0).toUpperCase() + property.kitchenType.slice(1)}</span>
                                                        </div>
                                                    )}
                                                    {property.isFurnished && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Furnished</span>
                                                            <span className="premium-spec-value">✓ Yes</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {property.propertyType === 'house' && (
                                            <div className="premium-property-specs">
                                                <h3>House Details</h3>
                                                <div className="premium-specs-grid">
                                                    {property.plotSize && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Plot Size</span>
                                                            <span className="premium-spec-value">{property.plotSize} sqft</span>
                                                        </div>
                                                    )}
                                                    {property.numberOfFloors && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Number of Floors</span>
                                                            <span className="premium-spec-value">{property.numberOfFloors}</span>
                                                        </div>
                                                    )}
                                                    {property.hasGarden && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Garden</span>
                                                            <span className="premium-spec-value">✓ Available</span>
                                                        </div>
                                                    )}
                                                    {property.hasGarage && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Garage</span>
                                                            <span className="premium-spec-value">✓ Available</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {property.propertyType === 'office' && (
                                            <div className="premium-property-specs">
                                                <h3>Office Details</h3>
                                                <div className="premium-specs-grid">
                                                    {property.officeSpaceType && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Space Type</span>
                                                            <span className="premium-spec-value">{property.officeSpaceType.charAt(0).toUpperCase() + property.officeSpaceType.slice(1)}</span>
                                                        </div>
                                                    )}
                                                    {property.workstations && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Workstations</span>
                                                            <span className="premium-spec-value">{property.workstations}</span>
                                                        </div>
                                                    )}
                                                    {property.meetingRooms && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Meeting Rooms</span>
                                                            <span className="premium-spec-value">{property.meetingRooms}</span>
                                                        </div>
                                                    )}
                                                    {property.parkingSpaces && (
                                                        <div className="premium-spec-item">
                                                            <span className="premium-spec-label">Parking Spaces</span>
                                                            <span className="premium-spec-value">{property.parkingSpaces}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {property.description && (
                                            <div className="premium-description">
                                                <h3>Property Description</h3>
                                                <p>{property.description}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'amenities' && (
                                    <div className="premium-tab-panel">
                                        <div className="premium-amenities-grid">
                                            {amenities.map((amenity, index) => (
                                                <div key={index} className="premium-amenity-item">
                                                    <div className={`premium-amenity-icon ${amenity.available ? 'available' : 'unavailable'}`}>
                                                        {amenity.available ? '✓' : '✗'}
                                                    </div>
                                                    <span className="premium-amenity-name">{amenity.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'location' && (
                                    <div className="premium-tab-panel">
                                        <div className="premium-location-card">
                                            <div className="premium-location-map">
                                                {/* Map placeholder */}
                                                <div className="premium-map-placeholder">
                                                    <span>📍</span>
                                                    <p>Interactive Map</p>
                                                </div>
                                            </div>
                                            <div className="premium-location-details">
                                                <h4>Location Details</h4>
                                                <p>{property.location}</p>
                                                <div className="premium-location-features">
                                                    <span>🚶‍♂️ Walkable Neighborhood</span>
                                                    <span>🛍️ Shopping Nearby</span>
                                                    <span>🏫 Schools in Area</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="premium-property-sidebar">
                        <div className="premium-sidebar-card">
                            <div className="premium-price-section">
                                <h2 className="premium-price">{property.price}</h2>
                                <p className="premium-price-note">Asking Price</p>
                            </div>

                            <div className="premium-agent-card">
                                <div className="premium-agent-header">
                                    <h3>Contact Agent</h3>
                                    <div className="premium-agent-rating">
                                        <span className="premium-rating-stars">★★★★★</span>
                                        <span className="premium-rating-text">5.0</span>
                                    </div>
                                </div>
                                <div className="premium-agent-profile">
                                    <img 
                                        src={property.avatar || '/images/avatar/avt-png1.png'} 
                                        alt={property.agent}
                                        className="premium-agent-avatar"
                                    />
                                    <div className="premium-agent-info">
                                        <h4>{property.agent}</h4>
                                        <p>Senior Real Estate Agent</p>
                                        <div className="premium-agent-stats">
                                            <span>15+ Years Experience</span>
                                            <span>50+ Properties Sold</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="premium-agent-contact">
                                    <button className="premium-contact-btn primary">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M3 3H5.5L7 7.5L5 9C6.5 12 9 13.5 12 15L13.5 13L17 14.5V16C17 16.5304 16.7893 17.0391 16.4142 17.4142C16.0391 17.7893 15.5304 18 15 18C11.099 18 7.497 16.375 4.929 13.807C2.361 11.239 0.736 7.637 0.736 3.736C0.736 3.205 0.946 2.695 1.321 2.32C1.696 1.945 2.205 1.735 2.736 1.735H3C3.796 1.735 4.559 2.051 5.122 2.614L6.38 3.872C6.842 4.334 7.082 4.976 7.038 5.63L6.91 7.21C6.878 7.667 7.12 8.1 7.536 8.316C8.192 8.66 8.916 8.85 9.654 8.85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                        Call Agent
                                    </button>
                                    <button className="premium-contact-btn secondary">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M3 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V13C17 13.5304 16.7893 14.0391 16.4142 14.4142C16.0391 14.7893 15.5304 15 15 15H3C2.46957 15 1.96086 14.7893 1.58579 14.4142C1.21071 14.0391 1 13.5304 1 13V5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3Z" stroke="currentColor" strokeWidth="1.5"/>
                                            <path d="M17 5L9 9.5L1 5" stroke="currentColor" strokeWidth="1.5"/>
                                        </svg>
                                        Message
                                    </button>
                                </div>
                            </div>

                            <div className="premium-action-buttons">
                                <button className="premium-action-btn primary">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M9 12V6M6 9H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    Schedule Tour
                                </button>
                                <button className="premium-action-btn outline">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M6.5 2H11.5L15 5.5V15.5C15 15.7652 14.8946 16.0196 14.7071 16.2071C14.5196 16.3946 14.2652 16.5 14 16.5H4C3.73478 16.5 3.48043 16.3946 3.29289 16.2071C3.10536 16.0196 3 15.7652 3 15.5V3C3 2.73478 3.10536 2.48043 3.29289 2.29289C3.48043 2.10536 3.73478 2 4 2H6.5Z" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M11 2V5.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    Download Brochure
                                </button>
                            </div>

                            <div className="premium-property-meta">
                                <div className="premium-meta-item">
                                    <span className="premium-meta-label">Property ID</span>
                                    <span className="premium-meta-value">#{property.id.slice(-8)}</span>
                                </div>
                                <div className="premium-meta-item">
                                    <span className="premium-meta-label">Listed Date</span>
                                    <span className="premium-meta-value">2 days ago</span>
                                </div>
                                <div className="premium-meta-item">
                                    <span className="premium-meta-label">Views</span>
                                    <span className="premium-meta-value">1,247</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumPropertyDetail;