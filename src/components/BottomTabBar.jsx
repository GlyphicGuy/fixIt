import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Don't show on login/register pages or conversation page
  const hiddenPaths = ['/login', '/register'];
  const isConversation = location.pathname.startsWith('/conversation/');
  if (hiddenPaths.includes(location.pathname) || isConversation) return null;

  const tabs = [
    {
      key: 'home',
      label: 'Home',
      path: '/',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          {active ? (
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          )}
        </svg>
      ),
    },
    {
      key: 'browse',
      label: 'Browse',
      path: '/browse',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          {active ? (
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          )}
        </svg>
      ),
    },
    {
      key: 'post',
      label: 'Post',
      path: '/new-listing',
      isFab: true,
      icon: () => (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      key: 'messages',
      label: 'Messages',
      path: '/messages',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          {active ? (
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          )}
        </svg>
      ),
    },
    {
      key: 'profile',
      label: 'Profile',
      path: '/profile',
      icon: (active) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          {active ? (
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          )}
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTabPress = (tab) => {
    if (!isAuthenticated && ['/messages', '/profile', '/new-listing'].includes(tab.path)) {
      navigate('/login');
      return;
    }
    navigate(tab.path);
  };

  return (
    <div className="mobile-bottom-tab-bar">
      <div className="tab-bar-inner">
        {tabs.map((tab) => {
          const active = isActive(tab.path);

          if (tab.isFab) {
            return (
              <button
                key={tab.key}
                onClick={() => handleTabPress(tab)}
                className="tab-fab"
                aria-label={tab.label}
              >
                <div className="tab-fab-circle">
                  {tab.icon(false)}
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.key}
              onClick={() => handleTabPress(tab)}
              className={`tab-item ${active ? 'tab-active' : ''}`}
              aria-label={tab.label}
            >
              <div className={`tab-icon ${active ? 'tab-icon-active' : ''}`}>
                {tab.icon(active)}
              </div>
              <span className={`tab-label ${active ? 'tab-label-active' : ''}`}>
                {tab.label}
              </span>
              {active && <div className="tab-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabBar;
