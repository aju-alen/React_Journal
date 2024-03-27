import React,{ useState, useMemo } from 'react'
import axios from 'axios';
import { Link, useNavigate,useParams } from 'react-router-dom';
import ImageHeader from '../components/ImageHeader.jsx';
import { httpRoute } from '../helperFunctions.js';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const ResetPassword = () => {
  const {resetToken} = useParams()
  console.log(resetToken,'resetToken');
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: '',
    retypepassword: '',
  });
  const [open, setOpen] = React.useState(false);
  const [alertStatus, setAlertStatus] = React.useState('success');
  const [alertText, setAlertText] = React.useState('');


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    try{
      if (formData.password !== formData.retypepassword) {
        return alert("Password do not match")
      }
      const res = await axios.post(`${httpRoute}/api/auth/reset/${resetToken}`,formData)
      console.log(res.data);
      setOpen(true);
      setAlertStatus('success')
      setAlertText('Password reset successful')
      setTimeout(() => {
        navigate('/login')
      }, 1000);
    }
    catch(err){
      console.log(err);
      setOpen(true);
      setAlertStatus('error')
      setAlertText('Password reset failed, Please try again or contact Us')


    }
   
  };
  

  return (
    <div className="h-auto w-auto">
      <ImageHeader />
      <div className="min-h-screen flex md:items-center justify-center bg-gray-100 md:p-10">
        <div className="bg-white p-8 rounded shadow-md w-full md:w-5/6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
          <form onSubmit={handleSubmit}>

          <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
               Retype Password
              </label>
              <input
                type="password"
                id="retypepassword"
                name="retypepassword"
                value={formData.retypepassword}
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
              Reset Password
            </button>
          </form>
         
          <div className=" text-center p-4 flex justify-around">
          </div>
        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertStatus}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertText}
        </Alert>
      </Snackbar>
      </div>
    </div>
  )
}

export default ResetPassword