import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Briefcase, MapPin, Phone, Camera, Upload, Loader2, CheckCircle2,
  Calendar, CreditCard, Mail, Building, Users, FileText, ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { db } from './Firebase/Firebase';
import { collection, addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setLoading(true);
    setUploadProgress(0);

    try {
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
      const loginId = sanitizedFormData.email.trim().toLowerCase();

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

      setTimeout(() => navigate('/thank-you', {
        state: { loginId, emailSent: emailResult.success, associateId: agentId, agentId, ownReferralCode, associateName: fullName },
      }), 500);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Submission failed. Check your network configuration.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="contact-wrapper mt-5">
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
                        <input type="text" className="premium-form-control" placeholder="First Name" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <input type="text" className="premium-form-control" placeholder="Middle Name" name="fatherHusbandMiddleName" value={formData.fatherHusbandMiddleName} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <input type="text" className="premium-form-control" placeholder="Last Name" name="fatherHusbandLastName" value={formData.fatherHusbandLastName} onChange={handleChange} />
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
                        <input type="text" className="premium-form-control" placeholder="Enter Referral Code" name="referralCode" value={formData.referralCode} onChange={handleChange} required />
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
                        <input type="text" className="premium-form-control" placeholder="Address Line" name="localAddressLine" value={formData.localAddressLine} onChange={handleChange} />
                        <div className="row g-2">
                          <div className="col-12 col-sm-4">
                            <input type="text" className="premium-form-control" placeholder="City" name="localCity" value={formData.localCity} onChange={handleChange} />
                          </div>
                          <div className="col-12 col-sm-4">
                            <input type="text" className="premium-form-control" placeholder="State" name="localState" value={formData.localState} onChange={handleChange} />
                          </div>
                          <div className="col-12 col-sm-4">
                            <input type="text" className="premium-form-control" placeholder="Pin Code" name="localPinCode" value={formData.localPinCode} onChange={handleChange} />
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
                        <input type="text" className="premium-form-control" placeholder="Address Line" name="permanentAddressLine" value={formData.permanentAddressLine} onChange={handleChange} />
                        <div className="row g-2">
                          <div className="col-12 col-sm-4">
                            <input type="text" className="premium-form-control" placeholder="City" name="permanentCity" value={formData.permanentCity} onChange={handleChange} />
                          </div>
                          <div className="col-12 col-sm-4">
                            <input type="text" className="premium-form-control" placeholder="State" name="permanentState" value={formData.permanentState} onChange={handleChange} />
                          </div>
                          <div className="col-12 col-sm-4">
                            <input type="text" className="premium-form-control" placeholder="Pin Code" name="permanentPinCode" value={formData.permanentPinCode} onChange={handleChange} />
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
                        <input type="email" className="premium-form-control" placeholder="Email ID" name="email" value={formData.email} onChange={handleChange} />
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

                  <button type="submit" disabled={loading} className="premium-submit-btn">
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
    </div>
  );
};

export default JoinAsPartner;
