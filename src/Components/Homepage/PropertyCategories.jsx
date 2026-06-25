import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import './PropertyCategories.css';

const PropertyCategories = () => {
    const swiperRef = useRef(null);

    const categories = [
        {
            id: 1,
            name: 'Mumbai',
            image: 'images/location/location-1.jpg',
            propertyCount: '321 Property',
            link: 'topmap-grid.html'
        },
        {
            id: 2,
            name: 'Delhi',
            image: 'images/location/location-2.jpg',
            propertyCount: '287 Property',
            link: 'topmap-grid.html'
        },
        {
            id: 3,
            name: 'Bangalore',
            image: 'images/location/location-3.jpg',
            propertyCount: '154 Property',
            link: 'topmap-grid.html'
        },
        {
            id: 4,
            name: 'Hyderabad',
            image: 'images/location/location-4.jpg',
            propertyCount: '432 Property',
            link: 'topmap-grid.html'
        },
        {
            id: 5,
            name: 'Pune',
            image: 'images/location/location-5.jpg',
            propertyCount: '198 Property',
            link: 'topmap-grid.html'
        },
        {
            id: 6,
            name: 'Ahmedabad',
            image: 'images/location/location-6.jpg',
            propertyCount: '376 Property',
            link: 'topmap-grid.html'
        },
        {
            id: 7,
            name: 'Kolkata',
            image: 'images/location/location-1.jpg',
            propertyCount: '523 Property',
            link: 'topmap-grid.html'
        },
        {
            id: 8,
            name: 'Chennai',
            image: 'images/location/location-2.jpg',
            propertyCount: '267 Property',
            link: 'topmap-grid.html'
        }

    ];

    const swiperParams = {
        modules: [Navigation, Pagination],
        spaceBetween: 8,
        slidesPerView: 6,
        pagination: {
            clickable: true,
            el: '.sw-pagination-location',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 8
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 8
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 8
            },
            1024: {
                slidesPerView: 6,
                spaceBetween: 8
            }
        },
        onSwiper: (swiper) => {
            swiperRef.current = swiper;
        }
    };

    return (
        <section className="flat-categories px-10">
            <div className="container">
                <div className="box-title text-center wow fadeInUp">
                    <div className="text-subtitle text-primary">Property Categories</div>
                    <h3 className="mt-4 title">Explore by Location</h3>
                </div>

                <div className="wow fadeInUp" data-wow-delay=".2s">
                    <Swiper {...swiperParams} className="tf-sw-categories">
                        <div className="swiper-wrapper">
                            {categories.map((category) => (
                                <SwiperSlide key={category.id}>
                                    <CategoryCard category={category} />
                                </SwiperSlide>
                            ))}
                        </div>

                        {/* Custom Pagination */}
                        <div className="sw-pagination sw-pagination-categories text-center"></div>

                        {/* Navigation Buttons */}
                        <div className="swiper-navigation">
                            <button
                                className="swiper-button-prev"
                                onClick={() => swiperRef.current?.slidePrev()}
                                aria-label="Previous slide"
                            >
                                <i className="icon icon-arrow-left2"></i>
                            </button>
                            <button
                                className="swiper-button-next"
                                onClick={() => swiperRef.current?.slideNext()}
                                aria-label="Next slide"
                            >
                                <i className="icon icon-arrow-right2"></i>
                            </button>
                        </div>
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

// Category Card Component
const CategoryCard = ({ category }) => {
    const { name, image, propertyCount, link } = category;

    const handleImageError = (e) => {
        e.target.src = 'images/location/location-1.jpg'; // Fallback image
    };

    return (
        <div className="box-category">
            <a href={link} className="image img-style">
                <img
                    className="lazyload"
                    data-src={image}
                    src={image}
                    alt={`Properties in ${name}`}
                    onError={handleImageError}
                />
                <div className="category-overlay"></div>
            </a>
            <div className="content">
                <div className="inner-left">
                    <span className="sub-title fw-6">{propertyCount}</span>
                    <h6 className="title text-line-clamp-1 link">{name}</h6>
                </div>
                <a href={link} className="box-icon line w-44 round" aria-label={`View properties in ${name}`}>
                    <ArrowIcon />
                </a>
            </div>
        </div>
    );
};

// Arrow Icon Component
const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3.3335 8H12.6668"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8 3.33331L12.6667 7.99998L8 12.6666"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default PropertyCategories;