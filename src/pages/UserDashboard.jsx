import React, { useState } from 'react'
import './UserDashboard.css'

/**
 * User Dashboard Component
 * Features: Order history, wishlist, account settings, security
 */
const UserDashboard = ({ user = {} }) => {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([
    {
      id: 1001,
      date: '2026-02-15',
      total: 129.99,
      status: 'delivered',
      items: ['Product 1', 'Product 2'],
    },
    {
      id: 1002,
      date: '2026-02-10',
      total: 89.99,
      status: 'shipped',
      items: ['Product 3'],
    },
  ])

  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Product 1', price: 49.99, inStock: true },
    { id: 2, name: 'Product 2', price: 79.99, inStock: true },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#51cf66'
      case 'shipped':
        return '#ffa500'
      case 'processing':
        return '#667eea'
      case 'cancelled':
        return '#ff6b6b'
      default:
        return '#999'
    }
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome, {user.name || 'Customer'}!</h1>
        <p>Manage your account, orders, and preferences</p>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 My Orders
          </button>
          <button
            className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            ❤️ Wishlist
          </button>
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            🏠 Addresses
          </button>
          <button
            className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <h2>Order History</h2>
              {orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h3>Order #{order.id}</h3>
                          <p className="order-date">Placed on {order.date}</p>
                        </div>
                        <div
                          className="order-status"
                          style={{ borderColor: getStatusColor(order.status) }}
                        >
                          <span style={{ color: getStatusColor(order.status) }}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <p key={idx}>{item}</p>
                        ))}
                      </div>

                      <div className="order-footer">
                        <span className="order-total">Total: ${order.total.toFixed(2)}</span>
                        <button className="btn-track">Track Order</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No orders yet. Start shopping!</p>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="wishlist-tab">
              <h2>My Wishlist</h2>
              {wishlist.length > 0 ? (
                <div className="wishlist-grid">
                  {wishlist.map((item) => (
                    <div key={item.id} className="wishlist-item">
                      <div className="item-image"></div>
                      <h3>{item.name}</h3>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                      <div className="item-stock">
                        {item.inStock ? (
                          <span className="in-stock">✓ In Stock</span>
                        ) : (
                          <span className="out-of-stock">✗ Out of Stock</span>
                        )}
                      </div>
                      <div className="item-actions">
                        <button className="btn-add-cart">Add to Cart</button>
                        <button className="btn-remove">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">Your wishlist is empty</p>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h2>Profile Information</h2>
              <form className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" defaultValue={user.firstName || ''} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue={user.lastName || ''} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user.email || ''} />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue={user.phone || ''} />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" defaultValue={user.dob || ''} />
                </div>

                <button className="btn-save">Save Changes</button>
              </form>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="addresses-tab">
              <h2>Saved Addresses</h2>
              <div className="addresses-list">
                <div className="address-card">
                  <div className="address-header">
                    <h3>Home Address</h3>
                    <span className="badge">Default</span>
                  </div>
                  <p>123 Main Street</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                  <div className="address-actions">
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </div>
                </div>

                <div className="address-card">
                  <div className="address-header">
                    <h3>Work Address</h3>
                  </div>
                  <p>456 Business Ave</p>
                  <p>San Francisco, CA 94105</p>
                  <p>United States</p>
                  <div className="address-actions">
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </div>
                </div>
              </div>
              <button className="btn-add-address">+ Add New Address</button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="security-tab">
              <h2>Security Settings</h2>

              <div className="security-section">
                <div className="section-header">
                  <h3>Password</h3>
                  <p>Last changed 3 months ago</p>
                </div>
                <button className="btn-change-password">Change Password</button>
              </div>

              <div className="security-section">
                <div className="section-header">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security</p>
                </div>
                <button className="btn-enable-2fa">Enable 2FA</button>
              </div>

              <div className="security-section">
                <div className="section-header">
                  <h3>Active Sessions</h3>
                  <p>Manage your active login sessions</p>
                </div>
                <div className="sessions-list">
                  <div className="session-item">
                    <div className="session-info">
                      <p className="session-device">Chrome on Windows</p>
                      <p className="session-location">New York, USA</p>
                    </div>
                    <p className="session-time">Current</p>
                  </div>
                  <div className="session-item">
                    <div className="session-info">
                      <p className="session-device">Safari on iPhone</p>
                      <p className="session-location">New York, USA</p>
                    </div>
                    <p className="session-time">Last active: 2 hours ago</p>
                  </div>
                </div>
                <button className="btn-logout-all">Sign Out All Sessions</button>
              </div>

              <div className="security-section danger">
                <div className="section-header">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button className="btn-delete-account">Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
