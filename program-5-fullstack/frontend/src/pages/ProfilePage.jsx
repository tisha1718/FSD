import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateProfile({ name, phone });
      if (res.success) {
        updateUser(res.user);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Profile update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-avatar-big">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className={`role-chip ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
              {user.role.toUpperCase()} ACCOUNT
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="field-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label>Email Address (Immutable)</label>
            <input 
              type="email" 
              value={user.email} 
              disabled 
              className="input-disabled"
            />
          </div>

          <div className="field-group">
            <label>Mobile Contact Number</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
            />
          </div>

          <div className="profile-info-grid">
            <div className="info-item">
              <span className="info-lbl">Account Identifier</span>
              <span className="info-val">USR-00{user.id}</span>
            </div>
            <div className="info-item">
              <span className="info-lbl">System Authorization</span>
              <span className="info-val">{user.role}</span>
            </div>
          </div>

          <button type="submit" className="btn-save-profile" disabled={saving}>
            {saving ? 'Updating...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
