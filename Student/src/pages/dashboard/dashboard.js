import React, { useState, useEffect } from 'react';
import './dashboard.css';
import axios from 'axios';
import ChartApp from '../../components/piechart/piechart';
import { FaBriefcase, FaTachometerAlt, FaHourglass, FaTrophy } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [batch, setBatch] = useState(''); // State for the batch year of the student
    const [internExpCounts, setInternExpCount] = useState(0);
    const [internNewCounts, setInternNewCount] = useState(0);

    const [jobExpCounts, setJobExpCount] = useState(0);
    const [jobNewCounts, setJobNewCount] = useState(0);

    const [hackExpCounts, setHackExpCount] = useState(0);
    const [hackNewCounts, setHackNewCount] = useState(0);

    // Fetch the batch year of the logged-in student
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get(process.env.REACT_APP_SERVER_URL + '/api/students/getStudent', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                if (res.data && res.data.student && res.data.student.universityRegId) {
                    const joinYear = parseInt(res.data.student.universityRegId.substring(3, 5)) + 2000;
                    setBatch(joinYear + 4); // Set the graduation year
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                navigate('/login');
            }
        };

        fetchUserDetails();
    }, [navigate]);

    // Fetch job counts based on the student's batch
    useEffect(() => {
        if (batch !== '') {
            axios.get(process.env.REACT_APP_SERVER_URL + `/api/count/count?batch=${batch}`)
                .then(response => {
                    // Assuming response contains the counts for all batches; adjust as needed
                    setJobExpCount(response.data.expired_counts_jobs);
                    setJobNewCount(response.data.new_counts_jobs);
                    setInternExpCount(response.data.expired_counts_internships);
                    setInternNewCount(response.data.new_counts_internships);
                    setHackExpCount(response.data.expired_counts_hackathons);
                    setHackNewCount(response.data.new_counts_hackathons);
                })
                .catch(error => {
                    console.error('Error fetching counts:', error);
                });
        }
    }, [batch]);

    return (
        <div>
            <h1 className='page-title'>DASHBOARD</h1><br />
            <div className='page-title-border-container'>
                <div className='page-title-border'></div>
            </div>

            <div className='dashboard-flexbox-charts'>
                <ChartApp data1={jobNewCounts} data2={jobExpCounts} pietitle={'JOBS'} />
                <ChartApp data1={internNewCounts} data2={internExpCounts} pietitle={'INTERNSHIPS'} />
                <ChartApp data1={hackNewCounts} data2={hackExpCounts} pietitle={'HACKATHONS'} />
            </div>

            <div className='dashboard-flexbox-links'>
                <Link className='dash-box' to='/jobs'>
                    <div className='dash-box-title'>View Jobs</div>
                    <div className='dash-box-icon'><FaHourglass /></div>
                </Link>

                <Link className='dash-box' to='/internships'>
                    <div className='dash-box-title'>View Internships</div>
                    <div className='dash-box-icon'><FaBriefcase /></div>
                </Link>

                <Link className='dash-box' to='/hackathons'>
                    <div className='dash-box-title'>View Hackathons</div>
                    <div className='dash-box-icon'><FaTrophy /></div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;

