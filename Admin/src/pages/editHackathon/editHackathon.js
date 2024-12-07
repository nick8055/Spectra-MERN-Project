import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditHackathon = () => {
    const currentYear = new Date().getFullYear();
    const [Location, setLocation] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [hack, setHack] = useState({
        batch: '',
        event_name: '',
        organizer: '',
        event_description: '',
        mode: '',
        location: '',
        prize_money: '',
        application_deadline: '',
        application_link: '',
        logo: null,  // To hold the image file
    });
    const [originalLogo, setOriginalLogo] = useState(''); // State to hold the original logo URL

    function selection(event) {
        if (event.target.value === 'Onsite') {
            setLocation(true);
        } else {
            setLocation(false);
        }
    }

    // Format date for input field (YYYY-MM-DD)
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
        fetch(process.env.REACT_APP_SERVER_URL + `/api/hackathons/data/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.application_deadline) {
                    data.application_deadline = formatDateForInput(data.application_deadline);
                }
                setHack(data);
                setOriginalLogo(data.logo); // Save the original logo URL
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHack({ ...hack, [name]: value });
    };

    const handleFileChange = (event) => {
        setHack((prevData) => ({
            ...prevData,
            logo: event.target.files[0],  // Update state with the selected file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle both text data and files
        const formData = new FormData();
        formData.append('batch', hack.batch);
        formData.append('event_name', hack.event_name);
        formData.append('organizer', hack.organizer);
        formData.append('event_description', hack.event_description);
        formData.append('mode', hack.mode);
        formData.append('location', hack.location);
        formData.append('prize_money', hack.prize_money);
        formData.append('application_deadline', hack.application_deadline);
        formData.append('application_link', hack.application_link);

        // Check if a new logo was uploaded
        if (hack.logo) {
            formData.append('logo', hack.logo); // Add the new image file
        } else {
            formData.append('logo', originalLogo); // Use the original image URL
        }

        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL + `/api/hackathons/data/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                navigate('/hackathons');
                window.alert("Hackathon successfully updated");
            } else {
                console.error('Failed to update hackathon');
                window.alert("Failed to update hackathon");
            }
        } catch (error) {
            console.error('Error occurred while updating hackathon:', error);
            window.alert("An error occurred while updating hackathon");
        }
    };

    const Cancel_Button = () => {
        navigate('/hackathons');
    };

    const Delete_Button = async () => {
        if (window.confirm("Are you sure you want to Delete?")){
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL + `/api/hackathons/data/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                window.alert("Successfully Deleted");
                navigate('/hackathons');
            } else {
                console.error('Failed to delete hackathon');
                window.alert("Failed to delete hackathon");
            }
        } catch (error) {
            console.error('There was an error deleting hackathon', error);
            window.alert("Failed to delete hackathon");
        }
    }};

    if (!hack) return <div>Loading...</div>;

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <div className='form-title'>Edit/Delete Hackathon</div><br />
                <div className='title-border-container'>
                    <div className='title-border'></div>
                </div>

                <div className='label'>SELECT BATCH *</div>
                <select className='input' id='batch' name='batch' value={hack.batch} onChange={handleChange} required>
                    <option value='select'>select</option>
                    <option value={currentYear + 1}>{currentYear + 1} Batch</option>
                    <option value={currentYear + 2}>{currentYear + 2} Batch</option>
                    <option value={1}>General</option>
                </select>
                <br />

                <div className='label'>Event Name *</div>
                <input size="50" className='input' id='event_name' name='event_name' type="text" value={hack.event_name} onChange={handleChange} required />
                <br />

                <div className='label'>Organizer *</div>
                <input className='input' type='text' id='organizer' name='organizer' value={hack.organizer} onChange={handleChange} required></input>
                <br />

                <div className='label'>Event Description *</div>
                <input className='input' type='text' id='event_description' name='event_description' value={hack.event_description} onChange={handleChange} required></input>
                <br />

                <div className='label'>Mode of Hackathon *</div>
                <select className='input' id='mode' name='mode' value={hack.mode} onChange={(e) => { handleChange(e); selection(e); }} required>
                    <option value='select'>select</option>
                    <option value='Remote'>Remote</option>
                    <option value='Onsite'>On-site</option>
                </select>
                <br />

                {Location && (
                    <>
                    <div className='label' htmlFor='location'>Location</div>
                    <input className='input' type='text' value={hack.location} onChange={handleChange} name='location' id='location'></input>
                    <br />
                    </>
                )}

                <div className='label'>Prize Money *</div>
                <input className='input' type='text' id='prize_money' name='prize_money' value={hack.prize_money} onChange={handleChange} required></input>
                <br />

                <div className='label'>Application Deadline *</div>
                <input min={today} className='input' type='date' name='application_deadline' id='application_deadline' value={hack.application_deadline} onChange={handleChange} required></input>
                <br />

                <div className='label'>Application Link</div>
                <input className='input' type='text' name='application_link' id='application_link' value={hack.application_link} onChange={handleChange}></input>
                <br />

                <div className='label'>Company Logo (Image)</div>
                <input className='input' type='file' id='logo' name='logo' accept='.png .jpg .jpeg' onChange={handleFileChange} />
                <br />

                <button className="btn btn-primary btn-sm form-button" type='submit'>Update</button>
                <button className="btn btn-primary btn-sm form-button" onClick={Cancel_Button}>Cancel</button>
                <button className="btn btn-primary btn-sm form-button" onClick={Delete_Button}>Delete</button>
                <br />
            </form>
        </div>
    );
};

export default EditHackathon;
