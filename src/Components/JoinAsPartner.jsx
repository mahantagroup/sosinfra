import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, MapPin, Phone, Camera, Upload, Loader2, CheckCircle2 } from 'lucide-react';
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
        state: { loginId, emailSent: emailResult.success, agentId, ownReferralCode, associateName: fullName },
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
            Join <span>SOS Infrabulls</span>
          </h1>
          <p className="contact-subtitle">
            Empower your future with our premier partnership program.
          </p>
        </div>

        {submitted && (
          <div className="alert alert-success d-flex align-items-center gap-3 mb-5 mx-auto" style={{ maxWidth: '600px' }} role="alert">
            <CheckCircle2 size={22} />
            <strong>Your application has been submitted successfully!</strong>
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="contact-card">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-5">
                  <h4 className="card-title mb-4">
                    <Briefcase size={20} className="me-2" />
                    Basic Information
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Application Date</label>
                      <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Your Photograph <span className="text-danger">*</span></label>
                      <input type="file" id="photo" name="photograph" accept="image/*" onChange={handleFileChange} className="d-none" />
                      <label htmlFor="photo" className="form-control d-flex align-items-center justify-content-between" style={{ cursor: 'pointer' }}>
                        <span>{previews.photograph ? 'Photo Selected ✓' : 'Upload Photograph *'}</span>
                        <Camera size={18} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Applicant Name */}
                <div className="mb-5">
                  <h4 className="card-title mb-4">
                    <User size={20} className="me-2" />
                    Applicant Name
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">First Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Middle Name</label>
                      <input type="text" className="form-control" placeholder="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label text-muted d-block mb-2">Father / Husband Details</label>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="First Name" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Middle Name" name="fatherHusbandMiddleName" value={formData.fatherHusbandMiddleName} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <input type="text" className="form-control" placeholder="Last Name" name="fatherHusbandLastName" value={formData.fatherHusbandLastName} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="mb-5">
                  <h4 className="card-title mb-4">
                    <User size={20} className="me-2" />
                    Personal Details
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">PAN Card Image <span className="text-danger">*</span></label>
                      <input type="file" id="pan-file" name="panCard" accept="image/*" onChange={handleFileChange} className="d-none" />
                      <label htmlFor="pan-file" className="form-control d-flex align-items-center justify-content-between" style={{ cursor: 'pointer' }}>
                        <span>{previews.panCard ? 'PAN Selected ✓' : 'Upload PAN *'}</span>
                        <Upload size={18} />
                      </label>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Aadhaar Card Image <span className="text-danger">*</span></label>
                      <input type="file" id="aadhaar-file" name="aadhaarCard" accept="image/*" onChange={handleFileChange} className="d-none" />
                      <label htmlFor="aadhaar-file" className="form-control d-flex align-items-center justify-content-between" style={{ cursor: 'pointer' }}>
                        <span>{previews.aadhaarCard ? 'Aadhaar Selected ✓' : 'Upload Aadhaar *'}</span>
                        <Upload size={18} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="mb-5">
                  <h4 className="card-title mb-4">
                    <Briefcase size={20} className="me-2" />
                    Professional Details
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Reference" name="reference" value={formData.reference} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Department" name="department" value={formData.department} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Leader Name" name="leaderName" value={formData.leaderName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Plan By" name="planBy" value={formData.planBy} onChange={handleChange} />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Referral Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="Enter Referral Code" name="referralCode" value={formData.referralCode} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-lg-6">
                    <div className="contact-card h-100" style={{ padding: '1.5rem' }}>
                      <h5 className="fw-semibold mb-3">
                        <MapPin size={18} className="me-2" />
                        Local Address
                      </h5>
                      <div className="d-flex flex-column gap-3">
                        <input type="text" className="form-control" placeholder="Address Line" name="localAddressLine" value={formData.localAddressLine} onChange={handleChange} />
                        <div className="row g-2">
                          <div className="col-4">
                            <input type="text" className="form-control" placeholder="City" name="localCity" value={formData.localCity} onChange={handleChange} />
                          </div>
                          <div className="col-4">
                            <input type="text" className="form-control" placeholder="State" name="localState" value={formData.localState} onChange={handleChange} />
                          </div>
                          <div className="col-4">
                            <input type="text" className="form-control" placeholder="Pin Code" name="localPinCode" value={formData.localPinCode} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="contact-card h-100" style={{ padding: '1.5rem' }}>
                      <h5 className="fw-semibold mb-3">
                        <MapPin size={18} className="me-2" />
                        Permanent Address
                      </h5>
                      <div className="d-flex flex-column gap-3">
                        <input type="text" className="form-control" placeholder="Address Line" name="permanentAddressLine" value={formData.permanentAddressLine} onChange={handleChange} />
                        <div className="row g-2">
                          <div className="col-4">
                            <input type="text" className="form-control" placeholder="City" name="permanentCity" value={formData.permanentCity} onChange={handleChange} />
                          </div>
                          <div className="col-4">
                            <input type="text" className="form-control" placeholder="State" name="permanentState" value={formData.permanentState} onChange={handleChange} />
                          </div>
                          <div className="col-4">
                            <input type="text" className="form-control" placeholder="Pin Code" name="permanentPinCode" value={formData.permanentPinCode} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="card-title mb-4">
                    <Phone size={20} className="me-2" />
                    Contact Details
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <input type="email" className="form-control" placeholder="Email ID" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <input type="tel" className="form-control" placeholder="Mobile 1" name="mobile1" value={formData.mobile1} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                      <input type="tel" className="form-control" placeholder="Mobile 2" name="mobile2" value={formData.mobile2} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* Action/Submission Section */}
                <div className="text-center py-4">
                  {loading && (
                    <div className="mx-auto mb-4" style={{ maxWidth: '400px' }}>
                      <div className="d-flex justify-content-between mb-2 text-muted">
                        <span>Processing Application</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="progress" style={{ height: '10px', borderRadius: '999px' }}>
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          style={{ width: `${uploadProgress}%`, background: 'var(--primary)', borderRadius: '999px' }}
                          aria-valuenow={uploadProgress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? (
                      <>
                        <Loader2 size={16} className="spinner-loader me-2" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                       
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-muted">
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
