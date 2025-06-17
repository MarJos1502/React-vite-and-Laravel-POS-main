import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { routes } from '../config/routes';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const authorizedRoutes = [
    { key: 'dashboard', ...routes.dashboard },
    ...Object.entries(routes)
      .filter(([key, route]) => 
        key !== 'dashboard' && route.allowedRoles.includes(user.role)
      )
      .map(([key, route]) => ({ key, ...route }))
  ];

  // Add admin-specific routes
  if (user.role === 'administrator') {
    authorizedRoutes.push(
      { key: 'users', path: '/users', allowedRoles: ['administrator'] },
      { key: 'farewell-messages', path: '/farewell-messages', allowedRoles: ['administrator'] }
    );
  }

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand">
          POS System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {authorizedRoutes.map(({ key, path }) => (
              <li className="nav-item" key={key}>
                <Link
                  to={path}
                  className={`nav-link ${isActiveRoute(path) ? 'active' : ''}`}
                >
                  {key.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Link>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center">
            <span className="text-light me-3">
              Welcome, {user.name}
            </span>
            <button
              onClick={logout}
              className="btn btn-outline-light"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 