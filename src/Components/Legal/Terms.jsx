import React from 'react';
import './Terms.css';

const Terms = () => {
  return (
    <section className="terms mt-5">
      <div className="container">
        <header className="terms__header" data-aos="fade-up">
          <h1>Terms and Conditions</h1>
          {/* <p className="terms__meta">Last updated: November 25, 2025</p> */}
        </header>

        <div className="terms__content">
          <article className="terms__card" data-aos="fade-up" data-aos-delay="50">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you agree to be bound by these
              Terms &amp; Conditions. If you do not agree, please refrain from using
              this site.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="100">
            <h2>2. Website Information</h2>
            <p>
              This website is operated by SOS Infrabulls International Pvt. Ltd. (established 02 June 2019).
              All content, including project details, investment opportunities,
              and descriptions related to residential, commercial, and industrial
              land development in Indore, is for informational purposes only.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="150">
            <h2>3. No Guarantees</h2>
            <p>
              While SOS Infrabulls strives for accuracy, all information, including
              statements regarding strategic value, long-term appreciation, and
              investment security, is subject to change without notice and does
              not constitute a legal commitment, guarantee, or warranty.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="200">
            <h2>4. Investment &amp; Legal Advice</h2>
            <p>
              The content on this website is not professional investment,
              financial, or legal advice. Users are strongly advised to conduct
              independent due diligence and consult with qualified professionals
              before making any real estate or investment decisions.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="250">
            <h2>5. Limitation of Liability</h2>
            <p>
              SOS Infrabulls International Pvt. Ltd. shall not be
              liable for any direct, indirect, or consequential loss or damage
              arising from the use of, or reliance on, the information provided
              on this website.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="300">
            <h2>6. External Links</h2>
            <p>
              This website may contain links to third-party sites. SOS Infrabulls
              is not responsible for the content, accuracy, or practices of these
              external sites.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="350">
            <h2>7. Modifications</h2>
            <p>
              SOS Infrabulls reserves the right to modify these Terms &amp;
              Conditions at any time. Changes will be effective immediately upon
              posting to the website. Your continued use constitutes acceptance
              of the revised terms.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="400">
            <h2>8. Governing Law</h2>
            <p>
              These Terms &amp; Conditions shall be governed by and construed in
              accordance with the laws of India. Any disputes shall be subject to
              the exclusive jurisdiction of the courts in Indore, Madhya Pradesh.
            </p>
          </article>

          <article className="terms__card" data-aos="fade-up" data-aos-delay="450">
            <h2>Contact</h2>
            <p>
              For any questions regarding these terms, please contact us through
              the official mail at
              <a className="terms__link" href="mailto:info@sosinfrabulls.com">
                {' '}info@sosinfrabulls.com
              </a>.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Terms;
