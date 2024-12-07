import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import {Outlet} from 'react-router-dom';
import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";



function Home(){
    const navigate = useNavigate();

    useEffect(() => 
    {
        const fetchUserData = async () => 
        {
          const token = localStorage.getItem('token');
          if (!token) 
          {
            navigate('/login');
            return;
          }
    
          try
          {
            const res = await axios.get(process.env.REACT_APP_SERVER_URL + '/api/admins/getAdmin', {
              headers: 
              {
                'x-auth-token': token
              }
            });
          } 
          catch (err)
          {
            console.error(err);
            navigate('/login');
          }
        };
    
        fetchUserData();
    }, [navigate]);

    return(
        <div className="Home">
            <Navbar/> 
            <Sidebar/>
            <Outlet/>
        </div>
    );
}

export default Home;