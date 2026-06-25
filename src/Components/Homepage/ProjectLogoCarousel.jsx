import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "./ProjectLogoCarousel.css";

const ProjectLogoCarousel = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const snap = await getDocs(collection(db, "projects"));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

            const valid = data.filter(project => project.logo || project.image);

            setProjects(valid);
            setLoading(false);
        };

        fetchProjects();
    }, []);

    if (loading || projects.length === 0) return null;

    return (
        <section className="project-logo-carousel-section">
            <Swiper
                modules={[Autoplay]}
                loop={true}
                speed={1000}          // smooth continuous motion
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                }}
                slidesPerView={5}      // ⭐ 5 cards on large screens
                spaceBetween={0}
                allowTouchMove={false}
                breakpoints={{
                    0: { slidesPerView: 3 },
                    480: { slidesPerView: 4 },
                    768: { slidesPerView: 5 },
                    1024: { slidesPerView: 7 },
                }}
            >
                {projects.map(project => (
                    <SwiperSlide
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="ticker-slide"
                    >
                        <div className="carousel-item">
                            <img
                                src={project.logo || project.image}
                                alt={project.title}
                                className="project-logo"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default ProjectLogoCarousel;
