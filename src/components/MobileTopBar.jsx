import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileTopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Don't show on login/register
  const hiddenPaths = ['/login', '/register'];
  if (hiddenPaths.includes(location.pathname)) return null;

  // Show back button on detail/inner pages
  const innerPages = ['/listing/', '/conversation/', '/fixers'];
  const isInnerPage = innerPages.some(p => location.pathname.startsWith(p)) || 
    (location.pathname.startsWith('/profile/') && location.pathname !== '/profile');
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Fix-It Hub';
    if (path === '/browse') return 'Browse';
    if (path === '/fixers') return 'Find Fixers';
    if (path === '/new-listing') return 'New Listing';
    if (path === '/messages') return 'Messages';
    if (path === '/profile') return 'My Profile';
    if (path.startsWith('/profile/')) return 'Profile';
    if (path.startsWith('/listing/')) return 'Listing';
    if (path.startsWith('/conversation/')) return 'Chat';
    if (path === '/admin') return 'Admin';
    return 'Fix-It Hub';
  };

  return (
    <div className="mobile-top-bar">
      <div className="top-bar-content">
        {isInnerPage ? (
          <button
            onClick={() => navigate(-1)}
            className="top-bar-back"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="top-bar-spacer" />
        )}

        <h1 className="top-bar-title">{getPageTitle()}</h1>

        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="top-bar-avatar"
            aria-label="Profile"
          >
            <img
              src={user?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt={user?.name}
              className="avatar-img"
            />
          </button>
        ) : (
          <div className="top-bar-spacer" />
        )}
      </div>
    </div>
  );
};

export default MobileTopBar;
