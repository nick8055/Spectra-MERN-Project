import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './hackathons.css';

const HackList = () => {
    const currentYear = new Date().getFullYear();
    const api_endpoint = process.env.REACT_APP_SERVER_URL + '/api/hackathons/data';
    const [hacks, setHacks] = useState([]);

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const pad = (n) => (n < 10 ? '0' + n : n);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };

    const getCurrentDate = () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().split('T')[0];
    };

    const today = getCurrentDate();

    useEffect(() => {
        fetch(api_endpoint)
            .then((response) => response.json())
            .then((data) => setHacks(data.reverse()));
    }, []);

    const isExpired = (deadline) => new Date(deadline) < new Date(today);

    return (
        <div className='form-container'>
            <div className='form-title'>HACKATHONS</div>
            <div className='label'>(Click anyone to edit or delete)</div>
            <br />
            <br />
            <div className='title-border-container'>
                <div className='title-border'></div>
            </div>
            <div className='item-list'>
                {hacks.map((hack) => (
                    <div
                        key={hack._id}
                        className={`hack-item ${isExpired(hack.application_deadline) ? 'expired' : 'active'}`}
                    >
                        <Link className='link' to={`/edit_hack/${hack._id}`}>
                            {hack.event_name} by {hack.organizer} - {hack.batch !== 1 ? hack.batch + ' Batch' : 'All batches'}  - DL {formatDateForInput(hack.application_deadline)}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HackList;
