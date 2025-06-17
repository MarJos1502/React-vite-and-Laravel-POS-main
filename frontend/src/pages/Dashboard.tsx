import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title h3 mb-4">Dashboard</h1>
          
          <div className="mb-4">
            <h2 className="h5 text-muted">Welcome, {user?.name}</h2>
            <p className="text-muted">You are logged in as: {user?.role}</p>
          </div>

          <div className="row g-4">
            {/* Admin-specific widgets */}
            {user?.role === 'administrator' && (
              <>
                <div className="col-md-4">
                  <div className="card bg-primary bg-opacity-10 h-100">
                    <div className="card-body">
                      <h3 className="card-title h5 text-primary">User Management</h3>
                      <p className="card-text">Manage system users and permissions</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-purple bg-opacity-10 h-100">
                    <div className="card-body">
                      <h3 className="card-title h5 text-purple">System Settings</h3>
                      <p className="card-text">Configure system preferences</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Manager-specific widgets */}
            {(user?.role === 'manager' || user?.role === 'administrator') && (
              <>
                <div className="col-md-4">
                  <div className="card bg-success bg-opacity-10 h-100">
                    <div className="card-body">
                      <h3 className="card-title h5 text-success">Sales Overview</h3>
                      <p className="card-text">View sales reports and analytics</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-warning bg-opacity-10 h-100">
                    <div className="card-body">
                      <h3 className="card-title h5 text-warning">Inventory Status</h3>
                      <p className="card-text">Monitor stock levels</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Cashier-specific widgets */}
            {(user?.role === 'cashier' || user?.role === 'administrator' || user?.role === 'manager') && (
              <>
                <div className="col-md-4">
                  <div className="card bg-danger bg-opacity-10 h-100">
                    <div className="card-body">
                      <h3 className="card-title h5 text-danger">Recent Transactions</h3>
                      <p className="card-text">View recent sales transactions</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-info bg-opacity-10 h-100">
                    <div className="card-body">
                      <h3 className="card-title h5 text-info">Quick Actions</h3>
                      <p className="card-text">Common POS operations</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
