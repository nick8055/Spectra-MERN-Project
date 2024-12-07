import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons from react-icons
import Logo from '../../components/navbar/logo_navbar.png';

const ForgotPassword = () => {

  const [pass, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP & New Password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(60); // Timer duration in seconds
  const [showResend, setShowResend] = useState(false); // Controls visibility of "RESEND OTP" button
  const [isLoading, setIsLoading] = useState(false);

  const { email, otp, newPassword } = formData;

  // Handle input change and validation
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'newPassword') {
      validateField(name, value);
    }
  };

  // Field validation
  const validateField = (name, value) => {
    let error = '';
    if (name === 'newPassword' && 
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(value)) {
      error = 'Password must be at least 12 characters long, include uppercase, lowercase, a number, and a special character.';
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  // Request OTP
  const handleRequestOTP = async () => {
    setIsLoading(true);
    try {
      await axios.post(process.env.REACT_APP_SERVER_URL + '/api/admins/forgot-password', { email });
      setError('');
      setSuccess('OTP sent to your registered email.');
      setStep(2);
      setTimer(60); // Reset timer
      setShowResend(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Server error');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      await axios.post(process.env.REACT_APP_SERVER_URL + '/api/admins/reset-password', { email, otp, newPassword });
      setError('');
      setSuccess(<>Password reset successfully. You can now <a href="/login">log in</a>.</>);
    } 
    catch (err) {
      setError(err.response?.data?.msg || 'Server error');
    } 
    finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    handleRequestOTP();
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else {
      setShowResend(true); // Show "RESEND OTP" button when timer hits 0
    }
    return () => clearInterval(interval); // Cleanup
  }, [timer]);

  return (
    <div>
      <img className='logo' src={Logo}></img>
      <div className="form-container">
        <div className="form-title">Forgot Password</div>
        <div className='label'>
          <a href='/signup'>Sign up</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='/login'>Login</a>
        </div>
        <br/>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        {step === 1 && (
          <div>
            <div className="label">Enter Email:</div>
            <input
              className="input"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
            <button className="form-button" onClick={handleRequestOTP} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Request OTP'}
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="label">Enter OTP:</div>
            <input
              className="input"
              type="number"
              name="otp"
              value={otp}
              onChange={onChange}
              required
            />
            <div className="label">Enter New Password:</div>
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              value={newPassword}
              onChange={onChange}
              required
            />
            <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.newPassword && <div style={{ color: 'red' }}>{errors.newPassword}</div>}
            {!showResend ? (
              <div style={{ margin: '10px 0', color: 'blue' }}>
                Resend OTP in: {timer}s
              </div>
            ) : (
              <button className="form-button" onClick={handleResendOTP}>
                Resend OTP
              </button>
            )}
            <button className="form-button" onClick={handleResetPassword} disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
