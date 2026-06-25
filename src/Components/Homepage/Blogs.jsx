import React, { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import "./Blogs.css";
import { Link } from "react-router-dom";

const BlogsSpotlight = () => {
    const [blogs, setBlogs] = useState([]);
    const cardsRef = useRef([]);

    useEffect(() => {
        const blogRef = collection(db, "blogs");
        const blogQuery = query(blogRef, orderBy("createdAt", "desc"), limit(3));

        const unsubscribe = onSnapshot(blogQuery, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBlogs(data);

            setTimeout(() => handleScrollEffect(), 150);
        });

        return () => unsubscribe();
    }, []);

    /* ------------------------------
        Scroll-based card rotation
    ------------------------------ */
    const handleScrollEffect = () => {
        const onScroll = () => {
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                const rect = card.getBoundingClientRect();
                const windowH = window.innerHeight;

                const progress = (rect.top - windowH * 0.6) / windowH;
                const clamp = Math.max(-1, Math.min(1, progress));

                let rotateX = 0;
                let rotateY = 0;

                if (index === 0) rotateY = clamp * 20; // Left card rotates Y
                if (index === 1) rotateX = clamp * -15; // Middle rotates X
                if (index === 2) rotateY = clamp * -20; // Right rotates opposite Y

                card.style.transform = `
                    perspective(1200px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(${clamp * 40}px)
                    translateZ(${clamp * -60}px)
                `;
                card.style.opacity = `${1 - Math.abs(clamp * 0.8)}`;
            });
        };

        window.addEventListener("scroll", onScroll);
        onScroll();
    };

    return (
        <section className="homepage-blogs">
            <div className="container">
                <div className="box-title text-center">
                    <div className="text-subtitle text-primary">Insights from SOS Infrabulls</div>
                    <h3 className="mt-4 title">Latest blog highlights</h3>
                </div>

                <div className="blogs-premium-grid">
                    {blogs.map((blog, idx) => (
                        <article
                            key={blog.id}
                            className="premium-blog-card"
                            ref={(el) => (cardsRef.current[idx] = el)}
                        >
                            <div className="premium-card-image">
                                <img src={blog.image || "/images/blog/blog-1.jpg"} alt={blog.title} />
                                {blog.category && <span>{blog.category}</span>}
                            </div>

                            <div className="premium-card-body">
                                <p className="blog-meta">
                                    {blog.author || "SOS Infrabulls"} · {blog.date || "Recent update"}
                                </p>
                                <h3 className="blog-title">{blog.title}</h3>
                                
                                <Link
                                    to={blog.ctaUrl || "/blog"}
                                    className="premium-blog-link"
                                    target={blog.ctaUrl ? "_blank" : "_self"}
                                >
                                    Continue reading →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogsSpotlight;
