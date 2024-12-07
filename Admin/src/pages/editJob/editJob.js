import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditJob = () => {
    const currentYear = new Date().getFullYear();
    const [Location, setLocation] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState({
        batch: '',
        company_name: '',
        position: '',
        salary: '',
        eligibility: '',
        mode: '',
        location: '',
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
        fetch(process.env.REACT_APP_SERVER_URL + `/api/jobs/data/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.application_deadline) {
                    data.application_deadline = formatDateForInput(data.application_deadline);
                }
                setJob(data);
                setOriginalLogo(data.logo); // Save the original logo URL
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob({ ...job, [name]: value });
    };

    const handleFileChange = (event) => {
        setJob((prevData) => ({
            ...prevData,
            logo: event.target.files[0],  // Update state with the selected file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle both text data and files
        const formData = new FormData();
        formData.append('batch', job.batch);
        formData.append('company_name', job.company_name);
        formData.append('position', job.position);
        formData.append('salary', job.salary);
        formData.append('eligibility', job.eligibility);
        formData.append('location', job.location);
        formData.append('applictaion_deadline', job.application_deadline);
        formData.append('application_link', job.application_link);

        // Check if a new logo was uploaded
        if (job.logo) {
            formData.append('logo', job.logo); // Add the new image file
        } else {
            formData.append('logo', originalLogo); // Use the original image URL
        }

        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL + `/api/jobs/data/${id}`, {
                method: 'PUT',
                body: formData  // Use FormData for both text data and file
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                navigate('/jobs');  // Navigate to the jobs page after successful update
                window.alert("Job Details successfully updated");
            } else {
                console.error('Failed to update job details');
                window.alert("Failed to update job details");
            }
        } catch (error) {
            console.error('Error occurred while updating job details:', error);
            window.alert("An error occurred while updating job details");
        }
    };

    const Cancel_Button = () => {
        navigate('/jobs');
    };

    const Delete_Button = async () => {
        if (window.confirm("Are you sure you want to Delete?")) {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + `/api/jobs/data/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.ok) {
                    const result = await response.json();
                    console.log(result.message);
                    window.alert("Successfully Deleted");
                    navigate('/jobs');
                } else {
                    console.error('Failed to delete the item.');
                    window.alert("Failed to delete the item.");
                }
            } catch (error) {
                console.error('There was an error deleting the item!', error);
                window.alert("Failed to delete the item.");
            }
        }

    };

    if (!job) return <div>Loading...</div>;

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <div className='form-title'>Edit/Delete Job</div><br />
                <div className='title-border-container'>
                    <div className='title-border'></div>
                </div>

                <div className='label'>SELECT BATCH *</div>
                <select className='input' id='batch' name='batch' value={job.batch} onChange={handleChange} required>
                    <option value='select'>select</option>
                    <option value={currentYear + 1}>{currentYear + 1} Batch</option>
                    <option value={currentYear + 2}>{currentYear + 2} Batch</option>
                    <option value={1}>General</option>
                </select>
                <br />

                <div className='label'>Name of the Company *</div>
                <input size="50" className='input' id='company_name' name='company_name' type="text" value={job.company_name} onChange={handleChange} required />
                <br />

                <div className='label'>Job Title *</div>
                <input className='input' type='text' id='position' name='position' value={job.position} onChange={handleChange} required />
                <br />

                <div className='label'>Salary *</div>
                <input className='input' type='text' id='salary' name='salary' value={job.salary} onChange={handleChange} required />
                <br />
                
                <div className='label'>Job Eligibility *</div>
                <textarea className='input' id='eligibility' name='eligibility' value={job.eligibility} onChange={handleChange} required />
                <br />

                <div className='label'>Mode of Job *</div>
                <select className='input' id='mode' name='mode' value={job.mode} onChange={(e) => { handleChange(e); selection(e); }} required>
                <option value='select'>select</option>
                <option value='Remote'>Remote</option>
                <option value='Onsite'>On-site</option>
                </select>
                <br />

                {Location && (
                    <>
                    <div className='label'>Location</div>
                    <input className='input' type='text' id='location' value={job.location} onChange={handleChange} />
                    <br />
                    </>
                )}

                <div className='label'>Application Deadline *</div>
                <input min={today} className='input' type='date' name='application_deadline' id='application_deadline' value={job.application_deadline} onChange={handleChange} required />
                <br />

                <div className='label'>Application Link</div>
                <input className='input' type='text' id='application_link' name='application_link' value={job.application_link} onChange={handleChange} />
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

export default EditJob;
