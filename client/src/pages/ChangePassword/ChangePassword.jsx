import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ userId }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      await axios.patch(`/api/users/${userId}/change-password`, {
        oldPassword,
        newPassword,
      });
      setStatus('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setStatus(
        err?.response?.data?.message || 'Failed to change password.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Change Password
        </button>
        {status && <p className="text-sm text-red-500 mt-2">{status}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
