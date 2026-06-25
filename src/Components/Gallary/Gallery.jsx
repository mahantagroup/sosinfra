import React, { useEffect, useState, useMemo, useRef } from 'react';
import './Gallery.css';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase/Firebase';

const GalleryCard = React.memo(({ item, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="col-lg-4 col-md-6 col-sm-12 gallery-item-col">
      <article
        className="gallery-card-premium"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="gallery-image-container">
          <div className="image-overlay-gradient"></div>
          <img
            src={(item.images && item.images[item.primaryImageIndex || 0]) || item.image}
            alt={item.title || "Gallery Item"}
            className={`gallery-card-image ${imageLoaded ? 'loaded' : 'loading'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />

          <div className={`gallery-hover-overlay ${isHovered ? 'active' : ''}`}>
            <div className="view-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="view-text">View Gallery</span>
            </div>
          </div>

          {item.date && (
            <div className="image-date-badge">
              <span>{item.date}</span>
            </div>
          )}
        </div>

        {/* Show location and title below cards only for anniversary items */}
        {item.type === 'anniversaries' && (
          <div className="gallery-card-anniversary-info">
            {item.title && <p className="gallery-card-anniversary-title mb-2">{item.title}</p>}
            {item.location && <p className="gallery-card-anniversary-location"> {item.location}</p>}
          </div>
        )}

        <div className="gallery-card-content">
          {item.title && <h4 className="gallery-card-title">{item.title}</h4>}
          {item.subtitle && <p className="gallery-card-subtitle">{item.subtitle}</p>}
          {item.description && (
            <p className="gallery-card-description">{item.description}</p>
          )}

          <div className="gallery-card-footer-info">
            {item.imageCount && (
              <span className="image-count">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L8.586 11.414C9.366 10.634 10.634 10.634 11.414 11.414L16 16M14 14L15.586 12.414C16.366 11.634 17.634 11.634 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.imageCount} photos
              </span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
});

GalleryCard.displayName = 'GalleryCard';

const GallerySection = React.forwardRef(({ title, items, onCardClick, showTitle = true, icon, sectionId }, ref) => {
  const [expanded, setExpanded] = useState(false);
  const itemsPerPage = 6;
  const displayedItems = expanded ? items : items.slice(0, itemsPerPage);
  const hasMore = items.length > itemsPerPage;

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className="gallery-section-container" id={sectionId}>
      <div className="gallery-section-header">
        <div className="section-title-wrapper">
          <h2 className="section-main-title">{title}</h2>
          <div className="section-title-underline"></div>
        </div>
      </div>

      <div className="row gallery-grid-row">
        {displayedItems.map((it, index) => (
          <GalleryCard
            key={it.firebaseDocId || index}
            item={it}
            onClick={() => onCardClick(it)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="view-more-container">
          <button
            className="view-more-button"
            onClick={() => setExpanded(!expanded)}
          >
            <span>{expanded ? 'Show Less' : `View More ${title}`}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

GallerySection.displayName = 'GallerySection';

const GalleryBreadcrumbs = ({ currentSection }) => {
  const location = useLocation();

  return (
    <div className="gallery-breadcrumbs">
      <div className="container">
        <nav className="breadcrumb-nav" aria-label="Gallery navigation">
          <div className="breadcrumb-path">
            <Link to="/" className="breadcrumb-home">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Home
            </Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/gallery" className="breadcrumb-gallery">Gallery</Link>

            {currentSection && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{currentSection}</span>
              </>
            )}
          </div>

          <div className="breadcrumb-section-nav">
            <span className="section-nav-label">Jump to:</span>
            <div className="section-buttons">
              <a href="#achievements" className="section-button">Achievements</a>
              <a href="#anniversary" className="section-button">Anniversary</a>
              <a href="#corporate" className="section-button">Corporate</a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const achievementRef = useRef(null);
  const anniversaryRef = useRef(null);
  const corporateRef = useRef(null);

  const currentSection = searchParams.get('section');

  useEffect(() => {
    const ref = collection(db, 'gallery');
    const q = query(ref, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rec = snap.docs.map((d) => ({ firebaseDocId: d.id, ...d.data() }));
        rec.sort((a, b) => {
          const numA = parseInt(a.id) || 0;
          const numB = parseInt(b.id) || 0;
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          return (a.id || '').localeCompare(b.id || '');
        });
        setItems(rec);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section && !loading) {
      setTimeout(() => {
        const refs = {
          'achievements': achievementRef,
          'anniversary': anniversaryRef,
          'corporate': corporateRef
        };
        const targetRef = refs[section];
        if (targetRef && targetRef.current) {
          targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams, loading]);

  const achievementItems = useMemo(() => items.filter(it => it.type === 'achievements'), [items]);
  const anniversaryItems = useMemo(() => items.filter(it => it.type === 'anniversaries'), [items]);
  const corporateItems = useMemo(() => items.filter(it => it.type === 'corporate_meetings'), [items]);

  const handleCardClick = (item) => {
    setActive(item);
    setActiveIndex(item.primaryImageIndex || 0);
  };

  const sectionIcons = {
    achievements: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3Z" stroke="#4A97E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    anniversary: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3M12 8V12L15 15" stroke="#4A97E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    corporate: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10M10 14H14M10 17H14M9 7H10M10 10H10.01M14 7H15M15 10H15.01M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14" stroke="#4A97E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return (
    <div className="gallery-page-wrapper pt-5">
      <div className="container">
        {loading && (
          <div className="gallery-loading">
            <div className="loading-spinner"></div>
            <p>Loading gallery...</p>
          </div>
        )}

        {!loading && (
          <>
            {achievementItems.length > 0 && (
              <GallerySection
                ref={achievementRef}
                title="Achievements & Awards"
                items={achievementItems}
                onCardClick={handleCardClick}
                icon={sectionIcons.achievements}
                sectionId="achievements"
              />
            )}

            {anniversaryItems.length > 0 && (
              <GallerySection
                ref={anniversaryRef}
                title="Anniversary Celebrations"
                items={anniversaryItems}
                onCardClick={handleCardClick}
                icon={sectionIcons.anniversary}
                sectionId="anniversary"
              />
            )}

            {corporateItems.length > 0 && (
              <GallerySection
                ref={corporateRef}
                title="Corporate Meetings & Events"
                items={corporateItems}
                onCardClick={handleCardClick}
                icon={sectionIcons.corporate}
                sectionId="corporate"
              />
            )}
          </>
        )}

        {!loading &&
          achievementItems.length === 0 &&
          anniversaryItems.length === 0 &&
          corporateItems.length === 0 && (
            <div className="gallery-empty-state">
              <div className="empty-state-icon">📷</div>
              <h3>No Gallery Items Yet</h3>
              <p>Add images from the Admin panel to get started.</p>
            </div>
          )}
      </div>

      {/* Enhanced Modal */}
      {active && (
        <div className="premium-modal-backdrop" onClick={() => setActive(null)}>
          <div className="premium-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{active.title || "Gallery Item"}</h3>
                {active.date && <p className="modal-date">{active.date}</p>}
                {active.type === 'anniversaries' && active.location && (
                  <p className="modal-location "> {active.location}</p>
                )}
              </div>
              <button className="modal-close" onClick={() => setActive(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="modal-image-container">
              <button
                className="modal-nav-btn prev"
                onClick={() =>
                  setActiveIndex((prev) =>
                    (prev - 1 + active.images.length) % active.images.length
                  )
                }
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <img
                src={active.images ? active.images[activeIndex] : active.image}
                alt={active.title || "Preview"}
                className={`modal-main-image ${active.type === 'anniversaries' ? 'anniversary-modal-image' : ''}`}
              />

              <button
                className="modal-nav-btn next"
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % active.images.length)
                }
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="image-counter">
                {activeIndex + 1} / {active.images?.length || 1}
              </div>
            </div>

            {active.description && (
              <div className="modal-description">
                <p>{active.description}</p>
              </div>
            )}

            {Array.isArray(active.images) && active.images.length > 1 && (
              <div className="modal-thumbnails">
                {active.images.map((src, i) => (
                  <div
                    key={i}
                    className={`thumbnail-container ${i === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(i)}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      className="modal-thumbnail"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;