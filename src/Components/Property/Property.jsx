import React from "react";
import "./Property.css";
import { FaSearch, FaMapMarkerAlt, FaBath, FaBed, FaRulerCombined } from "react-icons/fa";
import { FiTarget, FiSliders } from "react-icons/fi";
import Breadcrumb from "./Breadcrumb";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export default function PropertyPage() {
  const [loading, setLoading] = useState(true);
  const [all, setAll] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [saleType, setSaleType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [minSqft, setMinSqft] = useState(0);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const snap = await getDocs(collection(db, "properties"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAll(data);
      } catch (e) {
        setAll([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, []);

  const filtered = useMemo(() => {
    let list = [...all];
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.address || p.location || "").toLowerCase().includes(q)
      );
    }
    if (location.trim()) {
      const ql = location.toLowerCase();
      list = list.filter((p) => (p.location || p.address || "").toLowerCase().includes(ql));
    }
    if (type !== "all") {
      list = list.filter((p) => (p.propertyType || "").toLowerCase() === type);
    }
    if (saleType === "sale") {
      list = list.filter((p) => !!p.forSale);
    } else if (saleType === "rent") {
      list = list.filter((p) => p.forSale === false || p.forSale === "rent");
    } else {
      // all
      list = list;
    }
    if (minBeds) list = list.filter((p) => (p.beds || 0) >= minBeds);
    if (minBaths) list = list.filter((p) => (p.baths || 0) >= minBaths);
    if (minSqft) list = list.filter((p) => (p.sqft || 0) >= minSqft);

    if (sortBy === "priceAsc") {
      list.sort((a, b) => (Number(a.priceValue || 0) - Number(b.priceValue || 0)));
    } else if (sortBy === "priceDesc") {
      list.sort((a, b) => (Number(b.priceValue || 0) - Number(a.priceValue || 0)));
    } else {
      list.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    }
    return list;
  }, [all, keyword, location, type, saleType, sortBy, minBeds, minBaths, minSqft]);

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid bg-white shadow-sm py-3 sticky-top topbar">

      </div>

      <div className="container-fluid premium-property-section">
        <div className="container py-5">
          {/* Premium Heading Section */}
          <div className="box-title text-center wow fadeInUp mb-5">
            <div className="text-subtitle text-primary">Property Listings</div>
            <h3 className="mt-4 title">Discover Your Dream Property</h3>
            {!loading && (
              <p className="text-muted mt-3 mb-0">
                {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} available
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center" style={{ padding: "5rem" }}>
              <div className="loading-spinner" style={{
                width: "60px",
                height: "60px",
                border: "5px solid #e2e8f0",
                borderTopColor: "#4A97E4",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto"
              }} />
              <p style={{ marginTop: "1.5rem", fontSize: "1.1rem", color: "#64748b" }}>Loading premium properties...</p>
            </div>
          ) : (
            <div className="row g-4">
              {filtered.map((item) => {
                const img = (item.images && item.images[0]) || item.image || "images/home/house-1.jpg";
                const addr = item.location || item.address || "";
                const price = item.price || item.priceText || "";
                return (
                  <div className="col-12 col-sm-6 col-md-6 col-lg-3" key={item.id}>
                    <div className="property-card premium-card-enhanced">
                      <div className="property-img-enhanced">
                        <img src={img} alt={item.title} />
                        <div className="property-overlay"></div>
                        <div className="badges-enhanced">
                          {item.featured && <span className="badge premium-badge-enhanced">Featured</span>}
                          {item.forSale ? (
                            <span className="badge sale-badge-enhanced">For Sale</span>
                          ) : (
                            <span className="badge rent-badge-enhanced">For Rent</span>
                          )}
                        </div>
                        <div className="property-price-overlay">
                          {price && <span className="price-display">{price}</span>}
                        </div>
                      </div>
                      <div className="property-content-enhanced">
                        <h5 className="property-title-enhanced" title={item.title}>{item.title}</h5>
                        <p className="property-location" title={addr}>
                          <FaMapMarkerAlt className="location-icon" />
                          <span>{addr || "Location not specified"}</span>
                        </p>
                        <div className="property-features">
                          <div className="feature-item">
                            <FaBed className="feature-icon" />
                            <span className="feature-value">{item.beds || 0}</span>
                            <span className="feature-label">Beds</span>
                          </div>
                          <div className="feature-item">
                            <FaBath className="feature-icon" />
                            <span className="feature-value">{item.baths || 0}</span>
                            <span className="feature-label">Baths</span>
                          </div>
                          <div className="feature-item">
                            <FaRulerCombined className="feature-icon" />
                            <span className="feature-value">{item.sqft || 0}</span>
                            <span className="feature-label">Sqft</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-12">
                  <div className="text-center" style={{ padding: "5rem" }}>
                    <div className="empty-state-icon mb-4">
                      <FaSearch style={{ fontSize: "4rem", color: "#cbd5e1" }} />
                    </div>
                    <h4 className="mb-3" style={{ color: "#334155" }}>No properties found</h4>
                    <p className="text-muted" style={{ fontSize: "1.1rem" }}>
                      Try adjusting your search filters to find more properties.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
