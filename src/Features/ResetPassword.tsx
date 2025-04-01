import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResetPassword.scss';
import { LocalURL } from '../utils'

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError('Invalid password reset link');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // This will need a matching backend endpoint
      const response = await fetch(`${LocalURL}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="title">Reset Your Password</h2>
      
      {message && (
        <div className="message success">
          {message}
        </div>
      )}
      
      {error && (
        <div className="message error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !token}
          className={isLoading || !token ? 'loading' : ''}
        >
          {isLoading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;