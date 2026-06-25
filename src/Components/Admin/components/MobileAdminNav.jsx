import React, { useState } from 'react';
import { Menu, X, LogOut, Users, ExternalLink } from 'lucide-react';
import { ADMIN_SECTIONS } from '../config/sections';
import { Link } from 'react-router-dom';

const MobileAdminNav = ({ active, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigate = (id) => {
        onNavigate(id);
        setIsOpen(false);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="admin-mobile-top d-lg-none">
                <img src="/images/logo/logo@2x.png" alt="Logo" className="mobile-admin-logo" />
                <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Drawer */}
            <div className={`admin-mobile-drawer d-lg-none ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <img src="/images/logo/logo@2x.png" alt="Logo" className="drawer-logo" />
                    <span className="drawer-label">Admin Management</span>
                </div>
                
                <nav className="drawer-nav">
                    {ADMIN_SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            className={`drawer-link ${active === id ? 'active' : ''}`}
                            onClick={() => handleNavigate(id)}
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </button>
                    ))}
                    
                    <div className="drawer-divider">System Links</div>
                    
                    <Link to="/hr-panel" className="drawer-link">
                        <Users size={20} />
                        <span>HR Panel</span>
                    </Link>
                    <Link to="/" className="drawer-link">
                        <ExternalLink size={20} />
                        <span>Live Site</span>
                    </Link>
                    <button className="drawer-link text-danger border-0 bg-transparent w-100 text-start" onClick={() => window.location.href = '/'}>
                        <LogOut size={20} />
                        <span>Exit Admin</span>
                    </button>
                </nav>
            </div>

            {/* Backdrop */}
            {isOpen && <div className="admin-drawer-backdrop d-lg-none" onClick={() => setIsOpen(false)} />}

            {/* Quick Actions Bottom Nav */}
            <nav className="admin-bottom-nav d-lg-none">
                {ADMIN_SECTIONS.slice(0, 4).map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`bottom-nav-item ${active === id ? 'active' : ''}`}
                        onClick={() => onNavigate(id)}
                    >
                        <Icon size={20} />
                        <span>{label.split(' ')[0]}</span>
                    </button>
                ))}
            </nav>
        </>
    );
};

export default MobileAdminNav;
