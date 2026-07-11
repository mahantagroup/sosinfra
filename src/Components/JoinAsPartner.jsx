import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Briefcase, MapPin, Phone, Camera, Upload, Loader2, CheckCircle2,
  Calendar, CreditCard, Mail, Building, Users, FileText, ShieldCheck,
  ArrowRight
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
  const [formData, setFormData] = useState({
    date: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fatherHusbandName: '',
    fatherHusbandMiddleName: '',
    fatherHusbandLastName: '',
    dob: '',
    localAddressLine: '',
    localCity: '',
    localState: '',
    localPinCode: '',
    permanentAddressLine: '',
    permanentCity: '',
    permanentState: '',
    permanentPinCode: '',
    email: '',
    mobile1: '',
    mobile2: '',
    panCardNo: '',
    aadhaarCardNo: '',
    reference: '',
    department: '',
    leaderName: '',
    planBy: '',
    referralCode: '',
  });

  const [files, setFiles] = useState({ photograph: null, panCard: null, aadhaarCard: null });
  const [previews, setPreviews] = useState({ photograph: null, panCard: null, aadhaarCard: null });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ referralCode: '', email: '' });
  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
      setPreviews(prev => ({
        ...prev,
        [name]: URL.createObjectURL(uploadedFiles[0])
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.mobile1 || !formData.referralCode) {
      alert("First Name, Mobile Number, and Referral Code are required.");
      return;
    }
    
    // Reset errors
    setErrors({ referralCode: '', email: '' });
    
    try {
      // Validate referral code exists
      const referralQuery = query(
        collection(db, 'agents'), 
        where('ownReferralCode', '==', formData.referralCode.trim())
      );
      const referralSnapshot = await getDocs(referralQuery);
      if (referralSnapshot.empty) {
        setErrors(prev => ({ ...prev, referralCode: 'Wrong referral ID' }));
        return;
      }

      // Validate email is not already used
      const loginId = formData.email.trim().toLowerCase();
      
      try {
        // Check from Firebase Authentication
        const signInMethods = await fetchSignInMethodsForEmail(auth, loginId);
        if (signInMethods.length > 0) {
          setErrors(prev => ({ ...prev, email: 'Email ID already exists, use different' }));
          return;
        }
      } catch (authError) {
        console.error('Auth check error:', authError);
      }
      
      // Also check Firestore agents collection for safety
      const emailAgentsQuery = query(collection(db, 'agents'), where('loginId', '==', loginId));
      const emailAgentsSnapshot = await getDocs(emailAgentsQuery);
      if (!emailAgentsSnapshot.empty) {
        setErrors(prev => ({ ...prev, email: 'Email ID already exists, use different' }));
        return;
      }

      // Proceed with submission
      setLoading(true);
      setUploadProgress(0);

      let photographUrl = '';
      let panCardUrl = '';
      let aadhaarCardUrl = '';

      const totalFiles = (files.photograph ? 1 : 0) + (files.panCard ? 1 : 0) + (files.aadhaarCard ? 1 : 0);
      let uploadedCount = 0;

      const updateOverallProgress = (p) => {
        const fileShare = 100 / (totalFiles || 1);
        const currentTotalProgress = (uploadedCount * fileShare) + (p * fileShare / 100);
        setUploadProgress(Math.min(95, Math.round(currentTotalProgress)));
      };

      if (files.photograph) {
        photographUrl = await uploadToCloudinary(files.photograph, updateOverallProgress);
        uploadedCount++;
      }
      if (files.panCard) {
        panCardUrl = await uploadToCloudinary(files.panCard, updateOverallProgress);
        uploadedCount++;
      }
      if (files.aadhaarCard) {
        aadhaarCardUrl = await uploadToCloudinary(files.aadhaarCard, updateOverallProgress);
        uploadedCount++;
      }

      setUploadProgress(95);

      const sanitizedFormData = sanitizeObject(formData);
      const password = generateAgentPassword();

      const partnerRef = await addDoc(collection(db, 'partnerRequests'), {
        ...sanitizedFormData,
        photographUrl,
        panCardUrl,
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
        panCardUrl,
        aadhaarCardUrl,
        partnerRequestId: partnerRef.id,
      });

      await updateDoc(partnerRef, { agentUid: uid, agentId, ownReferralCode });
      setUploadProgress(99);

      const fullName = [sanitizedFormData.firstName, sanitizedFormData.middleName, sanitizedFormData.lastName].filter(Boolean).join(' ');
      const emailResult = await sendCredentialsViaEmail(loginId, password, fullName);

      await updateDoc(doc(db, 'agents', uid), {
        credentialsSentAt: serverTimestamp(),
        emailDeliveryStatus: emailResult.success ? 'sent' : 'failed',
      });

      setUploadProgress(100);
      setSubmitted(true);

      setFormData({
        date: '', firstName: '', middleName: '', lastName: '',
        fatherHusbandName: '', fatherHusbandMiddleName: '', fatherHusbandLastName: '',
        dob: '', localAddressLine: '', localCity: '', localState: '', localPinCode: '',
        permanentAddressLine: '', permanentCity: '', permanentState: '', permanentPinCode: '',
        email: '', mobile1: '', mobile2: '', panCardNo: '', aadhaarCardNo: '',
        reference: '', department: '', leaderName: '', planBy: '', referralCode: '',
      });
      setFiles({ photograph: null, panCard: null, aadhaarCard: null });
      setPreviews({ photograph: null, panCard: null, aadhaarCard: null });
      setAgreed(false);

      setTimeout(() => navigate('/thank-you', {
        state: { loginId, emailSent: emailResult.success, associateId: agentId, agentId, ownReferralCode, associateName: fullName },
      }), 500);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Check if error is email-already-in-use from Firebase Auth
      if (
        error.code === 'auth/email-already-in-use' || 
        error.code === 'auth/email-already-exists'
      ) {
        setErrors(prev => ({ ...prev, email: 'Email ID already exists, use different' }));
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="contact-wrapper">
      <Breadcrumb />

      <section className="container py-5">
        <div className="text-center mb-5">
          <span className="contact-badge">PARTNER WITH US</span>
          <h1 className="contact-title mt-3">
            Join As <span>Associate Channel Partner</span>
          </h1>
          <p className="contact-subtitle text-center">
            Empower your future with our premier partnership program.
          </p>
        </div>

        {submitted && (
          <div className="premium-success-alert mx-auto" role="alert">
            <CheckCircle2 size={24} />
            <strong>Your application has been submitted successfully!</strong>
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            <div className="premium-form-card">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="premium-section mb-5">
                  <div className="premium-section-header">
                    <div className="premium-section-icon">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h4 className="premium-section-title">Basic Information</h4>
                      <p className="premium-section-desc">Let's start with your application details</p>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <Calendar size={16} className="me-2" />
                          Application Date
                        </label>
                        <input type="date" className="premium-form-control" name="date" value={formData.date} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <Camera size={16} className="me-2" />
                          Your Photograph <span className="premium-required">*</span>
                        </label>
                        <input type="file" id="photo" name="photograph" accept="image/*" onChange={handleFileChange} className="d-none" />
                        <label htmlFor="photo" className="premium-file-upload">
                          <div className="premium-file-upload-content">
                            <span>{previews.photograph ? 'Photo Selected ✓' : 'Click to upload photograph'}</span>
                            <Camera size={18} />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applicant Name */}
                <div className="premium-section mb-5">
                  <div className="premium-section-header">
                    <div className="premium-section-icon">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="premium-section-title">Applicant Name</h4>
                      <p className="premium-section-desc">Enter your full name details</p>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">First Name <span className="premium-required">*</span></label>
                        <input type="text" className="premium-form-control" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">Middle Name</label>
                        <input type="text" className="premium-form-control" placeholder="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">Last Name</label>
                        <input type="text" className="premium-form-control" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  <div className="premium-subsection mt-4">
                    <div className="premium-subsection-header">
                      <Users size={18} />
                      Father / Husband Details
                    </div>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="premium-field-group">
                          <label className="premium-field-label">First Name</label>
                          <input type="text" className="premium-form-control" placeholder="First Name" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="premium-field-group">
                          <label className="premium-field-label">Middle Name</label>
                          <input type="text" className="premium-form-control" placeholder="Middle Name" name="fatherHusbandMiddleName" value={formData.fatherHusbandMiddleName} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="premium-field-group">
                          <label className="premium-field-label">Last Name</label>
                          <input type="text" className="premium-form-control" placeholder="Last Name" name="fatherHusbandLastName" value={formData.fatherHusbandLastName} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="premium-section mb-5">
                  <div className="premium-section-header">
                    <div className="premium-section-icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="premium-section-title">Personal Details</h4>
                      <p className="premium-section-desc">Your personal identification information</p>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <Calendar size={16} className="me-2" />
                          Date of Birth
                        </label>
                        <input type="date" className="premium-form-control" name="dob" value={formData.dob} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <CreditCard size={16} className="me-2" />
                          PAN Card Image <span className="premium-required">*</span>
                        </label>
                        <input type="file" id="pan-file" name="panCard" accept="image/*" onChange={handleFileChange} className="d-none" />
                        <label htmlFor="pan-file" className="premium-file-upload">
                          <div className="premium-file-upload-content">
                            <span>{previews.panCard ? 'PAN Selected ✓' : 'Click to upload PAN card'}</span>
                            <Upload size={18} />
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <CreditCard size={16} className="me-2" />
                          Aadhaar Card Image <span className="premium-required">*</span>
                        </label>
                        <input type="file" id="aadhaar-file" name="aadhaarCard" accept="image/*" onChange={handleFileChange} className="d-none" />
                        <label htmlFor="aadhaar-file" className="premium-file-upload">
                          <div className="premium-file-upload-content">
                            <span>{previews.aadhaarCard ? 'Aadhaar Selected ✓' : 'Click to upload Aadhaar card'}</span>
                            <Upload size={18} />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="premium-section mb-5">
                  <div className="premium-section-header">
                    <div className="premium-section-icon">
                      <Building size={20} />
                    </div>
                    <div>
                      <h4 className="premium-section-title">Professional Details</h4>
                      <p className="premium-section-desc">Your professional and partnership information</p>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="premium-field-group">
                        <label className="premium-field-label">Reference</label>
                        <input type="text" className="premium-form-control" placeholder="Reference" name="reference" value={formData.reference} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="premium-field-group">
                        <label className="premium-field-label">Department</label>
                        <input type="text" className="premium-form-control" placeholder="Department" name="department" value={formData.department} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="premium-field-group">
                        <label className="premium-field-label">Leader Name</label>
                        <input type="text" className="premium-form-control" placeholder="Leader Name" name="leaderName" value={formData.leaderName} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="premium-field-group">
                        <label className="premium-field-label">Plan By</label>
                        <input type="text" className="premium-form-control" placeholder="Plan By" name="planBy" value={formData.planBy} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <Users size={16} className="me-2" />
                          Referral Code <span className="premium-required">*</span>
                        </label>
                        <input type="text" className={`premium-form-control ${errors.referralCode ? 'is-invalid' : ''}`} placeholder="Enter Referral Code" name="referralCode" value={formData.referralCode} onChange={handleChange} required />
                        {errors.referralCode && <div className="text-danger mt-1 small">{errors.referralCode}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="row g-4 mb-5">
                  <div className="col-lg-6">
                    <div className="premium-address-card">
                      <div className="premium-address-header">
                        <MapPin size={20} />
                        <span>Local Address</span>
                      </div>
                      <div className="d-flex flex-column gap-3">
                        <div className="premium-field-group">
                          <label className="premium-field-label">Address Line</label>
                          <input type="text" className="premium-form-control" placeholder="Address Line" name="localAddressLine" value={formData.localAddressLine} onChange={handleChange} />
                        </div>
                        <div className="row g-3">
                          <div className="col-12 col-sm-4">
                            <div className="premium-field-group">
                              <label className="premium-field-label">City</label>
                              <input type="text" className="premium-form-control" placeholder="City" name="localCity" value={formData.localCity} onChange={handleChange} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="premium-field-group">
                              <label className="premium-field-label">State</label>
                              <input type="text" className="premium-form-control" placeholder="State" name="localState" value={formData.localState} onChange={handleChange} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="premium-field-group">
                              <label className="premium-field-label">Pin Code</label>
                              <input type="text" className="premium-form-control" placeholder="Pin Code" name="localPinCode" value={formData.localPinCode} onChange={handleChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="premium-address-card">
                      <div className="premium-address-header">
                        <MapPin size={20} />
                        <span>Permanent Address</span>
                      </div>
                      <div className="d-flex flex-column gap-3">
                        <div className="premium-field-group">
                          <label className="premium-field-label">Address Line</label>
                          <input type="text" className="premium-form-control" placeholder="Address Line" name="permanentAddressLine" value={formData.permanentAddressLine} onChange={handleChange} />
                        </div>
                        <div className="row g-3">
                          <div className="col-12 col-sm-4">
                            <div className="premium-field-group">
                              <label className="premium-field-label">City</label>
                              <input type="text" className="premium-form-control" placeholder="City" name="permanentCity" value={formData.permanentCity} onChange={handleChange} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="premium-field-group">
                              <label className="premium-field-label">State</label>
                              <input type="text" className="premium-form-control" placeholder="State" name="permanentState" value={formData.permanentState} onChange={handleChange} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="premium-field-group">
                              <label className="premium-field-label">Pin Code</label>
                              <input type="text" className="premium-form-control" placeholder="Pin Code" name="permanentPinCode" value={formData.permanentPinCode} onChange={handleChange} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="premium-section mb-5">
                  <div className="premium-section-header">
                    <div className="premium-section-icon">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="premium-section-title">Contact Details</h4>
                      <p className="premium-section-desc">How can we reach you?</p>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <Mail size={16} className="me-2" />
                          Email ID
                        </label>
                        <input type="email" className={`premium-form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email ID" name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <div className="text-danger mt-1 small">{errors.email}</div>}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <Phone size={16} className="me-2" />
                          Mobile 1 <span className="premium-required">*</span>
                        </label>
                        <input type="tel" className="premium-form-control" placeholder="Mobile 1" name="mobile1" value={formData.mobile1} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="premium-field-group">
                        <label className="premium-field-label">
                          <Phone size={16} className="me-2" />
                          Mobile 2
                        </label>
                        <input type="tel" className="premium-form-control" placeholder="Mobile 2" name="mobile2" value={formData.mobile2} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action/Submission Section */}
                <div className="premium-submit-section">
                  {loading && (
                    <div className="premium-progress-container mx-auto mb-4">
                      <div className="premium-progress-header">
                        <span className="premium-progress-text">Processing Application</span>
                        <span className="premium-progress-percent">{uploadProgress}%</span>
                      </div>
                      <div className="premium-progress-bar-wrapper">
                        <div
                          className="premium-progress-bar"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="premium-terms-container mb-4">
                    <label className="premium-terms-label" onClick={handleCheckboxClick}>
                      <input
                        type="checkbox"
                        className="premium-terms-checkbox"
                        checked={agreed}
                        onChange={() => {}} // Controlled component with click handled on label
                      />
                      <span>
                        I agree with{" "}
                        <span className="terms-link-text" onClick={(e) => {
                          e.stopPropagation();
                          setShowTermsModal(true);
                        }}>
                          Terms and Conditions
                        </span>
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={loading || !agreed} className="premium-submit-btn">
                    {loading ? (
                      <>
                        <Loader2 size={18} className="premium-spinner me-2" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                  <p className="premium-security-note">
                    <ShieldCheck size={16} className="me-2" />
                    Secure 256-bit SSL encrypted application
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="terms-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="terms-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="terms-modal-header">
              <h3>नियम और शर्तें</h3>
              <button 
                type="button" 
                className="terms-modal-close" 
                onClick={() => setShowTermsModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="terms-modal-body">
              <div className="terms-scroll-content">
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
                className="terms-decline-btn" 
                onClick={() => setShowTermsModal(false)}
              >
                रद्द करें
              </button>
              <button 
                type="button" 
                className="terms-agree-btn" 
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
