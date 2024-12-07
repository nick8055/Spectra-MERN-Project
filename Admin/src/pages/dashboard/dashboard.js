import React from 'react';
import './dashboard.css';
import { useState, useEffect} from 'react';
import axios from 'axios';
import ChartApp from '../../components/piechart/piechart';
import { FaBriefcase, FaTachometerAlt, FaHourglass, FaTrophy } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Dashboard = () => {

    const [intern_exp_counts, setInternExpCount] = useState(0);
    const [intern_new_counts, setInternNewCount] = useState(0);
  
    const [job_exp_counts, setJobExpCount] = useState(0);
    const [job_new_counts, setJobNewCount] = useState(0);
  
    const [hack_exp_counts, setHackExpCount] = useState(0);
    const [hack_new_counts, setHackNewCount] = useState(0);
  
    useEffect(() => {
      // Fetch the internship count from the backend
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/internships/count')
        .then(response => {
  
          setInternExpCount(response.data.expired_counts);
          setInternNewCount(response.data.new_counts);
  
        })
        .catch(error => {
          console.error('Error fetching the count!', error);
        });
    }, []);

    useEffect(() => {
      // Fetch the internship count from the backend
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/jobs/count')
        .then(response => {
  
          setJobExpCount(response.data.expired_counts_jobs);
          setJobNewCount(response.data.new_counts_jobs);
  
        })
        .catch(error => {
          console.error('Error fetching the count!', error);
        });
    }, []);

    useEffect(() => {
      // Fetch the hackathon count from the backend
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/hackathons/count')
        .then(response => {
  
          setHackExpCount(response.data.expired_counts_hacks);
          setHackNewCount(response.data.new_counts_hacks);
  
        })
        .catch(error => {
          console.error('Error fetching the count!', error);
        });
    }, []);
  
    return (
      <div>
        <h1 className='page-title'>DASHBOARD</h1><br/>
        <div className='page-title-border-container'>
          <div className='page-title-border'></div>
        </div>
        <div className='dashboard-flexbox-charts'>
              <ChartApp data1={job_new_counts} data2={job_exp_counts} pietitle={'JOBS'}/>
              <ChartApp data1={intern_new_counts} data2={intern_exp_counts} pietitle={'INTERNSHIPS'}/>
              <ChartApp data1={hack_new_counts} data2={hack_exp_counts} pietitle={'HACKATHONS'}/>
        </div>

        <div className='dashboard-flexbox-links'>
              <Link className='dash-box' to='/jobs'>
                <div className='dash-box-title'>View Jobs</div>
                <div className='dash-box-icon'><FaHourglass/></div>
              </Link>

              <Link className='dash-box' to='/internships'>
                <div className='dash-box-title'>View Internships</div>
                <div className='dash-box-icon'><FaBriefcase/></div>
              </Link>

              <Link className='dash-box' to='/hackathons'>
                <div className='dash-box-title'>View Hackathons</div>
                <div className='dash-box-icon'><FaTrophy/></div>
              </Link>
        </div>
      </div>  
    );
  };
  
  export default Dashboard;