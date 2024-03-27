import React from 'react'
import ImageHeader from '../components/ImageHeader.jsx'
import axios from 'axios';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { httpRoute } from '../helperFunctions.js';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ForgetPassword = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    email: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   try{
    const res = await axios.post(`${httpRoute}/api/auth/forget-password`, formData)
    console.log(res.data);
   }
   catch(err){
      console.log(err);

   }
  };


  return (
    <div className="h-auto w-auto">
      <ImageHeader />
      <div className="min-h-screen flex md:items-center justify-center bg-gray-100 md:p-10">
        <div className="bg-white p-8 rounded shadow-md w-full md:w-5/6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>
          <form onSubmit={handleSubmit}>

            <div className="mb-4">

              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>


            <div className=""></div>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-indigo-600 w-full"
            >
              Send Email Verification
            </button>
          </form>
         
          <div className=" text-center p-4 flex justify-around">
            <div className="">
              <span>Forgot Password?</span>
              <span>
                <Link to='/forget-password' className=' text-blue-600'> CLICK HERE </Link>
              </span>
            </div>
            <div className="">
              <span> Not Registered Yet?</span>
              <span>
                <Link to='/register' className=' text-blue-600'> CLICK HERE TO REGISTER</Link>
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPassword