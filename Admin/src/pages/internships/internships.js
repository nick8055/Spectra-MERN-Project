
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './internships.css'

const InternshipList = () => {

    const currentYear = new Date().getFullYear();
    const api_endpoint = process.env.REACT_APP_SERVER_URL +  '/api/internships/data';
    const [internships, setInternships] = useState([]);

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    // Get today's date in YYYY-MM-DD format (local time)
    const getCurrentDate = () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().split('T')[0];
    };

    const today = getCurrentDate();

    useEffect(() => {
        fetch(api_endpoint)
            .then(response => response.json())
            .then(data => setInternships(data.reverse()));
    }, []);

    const isExpired = (deadline) => new Date(deadline) < new Date(today);

    return (
        <div className='form-container'>
            <div className='form-title'>INTERNSHIPS</div>
            <div className='label'>(Click anyone to edit or delete)</div>
            <br/><br/>
            <div className='title-border-container'>
                <div className='title-border'></div>
            </div>
            <div className='item-list'>
                {internships.map(internship => (
                    <div key={internship._id} 
                    className={`internship-item ${isExpired(internship.application_deadline) ? 'expired' : 'active'}`}>
                        <Link className='link' to={`/edit_internship/${internship._id}`}>
                            {internship.position} at {internship.company_name} - {internship.batch !== 1 ? internship.batch + ' Batch' : 'All batches'}  - DL {formatDateForInput(internship.application_deadline)}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InternshipList;