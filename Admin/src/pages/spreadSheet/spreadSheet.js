import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

function SpreadSheet(){

    const [fileData, setFileData] = useState([]);

    const api_endpoint = process.env.REACT_APP_SERVER_URL + '/api/spreadSheet/send-emails';

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Filter only the necessary columns (Name, Email, University Reg No)
                const filteredData = jsonData.map((row) => ({
                    name: row.Name,
                    email: row.Email,
                    regNo: row['Reg No']
                }));

                setFileData(filteredData);
            };
            reader.readAsBinaryString(file);
        }
    };

    const handleSubmit = async () => {
        if (fileData.length > 0) {
            try {
                // Post the email data to the backend
                await axios.post(api_endpoint, { students: fileData });
                alert('Emails have been sent successfully!');
            } catch (error) {
                console.error('Error sending emails:', error);
                alert('There was an error sending emails.');
            }
        }
    };


    return(
        <div className='form-container'>
            <form>
                <div className='form-title'>Upload CSV/Excel File</div><br />
                <div className='title-border-container'>
                        <div className='title-border'></div>
                </div>
                <input size="50" className='input custom-file-upload' type="file" accept=".xls,.xlsx,.csv" onChange={handleFileUpload}/>
                <br />
                {fileData.length > 0 && (
                <div>
                    <h4>Emails to be sent to the following:</h4>
                    <ul>
                        {fileData.map((student, index) => (
                            <li key={index}>
                                {student.name} ({student.email}) - {student.regNo}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
                <button onClick={handleSubmit} className="btn btn-primary btn-sm form-button"  type='submit' id='internship-post'>Send</button>
                <br />
            </form>
        </div>
    )
}

export default SpreadSheet;