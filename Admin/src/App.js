import Add_Hackathon from "./pages/addHack/addHack";
import Add_Job from "./pages/addJob/addJob";
import Add_Internship from "./pages/addIntern/addIntern";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import React from 'react';

import Home from "./pages/home/home";
import Dashboard from "./pages/dashboard/dashboard";

import InternshipList from "./pages/internships/internships";
import JobList from "./pages/jobs/jobs";
import HackList from "./pages/hackathons/hackathons";

import EditHackathon from "./pages/editHackathon/editHackathon";
import EditInternship from "./pages/editInternship/editInternship";
import EditJob from "./pages/editJob/editJob";

import SpreadSheet from "./pages/spreadSheet/spreadSheet";

import Signup from "./pages/signup/signup";
import Login from "./pages/login/login"

import ForgotPassword from "./pages/forgotPass/forgotPass";
import ForgotUsername from "./pages/forgotUsername/forgotUsername";

function App()
{
  return(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgotPass" element={<ForgotPassword/>} />
          <Route path="/forgotUser" element={<ForgotUsername/>} />
          <Route path='/' element={<Home/>}>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='/' element={<Dashboard/>}/>

            <Route path='/add_hack' element={<Add_Hackathon/>}/>
            <Route path='/add_job' element={<Add_Job/>}/>
            <Route path='/add_intern' element={<Add_Internship/>}/>

            <Route path='/internships' element={<InternshipList/>}/>
            <Route path='/jobs' element={<JobList/>}/>
            <Route path='/hackathons' element={<HackList/>}/>

            <Route path='/edit_internship/:id' element={<EditInternship/>}/>
            <Route path='/edit_job/:id' element={<EditJob/>}/>
            <Route path='/edit_hack/:id' element={<EditHackathon/>}/>

            <Route path='/spreadsheet' element={<SpreadSheet/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;