import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";
import Breadcrumb from "./Breadcrumb";
import { Link } from "react-router-dom";
import { sanitizeObject } from "../../utils/security";

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please agree to the Terms & Conditions to proceed.");
      return;
    }

    setIsSubmitting(true);

    const sanitizedData = sanitizeObject(formData);

    emailjs
      .send(
        "service_a3cw276g",
        "template_y529wi6",
        {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
        },
        "vEvugozjO3aQJD-Ic"
      )
      .then(
        () => {
          alert("Message sent successfully!");
          setIsSubmitting(false);
          setAgreed(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          alert("Failed to send message. Try again!");
          console.error(error);
          setIsSubmitting(false);
        }
      );
  };


  return (
    <div className="contact-wrapper mt-5">
      <Breadcrumb />

      <section className="container py-5">
        <div className="text-center mb-5">
          <span className="contact-badge">CONTACT US</span>
          <h1 className="contact-title mt-3">
            Let’s <span>Talk</span>
          </h1>
          <p className="contact-subtitle">
            We’d love to hear from you. Fill out the form and we’ll get back soon.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="contact-card">
              <h4 className="card-title mb-4">Send a Message</h4>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6">
                    <input type="email" className="form-control" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6">
                    <input type="tel" className="form-control" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Subject" name="subject" value={formData.subject} onChange={handleChange} />
                  </div>

                  <div className="col-12">
                    <textarea className="form-control" placeholder="Your Message" rows="4" name="message" value={formData.message} onChange={handleChange} required></textarea>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agree"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                      />
                      <label className="form-check-label" htmlFor="agree">
                        I agree to the{" "}
                        <Link to="/terms" target="_blank" rel="noopener noreferrer">
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>


                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting || !agreed}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>

                  </div>
                </div>
              </form>
            </div>
          </div>


          <div className="col-lg-4">
            <div className="contact-card h-100">
              <h4 className="card-title mb-4">Contact Details</h4>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <h6>Office Address</h6>
                  <p>
                    405 - Shagun Tower, AB Road<br />
                    Indore, 452001
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div>
                  <h6>Phone</h6>
                  <p>62629-62629</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <h6>Email</h6>
                  <p>info@sosinfrabulls.com</p>
                </div>
              </div>

              <div className="social-links mt-4">
                <a href="https://www.facebook.com/sosinfrabulls/" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="https://www.instagram.com/official_sosinfrabulls/" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="https://www.youtube.com/@SOS_Infrabulls" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
                <a href="https://www.linkedin.com/company/sos-infrabulls/" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSection;
