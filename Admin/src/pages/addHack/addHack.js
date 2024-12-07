import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Add_Hackathon()
{

    const api_endpoint = process.env.REACT_APP_SERVER_URL + '/api/hackathons/add';

    const currentYear = new Date().getFullYear();
    const [Location, setLocation] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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

    function selection(event) 
    {
        if (event.target.value === 'Onsite') 
        {
            setLocation(true);
        } else 
        {
            setLocation(false);
        }
    }

    const handleSubmit = async (event) => 
    {

        event.preventDefault();

         // Create FormData object to hold text fields and file
        const hackData = new FormData();
        hackData.append('batch', formData.batch);
        hackData.append('event_name', formData.event_name);
        hackData.append('organizer', formData.organizer);
        hackData.append('event_description', formData.event_description);
        hackData.append('mode', formData.mode);
        hackData.append('location', formData.location);
        hackData.append('prize_money', formData.prize_money);
        hackData.append('application_deadline', formData.application_deadline);
        hackData.append('application_link', formData.application_link);
        if (formData.logo) 
        {
            hackData.append('logo', formData.logo);  // Append the image file if selected
        }

        try 
        {
            const response = await fetch(api_endpoint, 
            {
                method: 'POST',
                body: hackData,
            });

            if (response.ok) 
            {
                console.log('New Hackathon Added successfully!');
                navigate('/hackathons');
                console.log(formData.batch);
                setFormData({
                    batch: '',
                    event_name: '',
                    organizer: '',
                    event_description: '',
                    mode: '',
                    location: '',
                    prize_money: '',
                    application_deadline: '',
                    application_link: '',
                    logo: '',  // To hold the image file
                });
                window.alert('New Hackathon Added successfully!');
            } 
            else 
            {
                console.error('Failed to add new Hackathon');
                window.alert('Failed to add new Hackathon');
            }
        } 
        catch (error) 
        {
            console.error('Error:', error);
            window.alert('Error: Failed to submit Hackathon details.');
        }
    };

    const handleChange = (event) => 
    {
        const { id, value } = event.target;
        setFormData((prevData) => 
        ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleFileChange = (event) => 
    {
        setFormData
        ({
            ...formData,
            hackathon_logo: event.target.files[0], // Set file object
        });
        console.log(event.target.files[0]);
    };

    // Get today's date in YYYY-MM-DD format (local time)
    const getCurrentDate = () => 
    {
        const date = new Date();
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().split('T')[0];
    };

  // Calculate the min date
  const today = getCurrentDate();

    return(
        <div className='form-container'>
        <form onSubmit={handleSubmit}>
            <div className='form-title'>Add New Hackathon</div><br />
            <div className='title-border-container'>
                <div className='title-border'></div>
            </div>

            <div className='label'>SELECT BATCH *</div>
            <select className='input' id='batch' name='batch' value={formData.batch} onChange={handleChange} required>
            <option value='select'>select</option>
                <option value={currentYear + 1}>{currentYear + 1} Batch</option>
                <option value={currentYear + 2}>{currentYear + 2} Batch</option>
                <option value={1}>General</option>
            </select>
            <br />

            <div className='label'>Event Name *</div>
            <input size="50" className='input' id='event_name' name='event_name' type="text" value={formData.event_name} onChange={handleChange} required />
            <br />

            <div className='label'>Organizer *</div>
            <input className='input' type='text' id='organizer' name='organizer' value={formData.organizer} onChange={handleChange} required></input>
            <br />

            <div className='label'>Event Description *</div>
            <input className='input' type='text' id='event_description' name='event_description' value={formData.event_description} onChange={handleChange} required></input>
            <br />

            <div className='label'>Mode of Hackathon *</div>
            <select className='input' id='mode' name='mode' value={formData.mode} onChange={(e) => { handleChange(e); selection(e); }} required>
                <option value='select'>select</option>
                <option value='Remote'>Remote</option>
                <option value='Onsite'>On-site</option>
            </select>
            <br />

            {Location && (
                <>
                <div className='label' htmlFor='location'>Location</div>
                <input className='input' type='text' value={formData.location} onChange={handleChange} name='location' id='location'></input>
                <br />
                </>
            )}

            <div className='label'>Prize Money *</div>
            <input className='input' type='text' id='prize_money' name='prize_money' value={formData.prize_money} onChange={handleChange} required></input>
            <br />

            <div className='label'>Application Deadline *</div>
            <input min={today} className='input' type='date' name='application_deadline' id='application_deadline' value={formData.application_deadline} onChange={handleChange} required></input>
            <br />

            <div className='label'>Application Link</div>
            <input className='input' type='text' name='application_link' id='application_link' value={formData.application_link} onChange={handleChange}></input>
            <br />

            <div className='label'>Company Logo (Image)</div>
            <input className='input' type='file' id='logo' name='logo' accept='.png .jpg .jpeg' onChange={handleFileChange} />
            <br />

            <button className="btn btn-primary btn-sm form-button"  type='submit'>Post</button>
            <br />

        </form>
    </div>
    )
}

export default Add_Hackathon;