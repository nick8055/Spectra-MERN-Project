
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const JobList = () => {

    const currentYear = new Date().getFullYear();
    const api_endpoint = process.env.REACT_APP_SERVER_URL + '/api/jobs/data';
    const [jobs, setJobs] = useState([]);

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
            .then(data => setJobs(data.reverse()));
    }, []);

    const isExpired = (deadline) => new Date(deadline) < new Date(today);

    return (
        <div className='form-container'>
            <div className='form-title'>JOBS</div>
            <div className='label'>(Click anyone to edit or delete)</div><br/><br/>
            <div className='title-border-container'>
                <div className='title-border'></div>
            </div>
            <div className='item-list'>
                {jobs.map(job => (
                    <div key={job._id}
                    className={`hack-item ${isExpired(job.application_deadline) ? 'expired' : 'active'}`}>
                        <Link className='link' to={`/edit_job/${job._id}`}>
                            {job.position} at {job.company_name} - {job.batch !== 1 ? job.batch + ' Batch' : 'All batches'}  - DL {formatDateForInput(job.application_deadline)}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobList;