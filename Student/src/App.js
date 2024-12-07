import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import React from 'react';

import Home from "./pages/home/home";
import Dashboard from "./pages/dashboard/dashboard";

import Hack from './pages/hackathons/hackathons';
import Internship from './pages/internships/internships';
import Job from './pages/jobs/jobs';

import Signup from "./pages/signup/signup";
import Login from "./pages/login/login"

import Swi from './components/swiper/swiper';

import ForgotPassword from "./pages/forgotPass/forgotPass";

function App()
{
  return(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgotPass" element={<ForgotPassword/>} />     
          <Route path='/' element={<Home/>}>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='/' element={<Dashboard/>}/>

            <Route path='/internships' element={<Internship/>}/>
            <Route path='/jobs' element={<Job/>}/>
            <Route path='/hackathons' element={<Hack/>}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;