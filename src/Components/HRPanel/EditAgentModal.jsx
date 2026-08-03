import React, { useState } from 'react';
import { X, User, Briefcase, MapPin, Phone, Lock, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import S3Image from '../S3Image';

const EditAgentModal = ({ agent, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: agent.date || '',
    firstName: agent.firstName || '',
    middleName: agent.middleName || '',
    lastName: agent.lastName || '',
    fatherHusbandName: agent.fatherHusbandName || '',
    fatherHusbandMiddleName: agent.fatherHusbandMiddleName || '',
    fatherHusbandLastName: agent.fatherHusbandLastName || '',
    dob: agent.dob || '',
    localAddressLine: agent.localAddressLine || '',
    localCity: agent.localCity || '',
    localState: agent.localState || '',
    localPinCode: agent.localPinCode || '',
    permanentAddressLine: agent.permanentAddressLine || '',
    permanentCity: agent.permanentCity || '',
    permanentState: agent.permanentState || '',
    permanentPinCode: agent.permanentPinCode || '',
    email: agent.email || agent.loginId || '',
    mobile1: agent.mobile1 || '',
    mobile2: agent.mobile2 || '',
    panCardNo: agent.panCardNo || '',
    aadhaarCardNo: agent.aadhaarCardNo || '',
    reference: agent.reference || '',
    department: agent.department || '',
    leaderName: agent.leaderName || '',
    planBy: agent.planBy || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.mobile1) {
      alert('First Name and Mobile 1 are required fields.');
      return;
    }
    setLoading(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error('Failed to save partner details:', err);
      alert('Failed to save changes: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hr-modal-overlay" onClick={onClose}>
      <div className="hr-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="hr-modal-header">
          <div>
            <h3 className="m-0 fw-800">Edit Partner Data</h3>
            <p className="m-0 text-muted small">Update information for {agent.agentId || agent.firstName}</p>
          </div>
          <button className="hr-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="hr-modal-body">
          {/* Lock Banner Notice for Images & Referral Code */}
          <div className="alert alert-info border-0 bg-primary-subtle text-primary d-flex align-items-center gap-2 mb-4 p-3 rounded-3">
            <Lock size={18} className="flex-shrink-0" />
            <span className="small font-medium">
              <strong>Notice:</strong> Per system policy, images (Photograph, PAN, Aadhaar) and referral codes cannot be edited after registration.
            </span>
          </div>

          {/* Locked Referral & Image Preview Section */}
          <div className="mb-4 p-3 bg-light rounded-3 border">
            <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              <Lock size={12} className="me-1" /> Non-Editable System Data
            </h6>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label text-muted small">Partner ID</label>
                <input type="text" className="form-control bg-white" value={agent.agentId || 'Pending'} disabled readOnly />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small">Own Referral Code</label>
                <input type="text" className="form-control bg-white" value={agent.ownReferralCode || 'N/A'} disabled readOnly />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small">Referral Code Used</label>
                <input type="text" className="form-control bg-white" value={agent.referralCode || 'N/A'} disabled readOnly />
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label text-muted small mb-2 d-block">
                <ImageIcon size={12} className="me-1" /> Uploaded Documents (Read Only)
              </label>
              <div className="d-flex gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white rounded border">
                  <span className="small text-muted">Photo:</span>
                  {agent.photographUrl ? (
                    <S3Image src={agent.photographUrl} className="rounded" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary small">No Image</span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white rounded border">
                  <span className="small text-muted">PAN:</span>
                  {agent.panCardUrl ? (
                    <S3Image src={agent.panCardUrl} className="rounded" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary small">No PAN Image</span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white rounded border">
                  <span className="small text-muted">Aadhaar:</span>
                  {agent.aadhaarCardUrl ? (
                    <S3Image src={agent.aadhaarCardUrl} className="rounded" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary small">No Aadhaar Image</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Section: Basic Info */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '0.95rem' }}>
              <Briefcase size={16} className="text-primary" /> Basic Information
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small font-medium">Application Date</label>
                <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label small font-medium">Date of Birth</label>
                <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Editable Section: Applicant Name */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '0.95rem' }}>
              <User size={16} className="text-primary" /> Applicant Name
            </h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small font-medium">First Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label small font-medium">Middle Name</label>
                <input type="text" className="form-control" placeholder="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label small font-medium">Last Name</label>
                <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label text-muted small d-block mb-2 font-medium">Father / Husband Details</label>
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

          {/* Editable Section: Contact Details */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '0.95rem' }}>
              <Phone size={16} className="text-primary" /> Contact Details
            </h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small font-medium">Email ID</label>
                <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label small font-medium">Mobile 1 <span className="text-danger">*</span></label>
                <input type="tel" className="form-control" placeholder="Mobile 1" name="mobile1" value={formData.mobile1} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label small font-medium">Mobile 2</label>
                <input type="tel" className="form-control" placeholder="Mobile 2" name="mobile2" value={formData.mobile2} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Editable Section: Document Numbers */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '0.95rem' }}>
              <User size={16} className="text-primary" /> Identity Card Numbers
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small font-medium">PAN Card Number</label>
                <input type="text" className="form-control" placeholder="PAN Card No." name="panCardNo" value={formData.panCardNo} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label small font-medium">Aadhaar Card Number</label>
                <input type="text" className="form-control" placeholder="Aadhaar Card No." name="aadhaarCardNo" value={formData.aadhaarCardNo} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Editable Section: Addresses */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border h-100">
                <h6 className="fw-bold mb-3 small d-flex align-items-center gap-2 text-dark">
                  <MapPin size={14} className="text-primary" /> Local Address
                </h6>
                <div className="d-flex flex-column gap-2">
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

            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border h-100">
                <h6 className="fw-bold mb-3 small d-flex align-items-center gap-2 text-dark">
                  <MapPin size={14} className="text-primary" /> Permanent Address
                </h6>
                <div className="d-flex flex-column gap-2">
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

          {/* Editable Section: Professional Details */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark" style={{ fontSize: '0.95rem' }}>
              <Briefcase size={16} className="text-primary" /> Professional Details
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small font-medium">Reference</label>
                <input type="text" className="form-control" placeholder="Reference" name="reference" value={formData.reference} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label small font-medium">Department</label>
                <input type="text" className="form-control" placeholder="Department" name="department" value={formData.department} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label small font-medium">Leader Name</label>
                <input type="text" className="form-control" placeholder="Leader Name" name="leaderName" value={formData.leaderName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label small font-medium">Plan By</label>
                <input type="text" className="form-control" placeholder="Plan By" name="planBy" value={formData.planBy} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Modal Footer inside form */}
          <div className="hr-modal-footer">
            <button type="button" className="btn btn-light px-4 fw-bold" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-4 fw-bold d-flex align-items-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAgentModal;
