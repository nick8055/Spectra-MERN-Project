import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons from react-icons
import Logo from '../../components/navbar/logo_navbar.png';

const Login = () => {

  const [pass, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const { username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    try {
      const res = await axios.post(process.env.REACT_APP_SERVER_URL + '/api/admins/login', formData);
      localStorage.setItem('token', res.data.token);
      setError('');
      alert('Login successful');
      navigate('/');
      // Store the token and redirect to dashboard or any protected route
    } 
    catch (err) {
      setError(err.response.data.msg || 'Server error');
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
  <div>
    <img className='logo' src={Logo}></img>
    <div className='form-container'>
      <div className='form-title'>Login</div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div className='label'>Username:</div>
        <br/>
        <input className='input'type="text" name="username" value={username} onChange={onChange} required />
        <br/>
        <div className='label'>Password:</div>
        <br/>
        <input className='input' type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={onChange} required />
            <button type="button" className="eye-button" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        <br/>
        <button className='form-button' type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <br/>
      <div className='label'>Not registered into this portal yet? Kindly <a href='/signup'>SIGN UP</a> then</div>
      <div className='label'>Forgot Password? <a href='/forgotPass'>CLICK HERE</a></div>
      <div className='label'>Forgot Username? <a href='/forgotUser'>CLICK HERE</a></div>
    </div>
  </div>
  );
};

export default Login;
