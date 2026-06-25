import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Shield, IdCard, LogOut, Menu, X, Settings,
  CheckCircle, Clock, Loader2, Lock, ExternalLink, Mail, Phone, MapPin, Calendar,
  KeyRound, Eye, EyeOff, AlertCircle, ChevronRight, Users, Copy, Check
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { signOutAgent, setAgentPasswordOnce } from '../Firebase/agentHelpers';
import S3Image from '../S3Image';
import { getImageViewUrl } from '../Firebase/s3UploadService';
import './AgentPanel.css';


const mapAgentInfo = (agent) => {
  const docsUploaded = [agent.photographUrl, agent.panCardUrl, agent.aadhaarCardUrl].filter(Boolean).length;
  return {
    name: agent.fullName || [agent.firstName, agent.middleName, agent.lastName].filter(Boolean).join(' '),
    id: agent.loginId || agent.email,
    agentId: agent.agentId || 'Pending',
    ownReferralCode: agent.ownReferralCode || 'Pending',
    email: agent.email,
    mobile: agent.mobile1,
    status: agent.status || 'Pending',
    joiningDate: agent.date || '—',
    dob: agent.dob || '—',
    panCardNo: agent.panCardNo || '—',
    aadhaarCardNo: agent.aadhaarCardNo || '—',
    profileCompletion: Math.round((docsUploaded / 3) * 100),
    address: agent.localAddressLine || agent.permanentAddressLine1 || '—',
    city: agent.localCity || agent.permanentCity || '—',
    state: agent.localState || agent.permanentState || '—',
    pincode: agent.localPinCode || agent.permanentPinCode || '—',
    photographUrl: agent.photographUrl,
    panCardUrl: agent.panCardUrl,
    aadhaarCardUrl: agent.aadhaarCardUrl,
    passwordChanged: !!agent.passwordChanged,
    uid: agent.id,
  };
};

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const isApproved = agentInfo?.status === 'Approved';
  const hasSetPassword = agentInfo?.passwordChanged;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const fetchTeam = async () => {
    if (!agentInfo?.ownReferralCode || agentInfo.ownReferralCode === 'Pending') return;
    setTeamLoading(true);
    try {
      const q = query(collection(db, 'agents'), where('referralCode', '==', agentInfo.ownReferralCode));
      const snap = await getDocs(q);
      const members = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeam(members);
    } catch (err) {
      console.error('Failed to fetch team:', err);
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'team') {
      fetchTeam();
    }
  }, [activeTab, agentInfo?.ownReferralCode]);

  useEffect(() => {
    let unsubDoc = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubDoc) unsubDoc();
      if (!user) { navigate('/agent/login'); return; }
      unsubDoc = onSnapshot(doc(db, 'agents', user.uid), (snap) => {
        if (!snap.exists()) { signOutAgent(); navigate('/agent/login'); return; }
        setAgentInfo(mapAgentInfo({ id: snap.id, ...snap.data() }));
        setAuthLoading(false);
      });
    });
    return () => { unsubAuth(); if (unsubDoc) unsubDoc(); };
  }, [navigate]);

  const handleLogout = async () => {
    await signOutAgent();
    navigate('/agent/login');
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters long.');
      return;
    }

    setPwLoading(true);
    try {
      await setAgentPasswordOnce(
        agentInfo.uid,
        agentInfo.id,
        currentPassword,
        newPassword
      );
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message =
        err.code === 'auth/wrong-password'
          ? 'The temporary password you entered is incorrect.'
          : err.message || 'Failed to update security credentials.';
      setPwError(message);
    } finally {
      setPwLoading(false);
    }
  };

  if (authLoading || !agentInfo) {
    return (
      <div className="agent-portal-wrapper align-items-center justify-content-center flex-column gap-3">
        <Loader2 className="animate-spin" size={40} color="#4A97E4" />
        <p className="text-muted small fw-bold">Authenticating Portal Access...</p>
      </div>
    );
  }

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, requiresApproval: false },
    { id: 'team', name: 'My Team', icon: Users, requiresApproval: true },
    { id: 'profile', name: 'Profile', icon: User, requiresApproval: true },
    { id: 'kyc', name: 'KYC Docs', icon: Shield, requiresApproval: true },
    { id: 'digital-card', name: 'ID Card', icon: IdCard, requiresApproval: true },
    { id: 'settings', name: 'Security', icon: Settings, requiresApproval: false, badge: !hasSetPassword ? '!' : null },
  ];

  const StatusBadge = ({ status }) => {
    const approved = status === 'Approved';
    return (
      <span className={`badge rounded-pill px-3 py-1 border ${approved ? 'bg-success-subtle text-success border-success-subtle' : 'bg-warning-subtle text-warning border-warning-subtle'
        }`} style={{ fontSize: '0.875rem', fontWeight: 700 }}>
        <span className={`d-inline-block rounded-circle me-1 ${approved ? 'bg-success' : 'bg-warning animate-pulse'}`} style={{ width: '6px', height: '6px' }} />
        {status}
      </span>
    );
  };

  const onboardingSteps = [
    { label: 'Registration Submitted', done: true },
    { label: 'Credentials Sent via Email', done: true },
    { label: 'Set Your Login Password', done: hasSetPassword, pending: !hasSetPassword },
    { label: 'HR Document Review', done: isApproved, pending: !isApproved && hasSetPassword },
    { label: 'Full Portal Access', done: isApproved },
  ];

  return (
    <div className="agent-portal-wrapper">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="agent-sidebar-overlay show"
          onClick={() => setSidebarOpen(false)}
          style={{ display: 'block' }}
        />
      )}

      {/* Sidebar */}
      <aside className={`agent-sidebar ${sidebarOpen ? 'd-flex vh-100 position-fixed overflow-hidden' : ''}`}>
        <div className="agent-sidebar-header">
          <div className="d-flex flex-column align-items-center gap-3 w-100">
            <img src="/images/logo/logo@2x.png" alt="SOS Infrabulls" className="agent-sidebar-logo" />
            <span className="fw-800 d-block small" style={{ color: '#0A2540', letterSpacing: '-0.02em' }}>Agent Portal</span>
          </div>
          {sidebarOpen && <button className="btn ms-auto p-0" onClick={() => setSidebarOpen(false)}><X size={20} /></button>}
        </div>

        <nav className="agent-sidebar-nav">
          {navigationItems.map((item) => {
            const isLocked = item.requiresApproval && !isApproved;
            return (
              <button
                key={item.id}
                onClick={() => { if (!isLocked) { setActiveTab(item.id); setSidebarOpen(false); } }}
                disabled={isLocked}
                className={`agent-nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <div className="d-flex align-items-center gap-3">
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </div>
                {isLocked && <Lock size={12} />}
                {!isLocked && item.badge && <span className="badge bg-danger rounded-circle ms-2 p-1" style={{ fontSize: '0.4rem' }}> </span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-top">
          <button onClick={handleLogout} className="agent-nav-item text-danger w-100">
            <div className="d-flex align-items-center gap-3">
              <LogOut size={18} />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1 min-w-0 d-flex flex-column">
        {/* Top Header */}
        <header className="agent-header">
          <div className="d-flex align-items-center gap-3">
            <button className="btn d-lg-none p-0" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <h1 className="h5 fw-800 m-0 text-capitalize" style={{ letterSpacing: '-0.02em' }}>{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <StatusBadge status={agentInfo.status} />
            <div className="d-flex align-items-center gap-2 border-start ps-3 ms-2">
              <div className="text-end d-none d-sm-block">
                <span className="d-block fw-700 small" style={{ fontSize: '0.875rem' }}>{agentInfo.name}</span>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>{agentInfo.email}</span>
              </div>
              <div className="rounded-circle shadow-sm overflow-hidden border" style={{ width: '34px', height: '34px', borderColor: 'var(--agent-border)' }}>
                {agentInfo.photographUrl ? (
                  <S3Image src={agentInfo.photographUrl} alt="" className="w-100 h-100 object-cover" />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center fw-bold small" style={{ background: 'var(--agent-accent-glow)', color: 'var(--agent-accent)' }}>
                    {agentInfo.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 p-md-5 mx-auto w-100" style={{ maxWidth: '1000px' }}>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Hero Card */}
              <div className="agent-hero-card mb-4" style={{ position: 'relative' }}>
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <span className="badge px-3 py-2 bg-white bg-opacity-10 mb-3" style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.08em' }}>DASHBOARD OVERVIEW</span>
                    <h2 className="fw-800 mb-2 text-light" style={{ letterSpacing: '-0.03em' }}>Welcome, <span className="fw-light">{agentInfo.name.split(' ')[0]}</span></h2>
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      <div className="bg-white bg-opacity-10 px-3 py-2 rounded-3 border border-white border-opacity-10">
                        <label className="d-block text-white text-opacity-50 fw-700 uppercase" style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>Agent ID</label>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-white fw-bold font-monospace small" style={{ fontSize: '1rem' }}>{agentInfo.agentId}</span>
                          <button
                            className="btn p-0 border-0 text-white text-opacity-50"
                            onClick={() => copyToClipboard(agentInfo.agentId, 'agentId')}
                            style={{ lineHeight: 1 }}
                          >
                            {copiedField === 'agentId' ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-10 px-3 py-2 rounded-3 border border-white border-opacity-10">
                        <label className="d-block text-white text-opacity-50 fw-700 uppercase" style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>Referral Code</label>
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-white fw-bold font-monospace small" style={{ fontSize: '1rem' }}>{agentInfo.ownReferralCode}</span>
                          <button
                            className="btn p-0 border-0 text-white text-opacity-50"
                            onClick={() => copyToClipboard(agentInfo.ownReferralCode, 'referral')}
                            style={{ lineHeight: 1 }}
                          >
                            {copiedField === 'referral' ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 d-none d-lg-block text-end">
                    <Shield size={80} className="text-white opacity-10" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <div className="stat-pill">
                    <span className="text-muted fw-700 text-uppercase d-block mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Profile Progress</span>
                    <div className="d-flex align-items-baseline gap-2">
                      <h2 className="fw-800 m-0" style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>{agentInfo.profileCompletion}%</h2>
                      {agentInfo.profileCompletion === 100 && <CheckCircle size={16} className="text-success" />}
                    </div>
                    <div className="progress mt-3" style={{ height: '5px', borderRadius: '10px', background: 'var(--agent-surface-2)' }}>
                      <div className="progress-bar" style={{ width: `${agentInfo.profileCompletion}%`, background: 'linear-gradient(90deg, var(--agent-accent), var(--agent-accent-secondary))', borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-pill">
                    <span className="text-muted fw-700 text-uppercase d-block mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Joining date</span>
                    <h2 className="fw-800 m-0" style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>{agentInfo.joiningDate}</h2>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-pill">
                    <span className="text-muted fw-700 text-uppercase d-block mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Current Level</span>
                    <h2 className={`fw-800 m-0 text-capitalize ${agentInfo.status === 'Approved' ? 'text-success' : ''}`} style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>{agentInfo.status}</h2>
                  </div>
                </div>
              </div>

              {/* Pending Review Alert */}
              {!isApproved && (
                <div className="alert alert-warning border-0 p-4 mb-4" style={{ background: '#fffbeb', borderRadius: '18px', boxShadow: 'var(--agent-shadow-sm)' }}>
                  <div className="d-flex gap-3">
                    <Clock size={22} className="text-warning flex-shrink-0 mt-1" />
                    <div>
                      <h6 className="fw-800 mb-1" style={{ fontSize: '0.88rem' }}>HR Review Pending</h6>
                      <p className="small text-muted m-0" style={{ lineHeight: 1.6 }}>Your profile is currently under active review. Full portal features including your Digital Agent Card will be unlocked once HR completes the verification process.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Onboarding Roadmap */}
              <div className="agent-card">
                <h6 className="fw-800 mb-4 px-1" style={{ letterSpacing: '-0.02em' }}>Onboarding Roadmap</h6>
                <div className="row g-3">
                  {onboardingSteps.map((step, idx) => (
                    <div key={idx} className="col-12">
                      <div className={`onboarding-step ${step.done ? 'done' : step.pending ? 'pending' : ''}`}>
                        <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${step.done ? 'bg-success text-white' : 'bg-light'}`} style={{ width: '32px', height: '32px' }}>
                          {step.done ? <CheckCircle size={15} /> : <Clock size={15} className={step.pending ? 'text-warning' : 'text-muted'} />}
                        </div>
                        <div className="flex-grow-1">
                          <span className={`fw-700 small ${step.done ? '' : 'text-muted'}`} style={{ color: step.done ? 'var(--agent-text)' : undefined, fontSize: '0.875rem' }}>{step.label}</span>
                        </div>
                        {step.done && <span className="badge bg-success-subtle text-success small" style={{ fontSize: '0.875rem', fontWeight: 700 }}>COMPLETED</span>}
                        {step.pending && <span className="badge bg-warning-subtle text-warning small" style={{ fontSize: '0.875rem', fontWeight: 700 }}>IN PROGRESS</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && isApproved && (
            <div className="agent-card">
              <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 fw-800" style={{ fontSize: '0.875rem' }}>IDENTITY PROFILE</span>
              <div className="row g-4 mt-1">
                <div className="col-md-6 border-end">
                  {[
                    { label: 'Full Name', value: agentInfo.name, icon: User },
                    { label: 'Mobile Number', value: agentInfo.mobile, icon: Phone },
                    { label: 'Email Address', value: agentInfo.email, icon: Mail },
                    { label: 'Date of Birth', value: agentInfo.dob, icon: Calendar }
                  ].map((item, i) => (
                    <div key={i} className="mb-4">
                      <label className="text-muted fw-700 uppercase d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>
                        <item.icon size={11} />
                        {item.label}
                      </label>
                      <span className="fw-600 text-dark" style={{ fontSize: '1rem' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="text-muted fw-700 uppercase d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>
                      <MapPin size={11} />
                      Resident Address
                    </label>
                    <p className="fw-600 text-dark small" style={{ lineHeight: 1.6, fontSize: '1rem' }}>{agentInfo.address}<br />{agentInfo.city}, {agentInfo.state} - {agentInfo.pincode}</p>
                  </div>
                  <div className="p-3 rounded-4" style={{ background: 'var(--agent-surface-2)', border: '1px solid var(--agent-border)' }}>
                    <span className="fw-800 small d-block mb-2" style={{ fontSize: '0.875rem' }}>Portal Access Link</span>
                    <code className="p-2 rounded d-block fw-600" style={{ fontSize: '0.875rem', background: 'white', color: 'var(--agent-accent)', border: '1px solid var(--agent-border)' }}>{window.location.origin}/agent/login</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KYC Tab */}
          {activeTab === 'kyc' && isApproved && (
            <div className="row g-4">
              {[
                { name: 'Profile Photograph', url: agentInfo.photographUrl },
                { name: 'PAN Card Proof', url: agentInfo.panCardUrl },
                { name: 'Aadhaar Card Proof', url: agentInfo.aadhaarCardUrl }
              ].map((kycDoc, idx) => (
                <div className="col-md-4" key={idx}>
                  <div className="agent-card p-0 overflow-hidden h-100" style={{ boxShadow: 'var(--agent-shadow-sm)' }}>
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '160px', background: 'var(--agent-surface-2)' }}>
                      {kycDoc.url ? (
                        <S3Image src={kycDoc.url} className="w-100 h-100 object-cover" />
                      ) : (
                        <Shield size={36} className="text-muted opacity-25" />
                      )}
                    </div>
                    <div className="p-3">
                      <h6 className="fw-800 small mb-1" style={{ fontSize: '1rem' }}>{kycDoc.name}</h6>
                      <span className={`small fw-bold ${kycDoc.url ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.875rem', letterSpacing: '0.04em' }}>
                        {kycDoc.url ? '✓ VERIFIED' : '⚠ MISSING'}
                      </span>
                      {kycDoc.url && (
                        <button
                          className="btn btn-link btn-sm p-0 d-block mt-2 text-decoration-none fw-700"
                          style={{ fontSize: '0.875rem', color: 'var(--agent-accent)' }}
                          onClick={async () => {
                            const url = await getImageViewUrl(kycDoc.url);
                            if (url) window.open(url, '_blank');
                          }}
                        >
                          View Original <ExternalLink size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Digital ID Card Tab */}
          {activeTab === 'digital-card' && isApproved && (
            <div className="text-center py-4">
              <h5 className="fw-800 mb-4" style={{ letterSpacing: '-0.02em' }}>Authorized Agent ID Card</h5>
              <div className="digital-id-card text-start">
                <div className="d-flex justify-content-between mb-4 border-bottom border-white border-opacity-20 pb-3">
                  <div>
                    <span className="fw-900 d-block small tracking-wider" style={{ fontSize: '1rem', letterSpacing: '0.08em' }}>SOS INFRABULLS</span>
                    <span className="text-white-50 text-uppercase fw-700" style={{ fontSize: '0.875rem' }}>Digital Partner</span>
                  </div>
                  <span className="badge bg-success small" style={{ fontSize: '0.875rem', height: 'fit-content' }}>ACTIVE</span>
                </div>

                <div className="d-flex gap-4 align-items-center">
                  <div className="rounded-4 overflow-hidden border border-white border-opacity-20 shadow-lg flex-shrink-0" style={{ width: '80px', height: '100px' }}>
                    <S3Image src={agentInfo.photographUrl} className="w-100 h-100 object-cover" />
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <label className="text-blue-100 opacity-50 uppercase fw-700 d-block mb-1" style={{ fontSize: '0.875rem' }}>Agent Identity</label>
                    <h5 className="fw-800 mb-3" style={{ fontSize: '1.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agentInfo.name}</h5>

                    <div className="row g-2">
                      <div className="col-6">
                        <label className="text-blue-100 opacity-50 uppercase fw-700 d-block mb-1" style={{ fontSize: '0.875rem' }}>Agent ID</label>
                        <span className="bg-white bg-opacity-10 px-2 py-1 rounded d-block text-center fw-600 font-monospace" style={{ fontSize: '0.875rem' }}>{agentInfo.agentId}</span>
                      </div>
                      <div className="col-6">
                        <label className="text-blue-100 opacity-50 uppercase fw-700 d-block mb-1" style={{ fontSize: '0.875rem' }}>Referral Code</label>
                        <span className="bg-white bg-opacity-10 px-2 py-1 rounded d-block text-center fw-600 font-monospace" style={{ fontSize: '0.875rem' }}>{agentInfo.ownReferralCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top border-white border-opacity-10 d-flex justify-content-between text-white-50 uppercase fw-700" style={{ fontSize: '0.875rem' }}>
                  <span>Joined: {agentInfo.joiningDate}</span>
                  <span>Valid Property Node</span>
                </div>
              </div>
              <p className="mt-4 text-muted small" style={{ fontSize: '0.875rem' }}>This digital card is automatically generated and verified by the HR office.</p>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && isApproved && (
            <div className="agent-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-800 m-0" style={{ letterSpacing: '-0.02em', fontSize: '1.25rem' }}>My Direct Referrals</h6>
                <span className="badge bg-primary-subtle text-primary fw-800 px-3" style={{ fontSize: '0.875rem' }}>{team.length} Member{team.length !== 1 ? 's' : ''}</span>
              </div>

              {teamLoading ? (
                <div className="py-5 text-center">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : team.length === 0 ? (
                <div className="text-center py-5 rounded-4" style={{ border: '1px dashed var(--agent-border)', background: 'var(--agent-surface-3)' }}>
                  <Users size={44} className="mb-3" style={{ color: 'var(--agent-text-dim)', opacity: 0.3 }} />
                  <h6 className="fw-700" style={{ color: 'var(--agent-text-muted)', fontSize: '1rem' }}>No team members yet</h6>
                  <p className="text-muted small mx-auto" style={{ maxWidth: '300px', lineHeight: 1.6, fontSize: '0.875rem' }}>
                    Share your referral code <strong style={{ color: 'var(--agent-accent)' }}>{agentInfo.ownReferralCode}</strong> with others to build your network.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-borderless align-middle m-0">
                    <thead>
                      <tr className="border-bottom">
                        <th className="text-muted small fw-700 uppercase pb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>Member Identity</th>
                        <th className="text-muted small fw-700 uppercase pb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>Agent ID</th>
                        <th className="text-muted small fw-700 uppercase pb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>Contact</th>
                        <th className="text-muted small fw-700 uppercase pb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.08em' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.map((member) => (
                        <tr key={member.id}>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="rounded-circle overflow-hidden flex-shrink-0" style={{ width: '36px', height: '36px', background: 'var(--agent-surface-2)', border: '1px solid var(--agent-border)' }}>
                                {member.photographUrl ? (
                                  <S3Image src={member.photographUrl} className="w-100 h-100 object-cover" />
                                ) : (
                                  <div className="w-100 h-100 d-flex align-items-center justify-content-center fw-bold small" style={{ color: 'var(--agent-accent)', fontSize: '1rem' }}>
                                    {member.fullName?.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="fw-700 small d-block" style={{ fontSize: '1rem' }}>{member.fullName}</span>
                                <span className="text-muted" style={{ fontSize: '0.875rem' }}>{member.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="font-monospace small px-2 py-1 rounded" style={{ fontSize: '0.875rem', background: 'var(--agent-surface-2)', border: '1px solid var(--agent-border)' }}>{member.agentId}</span>
                          </td>
                          <td className="py-3 fw-600 small" style={{ fontSize: '0.875rem' }}>{member.mobile1}</td>
                          <td className="py-3">
                            <span className={`badge rounded-pill px-2 py-1 ${member.status === 'Approved' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`} style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                              {member.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'settings' && (
            <div className="agent-card" style={{ maxWidth: '480px' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: 'var(--agent-accent-glow)' }}>
                  <KeyRound size={20} style={{ color: 'var(--agent-accent)' }} />
                </div>
                <h6 className="fw-800 m-0" style={{ letterSpacing: '-0.02em' }}>Account Security</h6>
              </div>

              {!hasSetPassword ? (
                <form onSubmit={handleSetPassword}>
                  {pwError && <div className="alert alert-danger small border-0 py-2 rounded-3" style={{ background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '0.875rem' }}>{pwError}</div>}
                  {pwSuccess && <div className="alert alert-success small border-0 py-2 rounded-3" style={{ background: 'rgba(16,185,129,0.06)', color: '#059669', fontSize: '0.875rem' }}>Security credentials updated successfully!</div>}

                  <div className="mb-3">
                    <label className="fw-700 text-muted small mb-1 d-block" style={{ fontSize: '0.875rem' }}>Current Temporary Password</label>
                    <input
                      type="password"
                      className="agent-input"
                      placeholder="received via email"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fw-700 text-muted small mb-1 d-block" style={{ fontSize: '0.875rem' }}>New Secure Password</label>
                    <input
                      type="password"
                      className="agent-input"
                      placeholder="min 8 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="fw-700 text-muted small mb-1 d-block" style={{ fontSize: '0.875rem' }}>Verify Password</label>
                    <input
                      type="password"
                      className="agent-input"
                      placeholder="confirm password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn w-100 py-2 fw-bold" disabled={pwLoading} style={{ background: 'var(--agent-accent)', color: 'white', borderRadius: 'var(--agent-radius)', border: 'none', boxShadow: '0 4px 12px rgba(17,116,214,0.25)', fontSize: '0.875rem' }}>
                    {pwLoading ? 'Securing Account...' : 'Set Password Permanently'}
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-4 text-center" style={{ background: 'var(--agent-surface-2)', border: '1px solid var(--agent-border)' }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '48px', height: '48px', background: 'rgba(16,185,129,0.08)' }}>
                    <Lock size={22} className="text-success" />
                  </div>
                  <h6 className="fw-800 small" style={{ fontSize: '1rem' }}>Password Secured</h6>
                  <p className="text-muted small m-0" style={{ lineHeight: 1.6, fontSize: '0.875rem' }}>Your secure password has been registered. It cannot be modified without HR intervention for security reasons.</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="agent-mobile-bottom-nav">
        {navigationItems.slice(0, 5).map((item) => {
          const isLocked = item.requiresApproval && !isApproved;
          return (
            <button
              key={item.id}
              onClick={() => { if (!isLocked) setActiveTab(item.id); }}
              disabled={isLocked}
              className={`mobile-nav-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
        <button
          onClick={() => setActiveTab('settings')}
          className={`mobile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default AgentDashboard;
