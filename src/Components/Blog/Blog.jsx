import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import "./blog.css";
import Breadcrumb from "./Breadcrumb";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firestore listener
    const blogRef = collection(db, "blogs");
    const blogQuery = query(blogRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      blogQuery,
      (snapshot) => {
        const records = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(records);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Tilt effect
    const cards = document.querySelectorAll(".blog-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        card.style.transform = `
          rotateX(${-(y / 18)}deg)
          rotateY(${x / 18}deg)
          scale(1.03)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0) rotateY(0) scale(1)";
      });
    });

    // Scroll reveal
    const revealElements = document.querySelectorAll(".reveal");

    const handleScroll = () => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight - 80) {
          el.classList.add("reveal-visible");
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [blogs]);

  return (
    <>
      <Breadcrumb />
      <section className="flat-section py-5">
        {/* <div className="container">

          <div className="box-title text-center reveal mb-5">
            <div className="text-subtitle text-primary">Our Blog</div>
            <h3 className="mt-4 title">Latest Articles & Insights</h3>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="loading-spinner mx-auto mb-3" />
              <p>Loading blog posts...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5 reveal">
              <h4>No blog posts yet</h4>
              <p>New stories will appear here as soon as they are published.</p>
            </div>
          ) : (
            <div className="row g-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="col-lg-4 col-md-6 reveal">
                  <a
                    href={blog.ctaUrl || "#"}
                    target={blog.ctaUrl ? "_blank" : "_self"}
                    rel={blog.ctaUrl ? "noreferrer" : undefined}
                    className="blog-card"
                  >
                    <div className="blog-img">
                      <img
                        src={blog.image || "/images/blog/blog-1.jpg"}
                        alt={blog.title}
                      />
                      {blog.date && (
                        <span className="blog-date">{blog.date}</span>
                      )}
                    </div>

                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="author fw-bold">
                          {blog.author || "SOS Infrabulls"}
                        </span>
                        <span className="category">
                          {blog.category || "Updates"}
                        </span>
                      </div>

                      <h5 className="blog-title">{blog.title}</h5>
                      <p className="blog-desc">{blog.excerpt}</p>
                    </div>
                  </a>
                </div>
              ))}

              <div className="col-12 text-center pt-4 reveal">
                <p className="text-muted">
                  Showing {blogs.length} blog{blogs.length > 1 ? "s" : ""}. More
                  stories arrive as you publish them.
                </p>
              </div>
            </div>
          )}
        </div> */}
        <section className="vlogs-coming-section light">
          <div className="container">
            <div className="vlogs-content">
             

              <h2 className="vlogs-title">
                Blogs are coming soon
              </h2>

              <p className="vlogs-subtitle">
                We are preparing refined video content including
                walkthroughs, expert insights, and on-ground experiences.
                <br />
                Crafted with quality. Released with purpose.
              </p>

              <div className="vlogs-divider"></div>

             
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
