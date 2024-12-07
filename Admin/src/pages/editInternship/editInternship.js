import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditInternship = () => {
    const currentYear = new Date().getFullYear();
    const [Location, setLocation] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [internship, setInternship] = useState({
        batch: '',
        company_name: '',
        position: '',
        stipend: '',
        eligibility: '',
        mode: '',
        location: '',
        duration: '',
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
        fetch(process.env.REACT_APP_SERVER_URL + `/api/internships/data/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.application_deadline) {
                    data.application_deadline = formatDateForInput(data.application_deadline);
                }
                setInternship(data)
                setOriginalLogo(data.logo); // Save the original logo URL
            });
                
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInternship({ ...internship, [name]: value });
    };

    const handleFileChange = (event) => {
        setInternship((prevData) => ({
            ...prevData,
            logo: event.target.files[0],  // Update state with the selected file
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle both text data and files
        const formData = new FormData();
        formData.append('batch', internship.batch);
        formData.append('company_name', internship.company_name);
        formData.append('position', internship.position);
        formData.append('stipend', internship.stipend);
        formData.append('eligibility', internship.eligibility);
        formData.append('mode', internship.mode);
        formData.append('location', internship.location);
        formData.append('duration', internship.duration);
        formData.append('application_link', internship.application_link);
        formData.append('application_deadline', internship.application_deadline);

        // Check if a new logo was uploaded
        if (internship.logo) {
            formData.append('logo', internship.logo); // Add the new image file
        } else {
            formData.append('logo', originalLogo); // Use the original image URL
        }

        try {
            const response = await fetch(process.env.REACT_APP_SERVER_URL + `/api/internships/data/${id}`, {
                method: 'PUT',
                body: formData  // Use FormData for both text data and file
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                navigate('/internships');  // Navigate to the jobs page after successful update
                window.alert("Internship successfully updated");
            } else {
                console.error('Failed to update internship');
                window.alert("Failed to update internship");
            }
        } catch (error) {
            console.error('Error occurred while updating internship:', error);
            window.alert("An error occurred while updating internship");
        }
    };

    function Cancel_Button(){
        navigate('/internships');
    }

    const Delete_Button = async () => {
        if (window.confirm("Are you sure you want to Delete?")){
        try {
          const response = await fetch(process.env.REACT_APP_SERVER_URL + `/api/internships/data/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            window.alert("Successfully Deleted");
            navigate('/internships');
          } else {
            console.error('Failed to delete the item.');
            window.alert("Failed to delete the item.");
          }
        } catch (error) {
          console.error('There was an error deleting the item!', error);
          window.alert("Failed to delete the item.");
        }
      }};

    if (!internship) return <div>Loading...</div>;

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <div className='form-title'>Edit/Delete Internship</div><br />
                <div className='title-border-container'>
                    <div className='title-border'></div>
                </div>

                <div className='label'>SELECT BATCH *</div>
                <select className='input' id='batch' name='batch' value={internship.batch} onChange={handleChange} required>
                    <option value='select'>select</option>
                    <option value={currentYear + 1}>{currentYear + 1} Batch</option>
                    <option value={currentYear + 2}>{currentYear + 2} Batch</option>
                    <option value={1}>General</option>
                </select>
                <br />

                <div className='label'>Name of the Company *</div>
                <input size="50" className='input' id='company_name' name='company_name' type="text" value={internship.company_name} onChange={handleChange} required />
                <br />

                <div className='label'>Internship Title *</div>
                <input className='input' type='text' id='position' name='position' value={internship.position} onChange={handleChange} required />
                <br />

                <div className='label'>Stipend *</div>
                <input className='input' type='text' id='stipend' name='stipend' value={internship.stipend} onChange={handleChange} required />
                <br />
                
                <div className='label'>Internship Eligibility *</div>
                <textarea className='input' id='eligibility' name='eligibility' value={internship.eligibility} onChange={handleChange} required />
                <br />

                <div className='label'>Mode of Internship *</div>
                <select className='input' id='mode' name='mode' value={internship.mode} onChange={(e) => { handleChange(e); selection(e); }} required>
                <option value='select'>select</option>
                <option value='Remote'>Remote</option>
                <option value='Onsite'>On-site</option>
                </select>
                <br />

                {Location && (
                    <>
                    <div className='label'>Location</div>
                    <input className='input' type='text' id='location' value={internship.location} onChange={handleChange} />
                    <br />
                    </>
                )}

                <div className='label'>Duration *</div>
                <input className='input' type='text' id='duration' name='duration' value={internship.duration} onChange={handleChange} required></input>
                <br />

                <div className='label'>Application Deadline *</div>
                <input min={today} className='input' type='date' name='application_deadline' id='application_deadline' value={internship.application_deadline} onChange={handleChange} required />
                <br />

                <div className='label'>Application Link</div>
                <input className='input' type='text' id='application_link' name='application_link' value={internship.application_link} onChange={handleChange} />
                <br />

                <div className='label'>Company Logo (Image)</div>
                <input className='input' type='file' id='logo' name='logo' accept='.png .jpg .jpeg' onChange={handleFileChange} />
                <br />

                <button className="btn btn-primary btn-sm form-button"  type='submit' id='internship-post'>Update</button>
                <button className="btn btn-primary btn-sm form-button" onClick={Cancel_Button} id='internship-post'>Cancel</button>
                <button className="btn btn-primary btn-sm form-button" onClick={Delete_Button} id='internship-post'>Delete</button>
                <br />

            </form>
        </div>
    );
};

export default EditInternship;
