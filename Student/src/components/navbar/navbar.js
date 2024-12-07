import React, { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import { LuLogOut } from "react-icons/lu";
import './navbar.css';
import logo from "./logo_navbar.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [universityRegId, setUniversityRegId] = useState("");
    const userBoxRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:9000/api/students/getStudent', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setUniversityRegId(res.data.student.universityRegId || "Guest");
            } catch (err) {
                console.error("Error fetching user data:", err);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    // Toggle userbox when clicking the button
    const toggleUserBox = () => {
        setIsOpen(prevState => !prevState);
    };

    // Close the userbox when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userBoxRef.current && 
                !userBoxRef.current.contains(event.target) &&
                !event.target.closest('.navbar-button')
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='navbar'>
            <Link to="/">
                <img className='navbar-logo' src={logo} alt="App Logo" />
            </Link>
            <button className={`navbar-button ${isOpen ? 'open' : ''}`} onClick={toggleUserBox}>
                <FaUser />
            </button>
            <div 
                className={`navbar-userbox ${isOpen ? 'open' : ''}`} 
                ref={userBoxRef}
            >
                <div className='username'>HELLO <strong>{universityRegId}</strong></div>
                <button onClick={handleLogout} className='logout-button'>
                    <LuLogOut />&nbsp;LOGOUT
                </button>
            </div>
        </div>
    );
}

export default Navbar;
