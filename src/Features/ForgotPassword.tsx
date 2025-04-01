import { useState } from 'react';
import '../styles/ForgotPassword.scss';
import { LocalURL } from '../utils'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // This endpoint matches your existing resetPasswordController
      const response = await fetch(`${LocalURL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage(data.message);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="title">Forgot Password</h2>
      
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
          <label htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
      
      <div className="login-link">
        <a href="/login">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;