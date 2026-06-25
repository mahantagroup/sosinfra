import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';
import './Property.css';

/* -----------------------------------------
   FIXED PROPERTY DATA (Fallback)
------------------------------------------ */
const fixedProperties = [
  {
    id: 1,
    title: "Munim Ji State",
    image: "images/home/house-1.jpg",
    avatar: "images/avatar/avt-png1.png",
    agent: "Rajesh Sharma",
    price: "₹35,00,000",
    location: "Indore, Madhya Pradesh, India",
    beds: 3,
    baths: 2,
    sqft: 1100,
    featured: true,
    forSale: true
  }
];

/* -----------------------------------------
   MAIN PROPERTY LISTINGS COMPONENT
------------------------------------------ */
const PropertyListings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('viewAll');
  const [loading, setLoading] = useState(true);
  const [firebaseProperties, setFirebaseProperties] = useState([]);

  // Fetch properties from Firebase
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'properties'));
        const propertiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFirebaseProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filterPropertiesByType = (list, type) => {
    if (type === "viewAll") return list;
    return list.filter(
      (p) => (p.propertyType || "apartment").toLowerCase() === type
    );
  };

  const allProperties =
    firebaseProperties.length > 0 ? firebaseProperties : fixedProperties;

  const [properties, setProperties] = useState({
    viewAll: allProperties,
    apartment: filterPropertiesByType(allProperties, "apartment"),
    villa: filterPropertiesByType(allProperties, "villa"),
    studio: filterPropertiesByType(allProperties, "studio"),
    house: filterPropertiesByType(allProperties, "house"),
    office: filterPropertiesByType(allProperties, "office")
  });

  useEffect(() => {
    const updated = firebaseProperties.length > 0 ? firebaseProperties : fixedProperties;

    setProperties({
      viewAll: updated,
      apartment: filterPropertiesByType(updated, "apartment"),
      villa: filterPropertiesByType(updated, "villa"),
      studio: filterPropertiesByType(updated, "studio"),
      house: filterPropertiesByType(updated, "house"),
      office: filterPropertiesByType(updated, "office")
    });
  }, [firebaseProperties]);

  const propertyTypes = [
    { id: "viewAll", label: "View All" },
    { id: "apartment", label: "Apartment" },
    { id: "villa", label: "Villa" },
    { id: "studio", label: "Studio" },
    { id: "house", label: "House" },
    { id: "office", label: "Office" }
  ];

  return (
    <section className="flat-section flat-recommended">
      <div className="container">
        <div className="box-title text-center">
          <div className="text-subtitle text-primary">Featured Properties</div>
          <h3 className="mt-4 title">Recommended For You</h3>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: "3rem" }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: "1rem" }}>Loading properties...</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flat-tab-recommended">
              <ul className="nav-tab-recommended justify-content-md-center">
                {propertyTypes.map((type) => (
                  <li key={type.id} className="nav-tab-item">
                    <button
                      className={`nav-link-item ${activeTab === type.id ? "active" : ""}`}
                      onClick={() => setActiveTab(type.id)}
                    >
                      {type.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {propertyTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`tab-pane ${activeTab === type.id ? "active show" : ""}`}
                  >
                    <PropertyGrid properties={properties[type.id] || []} />

                    <div className="text-center">
                      <button
                        type="button"
                        className="tf-btn btn-view primary size-1 hover-btn-view"
                        onClick={() => navigate("/property")}
                      >
                        View All Properties
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

/* -----------------------------------------
   PROPERTY GRID
------------------------------------------ */
const PropertyGrid = ({ properties }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center" style={{ padding: "3rem" }}>
        <p style={{ fontSize: "1.2rem" }}>No properties found.</p>
      </div>
    );
  }

  return (
    <div className="row">
      {properties.map((p) => (
        <div className="col-xl-4 col-lg-6 col-md-6" key={p.id}>
          <PropertyCard property={p} />
        </div>
      ))}
    </div>
  );
};

/* -----------------------------------------
   PROPERTY CARD (3D EFFECT)
------------------------------------------ */
const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const wrapperRef = useRef(null);

  const {
    id,
    title,
    image,
    images,
    avatar,
    price,
    location,
    agent,
    beds,
    baths,
    sqft,
    featured,
    forSale,
    type,
    plot_category,
    contact_name,
    contact_phone,
    contact_email
  } = property;

  const mainImage = (images && images[0]) || image || "images/home/house-1.jpg";
  const agentAvatar = avatar || "images/avatar/avt-png1.png";

  const isPlot = type === "plot" || plot_category;

  const plotLabel =
    plot_category === "commercial"
      ? "Commercial"
      : plot_category === "investment"
      ? "Investment"
      : "Residential";

  /* ---- SCROLL 3D EFFECT ---- */
  useEffect(() => {
    const handleScroll = () => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const cardCenter = rect.top + rect.height / 2;

      const progress = (cardCenter - windowHeight / 2) / (windowHeight / 2);
      const clamp = Math.max(-1, Math.min(1, progress));

      const rotateX = clamp * 18;
      const translateY = clamp * 30;
      const translateZ = -Math.abs(clamp * 60);

      card.style.transform = `
        perspective(1400px)
        rotateX(${rotateX}deg)
        translateY(${translateY}px)
        translateZ(${translateZ}px)
      `;
      card.style.opacity = Math.min(1, 1 - Math.abs(clamp * 0.4));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---- MOUSE TILT EFFECT ---- */
  const handleMouseMove = (e) => {
    const wrap = wrapperRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 9;
    const rotateX = ((centerY - y) / centerY) * 6;

    wrap.style.transform = `
      perspective(1400px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `;
  };

  const handleMouseLeave = () => {
    const wrap = wrapperRef.current;
    wrap.style.transform = "perspective(1400px) rotateX(0) rotateY(0) scale(1)";
  };

  const handleCardClick = () => {
    if (id) navigate(`/property/${id}`);
  };

  return (
    <div className="property-card-3d" ref={cardRef} onClick={handleCardClick}>
      <div
        className="property-tilt-wrapper"
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Section */}
        <div className="archive-top">
          <div className="images-style">
            <img src={mainImage} alt={title} />
          </div>

          <div className="top">
            <ul className="d-flex gap-6">
              {featured && <li className="flag-tag primary">Featured</li>}

              {isPlot ? (
                <li className="flag-tag style-1">{plotLabel} Plot</li>
              ) : (
                <li className={`flag-tag ${forSale ? "style-1" : "style-2"}`}>
                  {forSale ? "For Sale" : "For Rent"}
                </li>
              )}
            </ul>
          </div>

          <div className="bottom">{location}</div>
        </div>

        {/* Content */}
        <div className="archive-bottom">
          <h6>{title}</h6>

          <div className="meta-list">
            {isPlot ? (
              <>
                <span>{plotLabel} Plot</span>
                {contact_phone && (
                  <>
                    {" "} • <span>Contact: {contact_phone}</span>
                  </>
                )}
              </>
            ) : (
              <>
                <span>{beds} Beds</span> • <span>{baths} Baths</span> •{" "}
                <span>{sqft} sqft</span>
              </>
            )}
          </div>

          <div className="content-bottom">
            <div className="avatar">
              {/* <img src={agentAvatar} alt={agent || contact_name} /> */}
              <span>{isPlot ? contact_name : agent}</span>
            </div>
            <h6 className="price">
              {price || (isPlot ? "Contact for price" : "")}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;
