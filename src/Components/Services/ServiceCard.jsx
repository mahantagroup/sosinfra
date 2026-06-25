import React from "react";

const serviceData = [
  {
    id: 1,
    title: "Buy A New Home",
    description:
      "Discover your dream home effortlessly. Explore diverse properties and expert guidance for a seamless buying experience.",
    img: "images/service/home-1.png",
    link: "sidebar-grid.html",
  },
  {
    id: 2,
    title: "Sell a home",
    description:
      "Sell confidently with expert guidance and effective strategies, showcasing your property's best features for a successful sale.",
    img: "images/service/home-2.png",
    link: "sidebar-grid.html",
  },
  {
    id: 3,
    title: "Rent a home",
    description:
      "Discover your perfect rental effortlessly. Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs.",
    img: "images/service/home-3.png",
    link: "sidebar-grid.html",
  },
];

const ExploreCities = () => {
  return (
    <section className="flat-section">
      <div className="container">
        <div className="box-title text-center wow fadeInUp">
          <div className="text-subtitle text-primary">Explore Cities</div>
          <h3 className="mt-4 title">Our Services</h3>
        </div>

        <div
          className="tf-grid-layout md-col-3 wow fadeInUpSmall"
          data-wow-delay=".4s"
          data-wow-duration="2000ms"
        >
          {serviceData.map((item) => (
            <div className="box-service" key={item.id}>
              <div className="image">
                <img
                  className="lazyload"
                  data-src={item.img}
                  src={item.img}
                  alt={item.title}
                />
              </div>

              <div className="content">
                <h5 className="title">{item.title}</h5>
                <p className="description">{item.description}</p>

                <a href={item.link} className="tf-btn btn-line">
                  Learn More{" "}
                  <span className="icon icon-arrow-right2"></span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCities;
