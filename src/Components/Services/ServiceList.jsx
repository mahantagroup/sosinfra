import React from "react";

const primaryColor = "#4A97E4";

const serviceData = [
  {
    id: 1,
    title: "Buy a New Home",
    description:
      "Discover your dream home effortlessly with expert guidance and diverse property options.",
    img: "",
    link: "/buy-home",
  },
  {
    id: 2,
    title: "Sell Your Home",
    description:
      "Sell confidently with professional strategies that highlight your property's best features.",
    img: "",
    link: "/sell-home",
  },
  {
    id: 3,
    title: "Rent a Home",
    description:
      "Find your ideal rental home tailored to your lifestyle and comfort needs.",
    img: "",
    link: "/rent-home",
  },
];

const ServiceList = () => {
  return (
    <section className="py-5">
      <style>{`
        .service-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          background: #fff;
        }

        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .service-card img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .service-title {
          font-weight: 600;
          color: ${primaryColor};
        }

        .btn-primary-custom {
          color: ${primaryColor};
          border: 2px solid ${primaryColor};
          padding: 6px 16px;
          border-radius: 50px;
          transition: 0.3s;
          text-decoration: none;
          font-weight: 500;
        }

        .btn-primary-custom:hover {
          background: ${primaryColor};
          color: white;
        }
      `}</style>

      <div className="container">
        {/* Section Title */}
        <div className="box-title text-center wow fadeInUp mb-5">
          <div className="text-subtitle text-primary">Our Services</div>
          <h3 className="mt-4 title">What We Offer You</h3>
        </div>

        {/* Service Cards */}
        <div className="row g-4">
          {serviceData.map((item) => (
            <div className="col-md-4" key={item.id}>
              <div className="card service-card p-4 text-center h-100">
                <img src={item.img} alt={item.title} />

                <h5 className="service-title mt-3">{item.title}</h5>

                <p className="mt-2" style={{ color: "#555" }}>
                  {item.description}
                </p>

                <a href={item.link} className="btn-primary-custom mt-auto">
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
