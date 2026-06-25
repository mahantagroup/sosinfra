import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "./Test.css";

export default function TestimonialPremiumLight() {

  const videoTestimonials = [
    "https://www.youtube.com/embed/dtYuw2SlOtw",
    "https://www.youtube.com/embed/Eeav-EL8zZ4",
    "https://www.youtube.com/embed/Ycqs8-ykZwA"
  ];

  return (
    <section className="premium-testimonial-light">
      <div className="container">

        {/* Section Header */}
        <div className="box-title text-center wow fadeInUp">
          <div className="text-subtitle text-primary">Our Testimonials</div>
          <h3 className="mt-4 title">What People Say</h3>
          <p className="section-subtitle">Hear from our valued clients about their experience</p>
        </div>

        {/* Video Swiper */}
        <div className="premium-testimonial-swiper">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
              clickable: true,
              el: ".premium-swiper-pagination",
              bulletClass: "premium-swiper-bullet",
              bulletActiveClass: "premium-swiper-bullet-active",
            }}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
            }}
            loop={true}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="premium-testimonial-slider"
          >
            {videoTestimonials.map((video, index) => (
              <SwiperSlide key={index}>
                <div className="premium-video-card">
                  <div className="premium-video-wrapper">
                    <iframe
                      src={video}
                      title={`testimonial-video-${index}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination */}
          <div className="premium-swiper-pagination"></div>
        </div>

      </div>
    </section>
  );
}
