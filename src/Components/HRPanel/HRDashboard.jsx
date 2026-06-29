import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, LogOut, Search, Menu, X,
  Eye, CheckCircle2, XCircle, Clock, Loader2, RefreshCw, ExternalLink,
  ChevronRight, Mail, Phone, Calendar, UserPlus, Download, Users2, Trash2
} from 'lucide-react';
import {
  fetchAllAgents,
  approveAgent,
  unapproveAgent,
  deleteAgent,
  formatAgentName,
  formatDate,
} from '../Firebase/hrHelpers';
import S3Image from '../S3Image';
import { getImageViewUrl } from '../Firebase/s3UploadService';
import { signOutAdmin } from '../Firebase/authHelpers';
import AddAgent from './AddAgent';
import './HRPanel.css';

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('registrations');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewingTeamOf, setViewingTeamOf] = useState(null);
  const searchInputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllAgents();
      setAgents(data);
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stats = {
    total: agents.length,
    pending: agents.filter((a) => a.status !== 'Approved').length,
    approved: agents.filter((a) => a.status === 'Approved').length,
  };

  const filteredAgents = agents.filter((a) => {
    const q = searchQuery.toLowerCase();
    const name = formatAgentName(a).toLowerCase();
    const referralCode = (a.ownReferralCode || '').toLowerCase();
    return name.includes(q) || referralCode.includes(q) || (a.email || '').toLowerCase().includes(q) || (a.mobile1 || '').includes(q);
  });

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setSelectedAgent(null);
    setViewingTeamOf(null);
    setSidebarOpen(false);
  };

  const handleView = (agent) => {
    setSelectedAgent(agent);
    setActiveTab('details');
    setSidebarOpen(false);
  };

  const handleApprove = async (agent) => {
    setActionLoading(true);
    try {
      await approveAgent(agent.id, agent.partnerRequestId);
      await loadAgents();
      if (selectedAgent?.id === agent.id) setSelectedAgent((prev) => ({ ...prev, status: 'Approved' }));
    } catch (err) {
      alert('Failed to approve. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnapprove = async (agent) => {
    setActionLoading(true);
    try {
      await unapproveAgent(agent.id, agent.partnerRequestId);
      await loadAgents();
      if (selectedAgent?.id === agent.id) setSelectedAgent((prev) => ({ ...prev, status: 'Pending' }));
    } catch (err) {
      alert('Failed to unapprove. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (agent) => {
    if (!window.confirm(`Are you sure you want to delete ${formatAgentName(agent)}? This action cannot be undone.`)) return;
    setActionLoading(true);
    try {
      await deleteAgent(agent.id, agent.partnerRequestId);
      await loadAgents();
      if (selectedAgent?.id === agent.id) setSelectedAgent(null);
    } catch (err) {
      console.error('Deletion failed detailed error:', err);
      alert(`Failed to delete partner: ${err.message || 'Unknown error'}`);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadCSV = () => {
    const approvedAgents = agents.filter(a => a.status === 'Approved');
    if (approvedAgents.length === 0) {
      alert("No approved partners to download.");
      return;
    }

    const headers = [
      'Partner ID', 'Name', 'Email', 'Mobile', 'Referral Code', 'Applied On', 'Status'
    ];

    const rows = approvedAgents.map(a => [
      a.agentId || '',
      formatAgentName(a),
      a.email || '',
      a.mobile1 || '',
      a.ownReferralCode || '',
      formatDate(a.createdAt),
      a.status || 'Pending'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `approved_partners_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'registrations', name: 'Registrations', icon: UserCheck },
    { id: 'approved', name: 'Approved Partners', icon: Users },
    { id: 'add-agent', name: 'Add Partner', icon: UserPlus },
  ];

  const currentList = (() => {
    let list = activeTab === 'approved'
      ? filteredAgents.filter((a) => a.status === 'Approved')
      : filteredAgents;

    if (viewingTeamOf) {
      list = agents.filter(a => a.referralCode === viewingTeamOf.ownReferralCode);
    }
    return list;
  })();

  return (
    <div className="hr-panel-wrapper">
      {/* Mobile Top Bar */}
      <div className="hr-mobile-top-bar d-lg-none">
        <img src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png" alt="SOS Infrabulls" className="hr-mobile-logo" />
        <div className="hr-mobile-actions">
           <button className="hr-refresh-btn small" onClick={loadAgents} disabled={loading}>
             <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
           </button>
           <button className="hr-mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
             {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {/* Sidebar - Now a Drawer on Mobile */}
      <aside className={`hr-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="hr-sidebar-brand d-none d-lg-flex">
          <div className="d-flex flex-column align-items-center gap-3">
            <img src="https://res.cloudinary.com/dlsbj8nug/image/upload/v1782555285/logo_2x_vvvpyz.png" alt="SOS Infrabulls" className="hr-sidebar-logo" />
            <div className="text-center">
              <p className="hr-brand-label mb-0">HR Portal</p>
            </div>
          </div>
        </div>

        <div className="hr-nav-section">
          <div className="d-lg-none p-3 border-bottom mb-3">
            <h6 className="text-muted small fw-bold text-uppercase mb-0">Management Menu</h6>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`hr-nav-link ${activeTab === item.id || (activeTab === 'details' && item.id === 'registrations') ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="hr-sidebar-footer">
          <Link to="/admin" className="hr-nav-link">
            <LayoutDashboard size={18} />
            <span>Content Admin</span>
          </Link>
          <button onClick={handleLogout} className="hr-nav-link text-danger">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="hr-mobile-bottom-nav d-lg-none">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`hr-m-nav-item ${activeTab === item.id || (activeTab === 'details' && item.id === 'registrations') ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="hr-main">
        {/* Header Row */}
        <div className="hr-header-row d-none d-lg-flex">
          <div className="hr-page-title">
            <h1>{activeTab === 'dashboard' ? 'HR Dashboard' : 
                 activeTab === 'registrations' ? 'Partner Registrations' :
                 activeTab === 'approved' ? 'Approved Partners' : 
                 activeTab === 'add-agent' ? 'Add New Partner' : 'Applicant Details'}</h1>
            <p>{activeTab === 'details' ? 'Detailed view of partner application' : 
                activeTab === 'add-agent' ? 'Manually register a new partner node' : 'Manage partner onboarding & approvals'}</p>
          </div>
          <button className="hr-refresh-btn" onClick={loadAgents} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Mobile Page Indicator */}
        <div className="hr-mobile-header d-lg-none mb-4">
           <h2 className="m-0 fw-800 fs-4">
             {activeTab === 'dashboard' ? 'HR Dashboard' : 
              activeTab === 'registrations' ? 'Registrations' :
              activeTab === 'approved' ? 'Active Partners' : 
              activeTab === 'add-agent' ? 'Add Partner' : 'Partner Details'}
           </h2>
        </div>

        {activeTab !== 'details' && (
          <div className="hr-search-wrap">
            <Search className="hr-search-icon" size={20} />
            <input 
              ref={searchInputRef}
              type="text" 
              className="hr-search-input" 
              placeholder="Search by name, referral code, email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="hr-search-clear" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
            <div className="hr-search-badge">
              <span>Press / to focus</span>
            </div>
          </div>
        )}

        {loading && agents.length === 0 ? (
          <div className="d-flex flex-column align-items-center py-5">
            <Loader2 className="animate-spin text-primary mb-3" size={48} />
            <p className="text-muted fw-500">Loading registrations...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="hr-stats-row">
                <div className="hr-stat-card">
                  <span className="hr-col-label mb-2 d-block">Total Registrations</span>
                  <div className="d-flex align-items-baseline gap-2">
                    <h3 className="m-0 fw-800">{stats.total}</h3>
                    <span className="text-muted small">Applications</span>
                  </div>
                </div>
                <div className="hr-stat-card">
                  <span className="hr-col-label mb-2 d-block">Pending Approval</span>
                  <div className="d-flex align-items-baseline gap-2">
                    <h3 className="m-0 fw-800 text-warning">{stats.pending}</h3>
                    <span className="text-muted small">New tasks</span>
                  </div>
                </div>
                <div className="hr-stat-card">
                  <span className="hr-col-label mb-2 d-block">Approved Partners</span>
                  <div className="d-flex align-items-baseline gap-2">
                    <h3 className="m-0 fw-800 text-success">{stats.approved}</h3>
                    <span className="text-muted small">Active network</span>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'registrations' || activeTab === 'approved') && (
              <div className="hr-table-card">
                <div className="hr-table-header">
                  <div className="d-flex flex-column">
                    <h2>
                      {viewingTeamOf 
                        ? `Team Members of ${formatAgentName(viewingTeamOf)}` 
                        : activeTab === 'approved' ? 'Active Partners' : 'All Partner Registrations'}
                    </h2>
                    <p>{currentList.length} record{currentList.length !== 1 ? 's' : ''} found</p>
                  </div>
                  <div className="d-flex gap-2">
                    {viewingTeamOf && (
                      <button className="btn-hr-view" onClick={() => setViewingTeamOf(null)}>
                        Back to List
                      </button>
                    )}
                    {activeTab === 'approved' && !viewingTeamOf && (
                      <button className="btn-hr-approve" onClick={downloadCSV}>
                        <Download size={14} className="me-2" /> Download CSV
                      </button>
                    )}
                  </div>
                </div>
                <div className="hr-table-cols">
                  <div className="hr-col-label">Applicant</div>
                  <div className="hr-col-label">Contact</div>
                  <div className="hr-col-label">Applied On</div>
                  <div className="hr-col-label">Status</div>
                  <div className="hr-col-label text-end">Actions</div>
                </div>
                <div className="hr-rows-container">
                  {currentList.length === 0 ? (
                    <div className="p-5 text-center text-muted">No registrations found</div>
                  ) : (
                    currentList.map((agent) => (
                      <div className="hr-row" key={agent.id}>
                        <div className="hr-applicant-info d-flex align-items-center gap-3">
                          <div className="hr-table-avatar rounded-circle overflow-hidden flex-shrink-0 border" style={{ width: '38px', height: '38px', borderColor: 'var(--hr-border)' }}>
                            {agent.photographUrl ? (
                              <S3Image src={agent.photographUrl} className="w-100 h-100 object-cover" />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center fw-bold text-uppercase" style={{ background: 'linear-gradient(135deg, rgba(74, 151, 228, 0.1) 0%, rgba(74, 151, 228, 0.25) 100%)', color: 'var(--hr-accent)', fontSize: '0.85rem' }}>
                                {formatAgentName(agent).charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-truncate m-0" style={{ maxWidth: '180px', fontSize: '0.88rem' }}>{formatAgentName(agent)}</h4>
                            <div className="d-flex gap-2 align-items-center mt-1">
                              <span className="badge font-monospace text-primary bg-primary-subtle border border-primary-subtle" style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
                                {agent.agentId || 'Pending'}
                              </span>
                              <span className="text-muted small">•</span>
                              <p className="m-0 text-muted text-truncate" style={{ maxWidth: '140px', fontSize: '0.75rem' }} title={agent.email}>{agent.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="hr-contact-info d-flex align-items-center gap-2">
                          <Phone size={13} className="text-muted" style={{ opacity: 0.6 }} />
                          <span>{agent.mobile1}</span>
                        </div>
                        <div className="hr-date-info d-flex align-items-center gap-2 text-muted">
                          <Calendar size={13} className="text-muted" style={{ opacity: 0.6 }} />
                          <span>{formatDate(agent.createdAt)}</span>
                        </div>
                        <div>
                          <span className={`hr-status-badge ${agent.status === 'Approved' ? 'approved' : 'pending'}`}>
                            {agent.status || 'Pending'}
                          </span>
                        </div>
                        <div className="hr-action-btns">
                          <button className="btn-hr-view" onClick={() => handleView(agent)}>
                            <Eye size={14} /> View
                          </button>
                          <button 
                            className="btn-hr-delete" 
                            onClick={() => handleDelete(agent)}
                            disabled={actionLoading}
                            title="Delete Partner"
                          >
                            <Trash2 size={14} />
                          </button>
                          {agent.status === 'Approved' && (
                            <>
                              <button 
                                className="btn-hr-view" 
                                onClick={() => setViewingTeamOf(agent)}
                                title="View Team"
                              >
                                <Users2 size={14} /> Team
                              </button>
                              <button 
                                className="btn-hr-unapprove" 
                                onClick={() => handleUnapprove(agent)}
                                disabled={actionLoading}
                              >
                                Unapprove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'add-agent' && (
              <div className="hr-add-agent-container">
                <AddAgent onAgentAdded={loadAgents} />
              </div>
            )}

            {activeTab === 'details' && selectedAgent && (
              <div className="hr-details-card">
                <div className="p-3 border-bottom d-flex align-items-center">
                   <button className="btn btn-link text-decoration-none text-muted small fw-bold" onClick={() => navigateTo('registrations')}>
                     ← Back to List
                   </button>
                </div>
                <div className="hr-details-hero">
                  {selectedAgent.photographUrl ? (
                    <S3Image src={selectedAgent.photographUrl} alt="" className="hr-details-photo" />
                  ) : (
                    <div className="hr-details-photo bg-slate-100 d-flex align-items-center justify-content-center text-primary fw-bold fs-2">
                       {formatAgentName(selectedAgent).charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="m-0 fw-800">{formatAgentName(selectedAgent)}</h2>
                    <p className="text-muted m-0">{selectedAgent.email}</p>
                    <div className="mt-3">
                      <span className={`hr-status-badge ${selectedAgent.status === 'Approved' ? 'approved' : 'pending'}`}>
                        {selectedAgent.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hr-details-grid">
                  <div className="hr-details-sec">
                    <h3>Personal & Agent Information</h3>
                    <div className="hr-info-item">
                       <label>Partner ID</label>
                       <span className="text-primary fw-bold">{selectedAgent.agentId || 'Pending'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Own Referral Code</label>
                       <span className="fw-bold">{selectedAgent.ownReferralCode || 'Pending'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Full Name</label>
                       <span>{formatAgentName(selectedAgent)}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Date of Birth</label>
                       <span>{selectedAgent.dob || '—'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Father/Husband Name</label>
                       <span>{selectedAgent.fatherHusbandName || '—'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Mobile Number</label>
                       <span>{selectedAgent.mobile1}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Local Address</label>
                       <span className="text-end" style={{ maxWidth: '200px' }}>
                         {selectedAgent.localAddressLine ? `${selectedAgent.localAddressLine}, ${selectedAgent.localCity}, ${selectedAgent.localState} - ${selectedAgent.localPinCode}` : '—'}
                       </span>
                    </div>
                  </div>

                  <div className="hr-details-sec">
                    <h3>Professional & Referral</h3>
                    <div className="hr-info-item">
                       <label>Referral Code Used</label>
                       <span className="text-success fw-bold">{selectedAgent.referralCode || '—'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Reference</label>
                       <span>{selectedAgent.reference || '—'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Department</label>
                       <span>{selectedAgent.department || '—'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Leader Name</label>
                       <span>{selectedAgent.leaderName || '—'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Plan By</label>
                       <span>{selectedAgent.planBy || '—'}</span>
                    </div>

                    <h3 className="mt-4">Onboarding Documents</h3>
                    <div className="hr-info-item">
                       <label>PAN Card Number</label>
                       <span>{selectedAgent.panCardNo || '—'}</span>
                    </div>
                    <div className="hr-info-item">
                       <label>Aadhaar Card Number</label>
                       <span>{selectedAgent.aadhaarCardNo || '—'}</span>
                    </div>
                    
                    <div className="row g-3 mt-2">
                      <div className="col-6">
                        <div className="hr-doc-box">
                          <S3Image src={selectedAgent.panCardUrl} className="hr-doc-thumb" />
                          <button 
                            className="btn btn-sm btn-link text-decoration-none p-0 fw-bold small" 
                            onClick={async () => {
                              const url = await getImageViewUrl(selectedAgent.panCardUrl);
                              if (url) window.open(url, '_blank');
                            }}
                          >
                            View PAN <ExternalLink size={10} />
                          </button>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="hr-doc-box">
                          <S3Image src={selectedAgent.aadhaarCardUrl} className="hr-doc-thumb" />
                          <button 
                            className="btn btn-sm btn-link text-decoration-none p-0 fw-bold small"
                            onClick={async () => {
                              const url = await getImageViewUrl(selectedAgent.aadhaarCardUrl);
                              if (url) window.open(url, '_blank');
                            }}
                          >
                            View AADHAAR <ExternalLink size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-light border-top d-flex gap-2">
                   {selectedAgent.status !== 'Approved' ? (
                     <button className="btn btn-primary px-4 fw-bold" onClick={() => handleApprove(selectedAgent)} disabled={actionLoading}>
                       {actionLoading ? 'Processing...' : 'Approve Application'}
                     </button>
                   ) : (
                     <button className="btn btn-outline-danger px-4 fw-bold" onClick={() => handleUnapprove(selectedAgent)} disabled={actionLoading}>
                       {actionLoading ? 'Processing...' : 'Revoke Approval'}
                     </button>
                   )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HRDashboard;
