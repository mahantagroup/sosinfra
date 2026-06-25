import React, { useRef, useState } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Home,
  LogIn,
  Award,
  Download,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import html2canvas from "html2canvas";
import Certificate from "./Certificate";
import "./ThankYou.css";

const ThankYou = () => {
  const { state } = useLocation();
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const loginId = state?.loginId;
  const emailSent = state?.emailSent;

  // These values will come from backend later
  const associateName = state?.associateName || "Associate";
  const associateId = state?.associateId || "Pending";
  const certificateNumber =
    state?.certificateNumber || "SOS-ACP-2026-000001";
  const joiningDate =
    state?.joiningDate ||
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  const leaderName = state?.leaderName || "";
  const ownReferralCode = state?.ownReferralCode || "";
  const department = state?.department || "";
  const photographUrl = state?.photographUrl || "";

  const certificateUrl = state?.certificateUrl || "#";

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = certificateRef.current;
      
      // Capture the certificate as canvas
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${associateName.replace(/\s+/g, '_')}_certificate.png`;
      link.href = imgData;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate certificate. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="premium-page-wrapper d-flex align-items-center justify-content-center min-h-screen">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-xl-6">

            <div className="premium-thankyou-card card text-center">

              {/* Success Icon */}

              <div className="flex-center mb-4">
                <div className="success-icon-wrapper">
                  <CheckCircle2
                    size={64}
                    className="success-checkmark-icon"
                  />
                </div>
              </div>

              <h1 className="premium-main-heading mb-3">
                Welcome to the SOS Infrabulls Family!
              </h1>

              <p className="premium-message-text mb-4">
                Congratulations!
                <br />
                Your Associate Partner registration has been completed
                successfully.
                <br />
                Thank you for choosing to grow with SOS Infrabulls.
              </p>

              {/* LOGIN DETAILS */}

              <div className="premium-credentials-box text-start mb-4">

                <p className="premium-box-title mb-2">
                  Agent Panel Login Credentials
                </p>

                {emailSent !== false ? (
                  <p className="premium-box-desc mb-0">
                    Your Login ID and temporary password have been sent to your
                    registered email
                    {loginId ? (
                      <>
                        {" "}
                        (<strong>{loginId}</strong>)
                      </>
                    ) : null}
                    . Please check your Inbox and Spam folder.
                  </p>
                ) : (
                  <p className="premium-box-desc text-danger-soft mb-0">
                    Your account has been created
                    {loginId ? (
                      <>
                        {" "}
                        with Login ID:
                        <strong> {loginId}</strong>
                      </>
                    ) : null}
                    . Email delivery failed. Please contact support.
                  </p>
                )}

                <p className="premium-box-footer mt-2 mb-0">
                  Login ID is your registered Email Address.
                </p>

              </div>

              {/* ============================== */}
              {/* NEW CERTIFICATE SECTION */}
              {/* ============================== */}

              <div className="premium-certificate-box">

                <div className="certificate-icon">
                  <Award size={46} />
                </div>

                <h3 className="certificate-title">
                  🎉 Your Associate Certificate is Ready
                </h3>

                <p className="certificate-description">
                  We are delighted to welcome you as an
                  <strong> Official Associate Channel Partner</strong> of
                  <strong> SOS Infrabulls.</strong>
                  <br />
                  Your personalized digital certificate has been generated
                  successfully and is now available for download.
                </p>

                <div className="certificate-details">

                  <div className="certificate-item">
                    <span>Name</span>
                    <strong>{associateName}</strong>
                  </div>

                  <div className="certificate-item">
                    <span>Associate ID</span>
                    <strong>{associateId}</strong>
                  </div>

                  <div className="certificate-item">
                    <span>Certificate No.</span>
                    <strong>{certificateNumber}</strong>
                  </div>

                  <div className="certificate-item">
                    <span>Joining Date</span>
                    <strong>{joiningDate}</strong>
                  </div>

                </div>

                {/* Hidden certificate for PDF generation */}
                <div style={{ position: 'absolute', left: '-9999px' }}>
                  <Certificate
                    ref={certificateRef}
                    fullName={associateName}
                  />
                </div>

                <div className="certificate-note">

                  <BadgeCheck size={18} />

                  <span>
                    This certificate has been digitally generated by
                    SOS Infrabulls and recognizes your successful enrollment as
                    an Associate Partner.
                  </span>

                </div>

                <button
                  onClick={handleDownloadCertificate}
                  disabled={isDownloading}
                  className="btn premium-download-btn mt-4"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download Certificate
                    </>
                  )}
                </button>

              </div>

              {/* BUTTONS */}

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">

                <Link
                  to="/agent/login"
                  className="btn premium-primary-action flex-center gap-2"
                >
                  <LogIn size={16} />
                  Go to Agent Login
                </Link>

                <Link
                  to="/"
                  className="btn premium-secondary-action flex-center gap-2"
                >
                  <Home size={16} />
                  Back to Home
                </Link>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;