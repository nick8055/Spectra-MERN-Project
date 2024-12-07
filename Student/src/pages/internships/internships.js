import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Internship() {
    const navigate = useNavigate();
    const api_endpoint = process.env.REACT_APP_SERVER_URL + '/api/internships/data'; // Server fetching internship details
    const [internships, setInternships] = useState([]);
    const [graduationYear, setGraduationYear] = useState(null);

    const ensureProtocol = (url) => {
        if (!/^https?:\/\//i.test(url)) {
            return 'https://' + url;
        }
        return url;
    };

    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
    };

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
                    setGraduationYear(joinYear + 4);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                navigate('/login');
            }
        };

        fetchUserDetails();
    }, [navigate]);

    useEffect(() => {
        if (graduationYear !== null) {
            fetch(api_endpoint)
                .then(response => response.json())
                .then(data => {
                    const filteredInternships = data.filter(intern => parseInt(intern.batch) === graduationYear || parseInt(intern.batch) === 1 );
                    setInternships(filteredInternships.reverse());
                });
        }
    }, [graduationYear]);

    return (
        <div>
            <div className='page-title'>INTERNSHIPS</div>
            <div className='page-title-border-container'>
                <div className='page-title-border'></div>
            </div>
            <br />
            <div style={{ width: "80%", marginLeft: "10%", position: "relative", textAlign: 'center', zIndex: 1 }}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                        prevEl: ".swiper-button-prev",
                        nextEl: ".swiper-button-next",
                    }}
                    pagination={{
                        el: ".swiper-pagination",
                        type: "fraction",
                    }}
                    spaceBetween={50}
                    slidesPerView={1}
                    style={{ height: "100%" }}
                >
                    {internships.map((intern, index) => (
                        <SwiperSlide key={index}>
                            <div>
                                <div className='form-title'>
                                    <strong>    
                                        {intern.position} by {intern.company_name} - {intern.batch !== 1 ? intern.batch + ' Batch' : 'All batches'} 
                                    </strong>
                                </div>
                                {intern.logo && (
                                    <img
                                        src={process.env.REACT_APP_SERVER_URL + "/internships/" + intern.logo}
                                        alt={`${intern.company_name} logo`}
                                        className='job-image'
                                    />
                                )}
                                <button className='form-button'>
                                    <a
                                        className='anchor-button'
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={ensureProtocol(intern.application_link)}
                                        style={{ color: 'white' }}
                                    >
                                        Click to Apply
                                    </a>
                                </button>
                                <br />
                                <div className='jhi-details'>
                                    <div><strong>Name of Company</strong> : {intern.company_name}</div><br />
                                    <div><strong>Intern Role</strong> : {intern.position}</div><br />
                                    <div><strong>Stipend</strong> : {intern.stipend}</div><br />
                                    <div><strong>Eligibility</strong> : {intern.eligibility}</div><br />
                                    <div><strong>Mode</strong> : {intern.mode}</div><br />
                                    {intern.location && (
                                        <div><strong>Location</strong> : {intern.location}</div>
                                    )}
                                    <br />
                                    <div><strong>Application Deadline</strong> : {formatDate(intern.application_deadline)}</div>
                                    <br /><br />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Arrows */}
                <div
                    className="swiper-button-prev"
                    style={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                    }}
                ></div>
                <div
                    className="swiper-button-next"
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                    }}
                ></div>

                {/* Slide Numbers */}
                <div
                    className="swiper-pagination"
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        width: "100%",
                        textAlign: "center",
                        zIndex: 10,
                    }}
                ></div>
            </div>
        </div>
    );
}

export default Internship;