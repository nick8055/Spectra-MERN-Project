import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Add_Job() {
    const api_endpoint = process.env.REACT_APP_SERVER_URL + '/api/jobs/add';
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();
    const [Location, setLocation] = useState(false);
    const [formData, setFormData] = useState({
        batch: '',
        company_name: '',
        position: '',
        salary: '',
        eligibility: '',
        mode: '',
        location: '',
        applictaion_deadline: '',
        application_link: '',
        logo: null,  // To hold the image file
    });

    function selection(event) {
        if (event.target.value === 'Onsite') {
            setLocation(true);
        } else {
            setLocation(false);
        }
    }

    const handleSubmit = async (event) => 
        {
    
            event.preventDefault();

            // Create FormData object to hold text fields and file
            const jobData = new FormData();
            jobData.append('batch', formData.batch);
            jobData.append('company_name', formData.company_name);
            jobData.append('position', formData.position);
            jobData.append('salary', formData.salary);
            jobData.append('eligibility', formData.eligibility);
            jobData.append('mode', formData.mode);
            jobData.append('location', formData.location);
            jobData.append('deadline', formData.applictaion_deadline);
            jobData.append('application_link', formData.application_link);
            jobData.append('application_deadline', formData.application_deadline);
            if (formData.logo) 
            {
                jobData.append('logo', formData.logo);  // Append the image file if selected
            }
    
            try 
            {
                const response = await fetch(api_endpoint, 
                {
                    method: 'POST',
                    body: jobData,
                });
    
                if (response.ok) 
                {
                    console.log('New Job Added successfully!');
                    navigate('/jobs');
                    console.log(formData.batch);
                    setFormData({
                        batch: '',
                        company_name: '',
                        position: '',
                        salary: '',
                        eligibility: '',
                        mode: '',
                        location: '',
                        application_deadline: '',
                        application_link: '',
                        logo: '',  // To hold the image file
                    });
                    window.alert('New Job Added successfully!');
                } 
                else 
                {
                    console.error('Failed to add new Job');
                    window.alert('Failed to add new Job');
                }
            } 
            catch (error) 
            {
                console.error('Error:', error);
                window.alert('Error: Failed to submit Job details.');
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
                logo: event.target.files[0], // Set file object
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

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <div className='form-title'>Add New Job</div><br />
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

                <div className='label'>Name of the Company *</div>
                <input size="50" className='input' id='company_name' name='company_name' type="text" value={formData.company_name} onChange={handleChange} required />
                <br />

                <div className='label'>Job Title *</div>
                <input className='input' type='text' id='position' name='position' value={formData.position} onChange={handleChange} required />
                <br />

                <div className='label'>Salary *</div>
                <input className='input' type='text' id='salary' name='salary' value={formData.salary} onChange={handleChange} required />
                <br />
                
                <div className='label'>Job Eligibility *</div>
                <textarea className='input' id='eligibility' name='eligibility' value={formData.eligibility} onChange={handleChange} required />
                <br />

                <div className='label'>Mode of Job *</div>
                <select className='input' id='mode' name='mode' value={formData.mode} onChange={(e) => { handleChange(e); selection(e); }} required>
                <option value='select'>select</option>
                <option value='Remote'>Remote</option>
                <option value='Onsite'>On-site</option>
                </select>
                <br />

                {Location && (
                    <>
                    <div className='label'>Location</div>
                    <input className='input' type='text' id='location' value={formData.location} onChange={handleChange} />
                    <br />
                    </>
                )}

                <div className='label'>Application Deadline *</div>
                <input min={today} className='input' type='date' name='application_deadline' id='application_deadline' value={formData.application_deadline} onChange={handleChange} required />
                <br />

                <div className='label'>Application Link</div>
                <input className='input' type='text' id='application_link' name='application_link' value={formData.application_link} onChange={handleChange} />
                <br />

                <div className='label'>Company Logo (Image)</div>
                <input className='input' type='file' id='logo' name='logo' accept='.png .jpg .jpeg' onChange={handleFileChange} />
                <br />

                <button className="btn btn-primary btn-sm form-button" type='submit'>Post</button>
                <br />
            </form>
        </div>
    );
}

export default Add_Job;