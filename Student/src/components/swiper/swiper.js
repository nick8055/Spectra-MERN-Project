// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from 'swiper/modules';
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const Swi = () => {
//   const slides = Array.from({ length: 5 }, (_, index) => `Slide ${index + 1}`);

//   return (
//     <div style={{ width: "100%", height: "100vh", position: "relative" }}>
//       <Swiper
//         modules={[Navigation, Pagination]}
//         navigation={{
//           prevEl: ".swiper-button-prev",
//           nextEl: ".swiper-button-next",
//         }}
//         pagination={{
//           el: ".swiper-pagination",
//           type: "fraction", // Shows the slide numbers
//         }}
//         spaceBetween={50}
//         slidesPerView={1}
//         style={{ height: "100%" }}
//       >
//         {slides.map((slide, index) => (
//           <SwiperSlide key={index} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <h2>{slide}</h2>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       {/* Navigation Arrows */}
//       <div
//         className="swiper-button-prev"
//         style={{
//           position: "absolute",
//           left: "10px",
//           top: "50%",
//           transform: "translateY(-50%)",
//           zIndex: 10,
//         }}
//       ></div>
//       <div
//         className="swiper-button-next"
//         style={{
//           position: "absolute",
//           right: "10px",
//           top: "50%",
//           transform: "translateY(-50%)",
//           zIndex: 10,
//         }}
//       ></div>

//       {/* Slide Numbers */}
//       <div
//         className="swiper-pagination"
//         style={{
//           position: "absolute",
//           bottom: "10px",
//           width: "100%",
//           textAlign: "center",
//           zIndex: 10,
//         }}
//       ></div>
//     </div>
//   );
// };

// export default Swi;


import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import './hackathons.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Swi() {
    const navigate = useNavigate();
    const api_endpoint = 'http://localhost:9000/api/hackathons/data'; // Server fetching hackathon details
    const [hackathons, setHackathons] = useState([]);
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
                const res = await axios.get('http://localhost:9000/api/students/getStudent', {
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
                    const filteredHackathons = data.filter(hack => parseInt(hack.batch) === graduationYear);
                    setHackathons(filteredHackathons.reverse());
                });
        }
    }, [graduationYear]);

    return (
        <div className='internship-slider'>
            <div className='page-title'>HACKATHONS</div>
            <div className='page-title-border-container'>
                <div className='page-title-border'></div>
            </div>
            <br />
            <div style={{ width: "100%", position: "relative" , textAlign: 'center'}}>
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
                    {hackathons.map((hack, index) => (
                        <SwiperSlide key={index}>
                            <div className='internship-item'>
                                <div className='form-title'>
                                    <strong>{hack.event_name} by {hack.organizer} - {hack.batch} BATCH</strong>
                                </div>
                                {hack.logo && (
                                    <img
                                        src={"http://localhost:9000/hackathons/" + hack.logo}
                                        alt={`${hack.event_name} logo`}
                                        className='job-image'
                                    />
                                )}
                                {/* <a
                                    className='anchor-button'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={ensureProtocol(hack.application_link)}
                                > */}
                                    <button className='form-button'><a
                                    className='anchor-button'
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={ensureProtocol(hack.application_link)}
                                    style={{ color: 'white'}}
                                    >Click To Apply</a></button>
                                {/* </a> */}
                                <br />
                                <div className='jhi-details'>
                                    <div><strong>Name of Event</strong> : {hack.event_name}</div><br />
                                    <div><strong>Event Organizer</strong> : {hack.organizer}</div><br />
                                    <div><strong>Event Description</strong> : {hack.event_description}</div><br />
                                    <div><strong>Prize Money</strong> : {hack.prize_money}</div><br />
                                    <div><strong>Mode</strong> : {hack.mode}</div><br />
                                    {hack.location && (
                                        <div><strong>Location</strong> : {hack.location}</div>
                                    )}
                                    <br/>
                                    <div><strong>Application Deadline</strong> : {formatDate(hack.application_deadline)}</div>
                                    <br/><br/><br/>
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

export default Swi;
