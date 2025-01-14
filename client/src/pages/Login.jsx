import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageHeader from '../components/ImageHeader';
import { httpRoute } from '../helperFunctions.js';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${httpRoute}/api/auth/login`, formData);
      if (res.status === 200) {
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <ImageHeader />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
            Login Here to submit articles
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                className="block text-gray-700 text-sm font-bold mb-2" 
                htmlFor="email"
              >
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

            <div>
              <label 
                className="block text-gray-700 text-sm font-bold mb-2" 
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? 
                    <VisibilityIcon className="text-gray-500 w-5 h-5" /> : 
                    <VisibilityOffIcon className="text-gray-500 w-5 h-5" />
                  }
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          <div className="mt-6 space-y-4 sm:space-y-0 sm:flex sm:justify-between text-sm">
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <span>Forgot Password?</span>
              <Link to="/forget-password" className="text-blue-600 hover:text-blue-700">
                CLICK HERE
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1">
              <span>Not Registered Yet?</span>
              <Link to="/register" className="text-blue-600 hover:text-blue-700">
                CLICK HERE TO REGISTER
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Login Failed, either email or password is incorrect or credentials do not exist or are not verified by registered email.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;