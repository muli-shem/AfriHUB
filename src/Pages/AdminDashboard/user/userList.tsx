import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchAllUsers, deleteUser, updateUserRole, resetUserPassword } from './userSlice';
import { FaTrash, FaKey } from 'react-icons/fa';
import './adminuser.scss'; // Assuming there's a styles file - update with correct path

const roleOptions = ['citizen', 'admin', 'officer'];

const AdminUsers = () => {
  // Update dispatch type to AppDispatch to handle thunks properly
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.adminUsers);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  // Removing unused state variable
  // const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleRoleChange = (id: number, role: string) => {
    dispatch(updateUserRole({ id, role }));
  };

  const handlePasswordReset = (email: string) => {
    setResetEmail(email);
    setShowResetModal(true);
  };

  const confirmPasswordReset = () => {
    dispatch(resetUserPassword(resetEmail));
    setShowResetModal(false);
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-users">
      <h1 className="admin-users__title">User Management</h1>
      
      {showResetModal && (
        <div className="reset-modal">
          <div className="reset-modal__content">
            <h3>Reset Password for {resetEmail}</h3>
            <p>Are you sure you want to send a password reset link?</p>
            <div className="reset-modal__actions">
              <button 
                onClick={() => setShowResetModal(false)}
                className="btn btn--cancel"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPasswordReset}
                className="btn btn--confirm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="users-table">
        <div className="users-table__header">
          <div className="users-table__row">
            <div className="users-table__cell">User</div>
            <div className="users-table__cell">Email</div>
            <div className="users-table__cell">Location</div>
            <div className="users-table__cell">Role</div>
            <div className="users-table__cell">Actions</div>
          </div>
        </div>
        <div className="users-table__body">
          {users.map((user) => (
            <div key={user.id} className="users-table__row">
              <div className="users-table__cell user-info">
                {user.profile_photo ? (
                  <img 
                    src={user.profile_photo} 
                    alt={user.username} 
                    className="user-avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.username}</span>
              </div>
              <div className="users-table__cell">{user.email}</div>
              <div className="users-table__cell">
                {user.ward}, {user.sub_county}, {user.county}
              </div>
              <div className="users-table__cell">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="role-select"
                >
                  {roleOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="users-table__cell actions">
                <button
                  onClick={() => handlePasswordReset(user.email)}
                  className="btn btn--reset"
                  title="Reset Password"
                >
                  <FaKey />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn btn--delete"
                  title="Delete User"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;