import './sidebar.css';
import { Link } from "react-router-dom";
import logo from './logo_sidebar.png'
import React, { useState } from 'react';
import { FaBriefcase, FaTachometerAlt, FaHourglass, FaTrophy } from 'react-icons/fa';
import { LuArrowLeftSquare, LuArrowRightSquare } from "react-icons/lu";

function Sidebar(){
    const [isOpen, setIsOpen] = useState(false);

    function toggleSidebar(){
        setIsOpen(!isOpen);
    }

    return(
     <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className={`toggleButton ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
            {isOpen ? <LuArrowLeftSquare/> : <LuArrowRightSquare/>}
        </button>
        <a href='/'><img className='sidebar-logo' src={logo}/></a>
        <div className='sidebar-link-container'>
            <div className='sidebar-link'><Link to='/dashboard'><FaTachometerAlt/>&nbsp;&nbsp;DASHBOARD</Link></div>
            <div className='sidebar-link'><Link to='/add_job'><FaHourglass/>&nbsp;&nbsp;ADD JOB + </Link></div>
            <div className='sidebar-link'><Link to='/add_intern'><FaBriefcase/>&nbsp;&nbsp;ADD INTERNSHIP + </Link></div>
            <div className='sidebar-link'><Link to='/add_hack'><FaTrophy/>&nbsp;&nbsp;ADD HACKATHON + </Link></div>
            <div className='sidebar-link'><Link to='/jobs'><FaHourglass/>&nbsp;&nbsp;JOBS</Link></div>
            <div className='sidebar-link'><Link to='/internships'><FaBriefcase/>&nbsp;&nbsp;INTERNSHIPS</Link></div>
            <div className='sidebar-link'><Link to='/hackathons'><FaTrophy/>&nbsp;&nbsp;HACKATHONS</Link></div>
            <div className='sidebar-link'><Link to='/spreadsheet'>STUDENTS</Link></div> 
        </div>
     </div>
    )
}

export default Sidebar;