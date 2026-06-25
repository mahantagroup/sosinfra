import React from "react";

const faqData = [
  {
    id: "one",
    question: "Why should I use your services?",
    answer:
      "Once your account is set up and you've familiarized yourself with the platform, you are ready to start using our services. Whether it's accessing specific features, making transactions, or utilizing our tools, you'll find everything you need at your fingertips.",
    open: false,
  },
  {
    id: "two",
    question: "How do I get started with your services?",
    answer:
      "Once your account is set up and you've familiarized yourself with the platform, you are ready to start using our services. Whether it's accessing specific features, making transactions, or utilizing our tools, you'll find everything you need at your fingertips.",
    open: true,
  },
  {
    id: "three",
    question: "How secure are your services?",
    answer:
      "Once your account is set up and you've familiarized yourself with the platform, you are ready to start using our services. Whether it's accessing specific features, making transactions, or utilizing our tools, you'll find everything you need at your fingertips.",
    open: false,
  },
  {
    id: "four",
    question: "Is there customer support available?",
    answer:
      "Once your account is set up and you've familiarized yourself with the platform, you are ready to start using our services. Whether it's accessing specific features, making transactions, or utilizing our tools, you'll find everything you need at your fingertips.",
    open: false,
  },
  {
    id: "five",
    question: "How can I update my account information?",
    answer:
      "Once your account is set up and you've familiarized yourself with the platform, you are ready to start using our services. Whether it's accessing specific features, making transactions, or utilizing our tools, you'll find everything you need at your fingertips.",
    open: false,
  },
];

const FaqSection = () => {
  return (
    <section className="flat-section">
      <div className="container">
        <div className="tf-faq">
          {/* Section Title */}
          <div className="box-title text-center wow fadeInUp">
            <div className="text-subtitle text-primary">Faqs</div>
            <h3 className="mt-4 title">Frequently Asked Questions</h3>
          </div>

          {/* FAQ List */}
          <ul className="box-faq" id="wrapper-faq">
            {faqData.map((item) => (
              <li
                className={`faq-item ${item.open ? "active" : ""}`}
                key={item.id}
              >
                <a
                  href={`#accordion-faq-${item.id}`}
                  className={`faq-header ${item.open ? "" : "collapsed"}`}
                  data-bs-toggle="collapse"
                  aria-expanded={item.open ? "true" : "false"}
                  aria-controls={`accordion-faq-${item.id}`}
                >
                  {item.question}
                </a>

                <div
                  id={`accordion-faq-${item.id}`}
                  className={`collapse ${item.open ? "show" : ""}`}
                  data-bs-parent="#wrapper-faq"
                >
                  <p className="faq-body">{item.answer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
