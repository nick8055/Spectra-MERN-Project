import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons from react-icons
import Logo from '../../components/navbar/logo_navbar.png';

const Signup = () => {

  const [pass, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    universityRegId: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendAllowed, setResendAllowed] = useState(false);
  const [timeout, setTimeoutDuration] = useState(60); // Timeout duration in seconds
  const [serverError, setServerError] = useState('');

  const { name, universityRegId, email, mobile, password } = formData;

  useEffect(() => {
    // Extract query parameters
    const queryParams = new URLSearchParams(location.search);
    const name1 = queryParams.get('name') || '';
    const email1 = queryParams.get('email') || '';
    const regNo = queryParams.get('regNo') || '';

    // Update formData with extracted values
    setFormData(prevState => ({
      ...prevState,
      name: name1,
      universityRegId: regNo,
      email: email1
    }));
}, [location]);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Name can only contain letters and spaces.';
        }
        break;
      case 'universityRegId':
        if (!/^(URK|ULK|UTK)\d{2}CS[57]\d{3}$/.test(value)) {
          error = 'Reg ID is either Invalid or not part of AIML department.';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email format.';
        }
        break;
      case 'mobile':
        if (!/^\+91\d{10}$/.test(value)) {
          error = 'Enter a valid mobile number with +91 prefix.';
        }
        break;
      case 'password':
        if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{12,}$/.test(value)) {
          error = 'Password must be at least 12 characters long, include uppercase, lowercase, a number, and a special character.';
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value); // Validate each field as it changes
  };

  const startTimeout = () => {
    let timer = 60;
    setTimeoutDuration(timer);
    const interval = setInterval(() => {
      timer -= 1;
      setTimeoutDuration(timer);
      if (timer === 0) {
        clearInterval(interval);
        setResendAllowed(true);
      }
    }, 1000);
  };

  const onSubmit = async event => {
    event.preventDefault();
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) return;
    setIsLoading(true);
    try {
      await axios.post(process.env.REACT_APP_SERVER_URL + '/api/students/register-temp', { name, universityRegId, email, mobile, password });
      setOtpSent(true);
      setServerError('');
      setResendAllowed(false);
      startTimeout();
    } 
    catch (error) {
      setServerError(error.response?.data?.msg || 'Registration failed');
    }
    finally{
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(process.env.REACT_APP_SERVER_URL + '/api/students/verify-otp', { universityRegId, otp });
      setOtpSent(false);
      navigate('/login');
      alert('Registration successful, you can now log in');
    } 
    catch (error) {
      setServerError(error.response?.data?.msg || 'OTP verification failed');
    }
    finally{
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(process.env.REACT_APP_SERVER_URL + '/api/students/resend-otp', { universityRegId });
      setResendAllowed(false);
      startTimeout();
    } 
    catch (error) {
      setServerError(error.response?.data?.msg || 'Failed to resend OTP');
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div>
    <img className='logo' src={Logo}></img>
    <div className='form-container'>
      <div className='form-title'>Sign Up</div>
      <div className='label'>Already registered? <a href='/login'>LOGIN</a> here</div>
      {serverError && <div style={{ color: 'red' }}>{serverError}</div>}
      <form onSubmit={onSubmit}>
        {!otpSent ? (
          <>
            <div className='label'>Name</div>
            <input className='input' type="text" name="name" value={name} onChange={onChange} required readOnly/>
            {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}

            <div className='label'>University Reg ID</div>
            <input className='input' type="text" name="universityRegId" value={universityRegId} onChange={onChange} required readOnly/>
            {errors.universityRegId && <div style={{ color: 'red' }}>{errors.universityRegId}</div>}

            <div className='label'>Email</div>
            <input className='input' type="email" name="email" value={email} onChange={onChange} required readOnly/>
            {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}

            <div className='label'>Mobile (+91XXXXXXXXXX)</div>
            <input className='input' type="text" name="mobile" value={mobile} onChange={onChange} required />
            {errors.mobile && <div style={{ color: 'red' }}>{errors.mobile}</div>}

            <div className='label'>Password</div>
            <input className='input' type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={onChange} required />
            <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}

            <button className='form-button' type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Register'}
            </button>
          </>
        ) : (
          <>
            <div className='label'>Enter OTP Sent to Your Email:</div>
            <input className='input' type="number" name="otp" value={otp} onChange={e => setOtp(e.target.value)} required />
            <button className='form-button' type="button" onClick={verifyOtp} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className='label'>Time Remaining: {timeout} seconds</div>
            {resendAllowed && 
            <button className='form-button' type="button" onClick={resendOtp} disabled={isLoading}>
              {isLoading ? 'Resending...' : 'Resend OTP'}
            </button>
            }
          </>
        )}
      </form>
    </div>
    </div>
  );
};

export default Signup;

