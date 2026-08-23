import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Phone, Camera, Upload, Loader2, CheckCircle2,
  Calendar, Mail, Building, Users, FileText, ShieldCheck,
  ArrowRight, Sparkles, Check, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import { db } from './Firebase/Firebase';
import { collection, addDoc, doc, serverTimestamp, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from './Firebase/Firebase';
import { createAgentAccount, generateAgentPassword } from './Firebase/agentHelpers';
import { sendCredentialsViaEmail } from './Firebase/emailService';
import { uploadToCloudinary } from './Firebase/cloudinaryService';
import { sanitizeObject } from '../utils/security';
import './JoinAsPartner.css';
import Breadcrumb from './About/Breadcrumb';

const JoinAsPartner = () => {
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);
  const [activeStep, setActiveStep] = useState(1);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    firstName: '',
    lastName: '',
    fatherHusbandName: '',
    fatherHusbandLastName: '',
    dob: '',
    localAddressLine: '',
    localCity: '',
    localState: '',
    localPinCode: '',
    email: '',
    mobile1: '',
    mobile2: '',
    aadhaarCardNo: '',
    reference: '',
    department: '',
    leaderName: '',
    referralCode: '',
  });

  const [files, setFiles] = useState({ photograph: null, aadhaarCard: null });
  const [previews, setPreviews] = useState({ photograph: null, aadhaarCard: null });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ referralCode: '', email: '' });
  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const scrollToSection = (sectionId, stepNum) => {
    setActiveStep(stepNum);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCheckboxClick = (e) => {
    e.preventDefault();
    if (agreed) {
      setAgreed(false);
    } else {
      setShowTermsModal(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles && uploadedFiles[0]) {
      const selectedFile = uploadedFiles[0];
      setFiles(prev => ({ ...prev, [name]: selectedFile }));
      setPreviews(prev => ({
        ...prev,
        [name]: URL.createObjectURL(selectedFile)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate form submission triggers
    if (isSubmittingRef.current || loading) return;
    
    if (!formData.firstName || !formData.mobile1 || !formData.referralCode) {
      alert("First Name, Mobile Number, and Referral Code are required.");
      return;
    }
    
    setErrors({ referralCode: '', email: '' });
    isSubmittingRef.current = true;
    setLoading(true);
    setUploadProgress(0);

    try {
      // Validate referral code exists
      const referralQuery = query(
        collection(db, 'agents'), 
        where('ownReferralCode', '==', formData.referralCode.trim())
      );
      const referralSnapshot = await getDocs(referralQuery);
      if (referralSnapshot.empty) {
        setErrors(prev => ({ ...prev, referralCode: 'Invalid referral code. Please enter a valid associate code.' }));
        isSubmittingRef.current = false;
        setLoading(false);
        return;
      }

      // Validate email is not already used
      const loginId = formData.email.trim().toLowerCase();
      
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, loginId);
        if (signInMethods.length > 0) {
          setErrors(prev => ({ ...prev, email: 'Email ID already registered. Please use another email.' }));
          isSubmittingRef.current = false;
          setLoading(false);
          return;
        }
      } catch (authError) {
        console.error('Auth check error:', authError);
      }
      
      const emailAgentsQuery = query(collection(db, 'agents'), where('loginId', '==', loginId));
      const emailAgentsSnapshot = await getDocs(emailAgentsQuery);
      if (!emailAgentsSnapshot.empty) {
        setErrors(prev => ({ ...prev, email: 'Email ID already registered. Please use another email.' }));
        isSubmittingRef.current = false;
        setLoading(false);
        return;
      }

      let photographUrl = '';
      let aadhaarCardUrl = '';

      const totalFiles = (files.photograph ? 1 : 0) + (files.aadhaarCard ? 1 : 0);
      let uploadedCount = 0;

      const updateOverallProgress = (p) => {
        const fileShare = 100 / (totalFiles || 1);
        const currentTotalProgress = (uploadedCount * fileShare) + (p * fileShare / 100);
        setUploadProgress(Math.min(95, Math.round(currentTotalProgress)));
      };

      if (files.photograph) {
        photographUrl = await uploadToCloudinary(files.photograph, updateOverallProgress, { isDocument: false, maxWidth: 1200 });
        uploadedCount++;
      }
      if (files.aadhaarCard) {
        aadhaarCardUrl = await uploadToCloudinary(files.aadhaarCard, updateOverallProgress, { isDocument: true, maxWidth: 1920 });
        uploadedCount++;
      }

      setUploadProgress(95);

      const sanitizedFormData = sanitizeObject(formData);
      const password = generateAgentPassword();

      const partnerRef = await addDoc(collection(db, 'partnerRequests'), {
        ...sanitizedFormData,
        photographUrl,
        aadhaarCardUrl,
        loginId,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      setUploadProgress(97);

      const { uid, agentId, ownReferralCode } = await createAgentAccount({
        email: loginId,
        password,
        formData: sanitizedFormData,
        photographUrl,
        aadhaarCardUrl,
        partnerRequestId: partnerRef.id,
      });

      await updateDoc(partnerRef, { agentUid: uid, agentId, ownReferralCode });
      setUploadProgress(99);

      const fullName = [sanitizedFormData.firstName, sanitizedFormData.lastName].filter(Boolean).join(' ');
      const emailResult = await sendCredentialsViaEmail(loginId, password, fullName);

      await updateDoc(doc(db, 'agents', uid), {
        credentialsSentAt: serverTimestamp(),
        emailDeliveryStatus: emailResult.success ? 'sent' : 'failed',
      });

      setUploadProgress(100);
      setSubmitted(true);

      setFormData({
        date: new Date().toISOString().split('T')[0], firstName: '', lastName: '',
        fatherHusbandName: '', fatherHusbandLastName: '',
        dob: '', localAddressLine: '', localCity: '', localState: '', localPinCode: '',
        email: '', mobile1: '', mobile2: '', aadhaarCardNo: '',
        reference: '', department: '', leaderName: '', referralCode: '',
      });
      setFiles({ photograph: null, aadhaarCard: null });
      setPreviews({ photograph: null, aadhaarCard: null });
      setAgreed(false);

      setTimeout(() => navigate('/thank-you', {
        state: { loginId, emailSent: emailResult.success, associateId: agentId, agentId, ownReferralCode, associateName: fullName },
      }), 500);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (
        error.code === 'auth/email-already-in-use' || 
        error.code === 'auth/email-already-exists'
      ) {
        setErrors(prev => ({ ...prev, email: 'Email ID already registered. Please use another email.' }));
      }
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="partner-wrapper">
      <Breadcrumb />

      {/* Hero Header Banner */}
      <div className="partner-hero-banner text-center">
        <div className="container">
          <div className="partner-badge-pill">
            <Sparkles size={14} className="me-2 text-primary-accent" />
            <span>PARTNER NETWORK</span>
          </div>
          <h1 className="partner-hero-title mt-3">
            Join As <span className="highlight">Associate Channel Partner</span>
          </h1>
          <p className="partner-hero-subtitle">
            Empower your potential with SOS Infra's elite channel partner network.
          </p>

          {/* Interactive Steps Navigation Bar */}
          <div className="partner-steps-chips mt-4 d-none d-md-flex justify-content-center gap-3">
            <button 
              type="button"
              onClick={() => scrollToSection('sec-personal', 1)}
              className={`step-chip ${activeStep === 1 ? 'active' : ''}`}
            >
              <span className="step-num">01</span> Personal Info
            </button>

            <button 
              type="button"
              onClick={() => scrollToSection('sec-professional', 2)}
              className={`step-chip ${activeStep === 2 ? 'active' : ''}`}
            >
              <span className="step-num">02</span> Professional
            </button>

            <button 
              type="button"
              onClick={() => scrollToSection('sec-address', 3)}
              className={`step-chip ${activeStep === 3 ? 'active' : ''}`}
            >
              <span className="step-num">03</span> Address
            </button>

            <button 
              type="button"
              onClick={() => scrollToSection('sec-contact', 4)}
              className={`step-chip ${activeStep === 4 ? 'active' : ''}`}
            >
              <span className="step-num">04</span> Contact
            </button>
          </div>
        </div>
      </div>

      <section className="container partner-form-section">
        {submitted && (
          <div className="partner-success-banner" role="alert">
            <CheckCircle2 size={24} className="flex-shrink-0 text-success" />
            <div>
              <strong>Application Submitted Successfully!</strong>
              <p className="mb-0">Redirecting to confirmation page...</p>
            </div>
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="partner-main-card">
              <form onSubmit={handleSubmit} noValidate>

                {/* Section 1: Basic & Personal Info */}
                <div className="partner-form-block" id="sec-personal">
                  <div className="partner-block-header">
                    <div className="partner-section-badge">01</div>
                    <div className="partner-header-icon">
                      <User size={22} />
                    </div>
                    <div>
                      <h3 className="partner-block-title">Personal Information</h3>
                      <p className="partner-block-subtitle">Provide your primary details and identification</p>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          <Calendar size={15} className="me-2 text-accent" />
                          Application Date
                        </label>
                        <input 
                          type="date" 
                          className="partner-input" 
                          name="date" 
                          value={formData.date} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    {/* Passport Photograph Upload */}
                    <div className="col-md-6">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          <Camera size={15} className="me-2 text-accent" />
                          Passport Photograph <span className="required-star">*</span>
                        </label>
                        
                        <input 
                          type="file" 
                          id="photo-camera-input" 
                          name="photograph" 
                          accept="image/*" 
                          capture="user"
                          onChange={handleFileChange} 
                          className="d-none" 
                        />
                        <input 
                          type="file" 
                          id="photo-gallery-input" 
                          name="photograph" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="d-none" 
                        />

                        <div className={`partner-upload-card ${previews.photograph ? 'has-file' : ''}`}>
                          {previews.photograph ? (
                            <div className="upload-file-active">
                              <img src={previews.photograph} alt="Photograph Preview" className="upload-preview-img" />
                              <div className="upload-file-details">
                                <span className="upload-file-status"><Check size={14} className="me-1" /> Photo Uploaded</span>
                                <div className="upload-action-buttons mt-2">
                                  <label htmlFor="photo-camera-input" className="btn-upload-sub btn-camera">
                                    <Camera size={13} className="me-1" /> Camera
                                  </label>
                                  <label htmlFor="photo-gallery-input" className="btn-upload-sub btn-gallery">
                                    <ImageIcon size={13} className="me-1" /> Gallery
                                  </label>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="upload-options-grid">
                              <label htmlFor="photo-camera-input" className="upload-option-btn option-camera">
                                <Camera size={20} className="option-icon" />
                                <span>Take Photo</span>
                                <small>(Camera)</small>
                              </label>
                              <label htmlFor="photo-gallery-input" className="upload-option-btn option-gallery">
                                <Upload size={20} className="option-icon" />
                                <span>Choose Image</span>
                                <small>(Gallery / Files)</small>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          First Name <span className="required-star">*</span>
                        </label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="Enter first name" 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="partner-field-group">
                        <label className="partner-label">Last Name</label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="Enter last name" 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    {/* Sub-block: Father / Husband */}
                    <div className="col-12 mt-4">
                      <div className="partner-sub-card">
                        <div className="partner-sub-header">
                          <Users size={16} className="me-2 text-accent" />
                          <span>Father / Husband Details</span>
                        </div>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="partner-field-group">
                              <label className="partner-label">First Name</label>
                              <input 
                                type="text" 
                                className="partner-input" 
                                placeholder="Father / Husband first name" 
                                name="fatherHusbandName" 
                                value={formData.fatherHusbandName} 
                                onChange={handleChange} 
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="partner-field-group">
                              <label className="partner-label">Last Name</label>
                              <input 
                                type="text" 
                                className="partner-input" 
                                placeholder="Father / Husband last name" 
                                name="fatherHusbandLastName" 
                                value={formData.fatherHusbandLastName} 
                                onChange={handleChange} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mt-3">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          <Calendar size={15} className="me-2 text-accent" />
                          Date of Birth
                        </label>
                        <input 
                          type="date" 
                          className="partner-input" 
                          name="dob" 
                          value={formData.dob} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    {/* Aadhaar Card Document Upload */}
                    <div className="col-md-6 mt-3">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          <FileText size={15} className="me-2 text-accent" />
                          Aadhaar Card Document <span className="required-star">*</span>
                        </label>

                        <input 
                          type="file" 
                          id="aadhaar-camera-input" 
                          name="aadhaarCard" 
                          accept="image/*" 
                          capture="environment"
                          onChange={handleFileChange} 
                          className="d-none" 
                        />
                        <input 
                          type="file" 
                          id="aadhaar-gallery-input" 
                          name="aadhaarCard" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="d-none" 
                        />

                        <div className={`partner-upload-card ${previews.aadhaarCard ? 'has-file' : ''}`}>
                          {previews.aadhaarCard ? (
                            <div className="upload-file-active">
                              <img src={previews.aadhaarCard} alt="Aadhaar Preview" className="upload-preview-img" />
                              <div className="upload-file-details">
                                <span className="upload-file-status"><Check size={14} className="me-1" /> Aadhaar Uploaded</span>
                                <div className="upload-action-buttons mt-2">
                                  <label htmlFor="aadhaar-camera-input" className="btn-upload-sub btn-camera">
                                    <Camera size={13} className="me-1" /> Camera
                                  </label>
                                  <label htmlFor="aadhaar-gallery-input" className="btn-upload-sub btn-gallery">
                                    <ImageIcon size={13} className="me-1" /> Gallery
                                  </label>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="upload-options-grid">
                              <label htmlFor="aadhaar-camera-input" className="upload-option-btn option-camera">
                                <Camera size={20} className="option-icon" />
                                <span>Capture Doc</span>
                                <small>(Camera)</small>
                              </label>
                              <label htmlFor="aadhaar-gallery-input" className="upload-option-btn option-gallery">
                                <Upload size={20} className="option-icon" />
                                <span>Choose Document</span>
                                <small>(Gallery / Files)</small>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Professional Details */}
                <div className="partner-form-block" id="sec-professional">
                  <div className="partner-block-header">
                    <div className="partner-section-badge">02</div>
                    <div className="partner-header-icon">
                      <Building size={22} />
                    </div>
                    <div>
                      <h3 className="partner-block-title">Professional Details</h3>
                      <p className="partner-block-subtitle">Reference and channel partnership details</p>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          <Users size={15} className="me-2 text-accent" />
                          Referral Code <span className="required-star">*</span>
                        </label>
                        <input 
                          type="text" 
                          className={`partner-input ${errors.referralCode ? 'is-invalid-input' : ''}`}
                          placeholder="Enter Referral Code" 
                          name="referralCode" 
                          value={formData.referralCode} 
                          onChange={handleChange} 
                          required 
                        />
                        {errors.referralCode && (
                          <div className="partner-error-text mt-1">
                            <AlertCircle size={14} className="me-1 flex-shrink-0" />
                            <span>{errors.referralCode}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="partner-field-group">
                        <label className="partner-label">Reference</label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="Enter Reference (if any)" 
                          name="reference" 
                          value={formData.reference} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="partner-field-group">
                        <label className="partner-label">Department</label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="Department" 
                          name="department" 
                          value={formData.department} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="partner-field-group">
                        <label className="partner-label">Leader Name</label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="Leader Name" 
                          name="leaderName" 
                          value={formData.leaderName} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Address Information */}
                <div className="partner-form-block" id="sec-address">
                  <div className="partner-block-header">
                    <div className="partner-section-badge">03</div>
                    <div className="partner-header-icon">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <h3 className="partner-block-title">Address Information</h3>
                      <p className="partner-block-subtitle">Your current residential / business address</p>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <div className="partner-field-group">
                        <label className="partner-label">Address Line</label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="Street address, house no., building name" 
                          name="localAddressLine" 
                          value={formData.localAddressLine} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="partner-field-group">
                        <label className="partner-label">City</label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="City" 
                          name="localCity" 
                          value={formData.localCity} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="partner-field-group">
                        <label className="partner-label">State</label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="State" 
                          name="localState" 
                          value={formData.localState} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="partner-field-group">
                        <label className="partner-label">Pin Code</label>
                        <input 
                          type="text" 
                          className="partner-input" 
                          placeholder="Pin Code" 
                          name="localPinCode" 
                          value={formData.localPinCode} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Contact Details */}
                <div className="partner-form-block" id="sec-contact">
                  <div className="partner-block-header">
                    <div className="partner-section-badge">04</div>
                    <div className="partner-header-icon">
                      <Phone size={22} />
                    </div>
                    <div>
                      <h3 className="partner-block-title">Contact Details</h3>
                      <p className="partner-block-subtitle">How can our team reach out to you</p>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          <Mail size={15} className="me-2 text-accent" />
                          Email ID
                        </label>
                        <input 
                          type="email" 
                          className={`partner-input ${errors.email ? 'is-invalid-input' : ''}`}
                          placeholder="name@example.com" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                        />
                        {errors.email && (
                          <div className="partner-error-text mt-1">
                            <AlertCircle size={14} className="me-1 flex-shrink-0" />
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          <Phone size={15} className="me-2 text-accent" />
                          Mobile Number 1 <span className="required-star">*</span>
                        </label>
                        <input 
                          type="tel" 
                          className="partner-input" 
                          placeholder="10-digit mobile number" 
                          name="mobile1" 
                          value={formData.mobile1} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="partner-field-group">
                        <label className="partner-label">
                          <Phone size={15} className="me-2 text-accent" />
                          Mobile Number 2
                        </label>
                        <input 
                          type="tel" 
                          className="partner-input" 
                          placeholder="Alternate mobile (optional)" 
                          name="mobile2" 
                          value={formData.mobile2} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submission Progress Bar */}
                {loading && (
                  <div className="partner-submit-progress">
                    <div className="progress-info-row mb-2">
                      <span className="progress-title">Uploading Documents & Registering</span>
                      <span className="progress-count">{uploadProgress}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Terms Agreement & Submission CTA */}
                <div className="partner-footer-action">
                  <div className="terms-checkbox-wrapper mb-4">
                    <label className="terms-custom-label" onClick={handleCheckboxClick}>
                      <input
                        type="checkbox"
                        className="terms-checkbox-input"
                        checked={agreed}
                        onChange={() => {}}
                      />
                      <span className="terms-text">
                        I agree with the{" "}
                        <button
                          type="button"
                          className="terms-inline-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTermsModal(true);
                          }}
                        >
                          Terms and Conditions
                        </button>
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !agreed} 
                    className="partner-btn-submit"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="spinner-rotate me-2" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight size={20} className="ms-2" />
                      </>
                    )}
                  </button>

                  <div className="partner-security-badge mt-3">
                    <ShieldCheck size={16} className="text-success me-2" />
                    <span>Your data is encrypted & protected with 256-bit SSL</span>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="terms-modal-backdrop" onClick={() => setShowTermsModal(false)}>
          <div className="terms-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="terms-modal-header">
              <div className="d-flex align-items-center gap-2">
                <FileText size={20} className="text-accent" />
                <h3 className="mb-0">नियम और शर्तें</h3>
              </div>
              <button 
                type="button" 
                className="terms-close-btn" 
                onClick={() => setShowTermsModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="terms-modal-body">
              <div className="terms-content-scroll">
                <h4>1. नियमों की स्वीकृति</h4>
                <p>
                  इस वेबसाइट का उपयोग करके, आप इन नियमों और शर्तों से बंधे रहने के लिए सहमत हैं। यदि आप सहमत नहीं हैं, तो कृपया इस साइट का उपयोग करने से बचें।
                </p>

                <h4>2. वेबसाइट की जानकारी</h4>
                <p>
                  यह वेबसाइट SOS इंफ्राबुल्स इंटरनेशनल प्राइवेट लिमिटेड (स्थापना 02 जून 2019) द्वारा संचालित है। इंदौर में आवासीय, व्यावसायिक और औद्योगिक भूमि विकास से संबंधित परियोजना विवरण, निवेश के अवसर और विवरण सहित सभी सामग्री केवल सूचनात्मक उद्देश्यों के लिए है।
                </p>

                <h4>3. कोई गारंटी नहीं</h4>
                <p>
                  जबकि SOS इंफ्राबुल्स सटीकता के लिए प्रयास करता है, सभी जानकारी, जिसमें रणनीतिक मूल्य, दीर्घकालिक मूल्यांकन (appreciation) और निवेश सुरक्षा से संबंधित विवरण शामिल हैं, बिना किसी पूर्व सूचना के परिवर्तन के अधीन हैं और यह किसी कानूनी प्रतिबद्धता, गारंटी या वारंटी का गठन नहीं करते हैं।
                </p>

                <h4>4. निवेश और कानूनी सलाह</h4>
                <p>
                  इस वेबसाइट पर दी गई सामग्री पेशेवर निवेश, वित्तीय या कानूनी सलाह नहीं है। उपयोगकर्ताओं को दृढ़ता से सलाह दी जाती है कि वे कोई भी रियल एस्टेट या निवेश निर्णय लेने से पहले स्वतंत्र रूप से जांच (due diligence) करें और योग्य पेशेवरों से परामर्श लें।
                </p>

                <h4>5. दायित्व की सीमा</h4>
                <p>
                  SOS इंफ्राबुल्स इंटरनेशनल प्राइवेट लिमिटेड इस वेबसाइट पर प्रदान की गई जानकारी के उपयोग या उस पर निर्भरता से उत्पन्न होने वाले किसी भी प्रत्यक्ष, अप्रत्यक्ष या परिणामी नुकसान या क्षति के लिए उत्तरदायी नहीं होगा।
                </p>

                <h4>6. बाहरी लिंक</h4>
                <p>
                  इस वेबसाइट में तीसरे पक्ष (third-party) की साइटों के लिंक हो सकते हैं। SOS इंफ्राबुल्स इन बाहरी साइटों की सामग्री, सटीकता या प्रथाओं के लिए ज़िम्मेदार नहीं है।
                </p>

                <h4>7. संशोधन</h4>
                <p>
                  SOS इंफ्राबुल्स के पास किसी भी समय इन नियमों और शर्तों को संशोधित करने का अधिकार सुरक्षित है। बदलाव वेबसाइट पर पोस्ट होते ही तुरंत प्रभावी होंगे। आपका निरंतर उपयोग संशोधित शर्तों की स्वीकृति माना जाएगा।
                </p>

                <h4>8. लागू कानून</h4>
                <p>
                  ये नियम और शर्तें भारत के कानूनों के अनुसार शासित और विश्लेषित होंगी। किसी भी विवाद का निपटारा विशेष रूप से इंदौर, मध्य प्रदेश के न्यायालयों के क्षेत्राधिकार के अधीन होगा।
                </p>

                <h4>संपर्क</h4>
                <p>
                  इन शर्तों के संबंध में किसी भी प्रश्न के लिए, कृपया हमें आधिकारिक ईमेल <a href="mailto:info@sosinfrabulls.com">info@sosinfrabulls.com</a> पर संपर्क करें।
                </p>
              </div>
            </div>
            <div className="terms-modal-footer">
              <button 
                type="button" 
                className="terms-btn-decline" 
                onClick={() => setShowTermsModal(false)}
              >
                रद्द करें
              </button>
              <button 
                type="button" 
                className="terms-btn-accept" 
                onClick={() => {
                  setAgreed(true);
                  setShowTermsModal(false);
                }}
              >
                मैं सहमत हूँ और स्वीकार करता हूँ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinAsPartner;
