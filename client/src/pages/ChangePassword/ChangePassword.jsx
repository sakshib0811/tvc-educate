import React, { useState, useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';
import { baseURL } from '../../utils';
import useHttpClient from '../../hooks/useHttpClient';
import ErrorModal from '../../components/Modal/ErrorModal';

const ChangePassword = () => {
  const { userId } = useParams();
  const history = useHistory();
  const { currentUser, isLoggedIn } = useContext(AuthContext);
  const { sendReq, error, clearError } = useHttpClient();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/auth');
    }
  }, [isLoggedIn, history]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setIsLoading(true);



    try {
      const response = await sendReq(
        `${baseURL}/users/${userId}/change-password`,
        'PATCH',
        JSON.stringify({
          oldPassword,
          newPassword,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        }
      );
      

      setStatus('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      console.error('Password change error:', err);
      setStatus(
        err?.response?.data?.message || 'Failed to change password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
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
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border px-3 py-2 rounded"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
          {status && (
            <p className={`text-sm mt-2 ${status.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
