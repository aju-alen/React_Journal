import axios from 'axios';
import  {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ImageHeader from '../components/ImageHeader';
import { httpRoute } from '../helperFunctions.js';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// To stop the links being rendered (Replace the Link Component with MemoizedLinks) 

// const MemoizedLink = memo(({ to, className, children }) => (
//   <Link to={to} className={className}>
//     {children}
//   </Link>
// ));
const Login = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({

        email: '',
        password: '',
      });
    
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        console.log(formData, e);
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault(); 
        console.log('Form submitted:', formData);
        try{
          const res = await axios.post(`${httpRoute}/api/auth/login`,formData)
          console.log(res.data);
          if (res.status === 200){
            console.log('User logged in',res.data);
            localStorage.setItem('currentUser',JSON.stringify(res.data))

            navigate("/");
          }
        }
        catch(err){
          console.log(err);
          setOpen(true);
        }
      };
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    
      return (
        <div className="h-auto w-auto">
          <ImageHeader/>
          <div className="min-h-screen flex md:items-center justify-center bg-gray-100 md:p-10">
            <div className="bg-white p-8 rounded shadow-md w-full md:w-5/6">
              <h2 className="text-2xl font-semibold mb-6 text-center">Login Here to submit articles</h2>
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
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className=" flex flex-row justify-center items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 "
                    required
                  />
                  {!showPassword?<VisibilityOffIcon onClick={() => setShowPassword(!showPassword)} className=" absolute right-52 " />:<VisibilityIcon onClick={() => setShowPassword(!showPassword)} className=" absolute right-52 "/>}  
                  </div>
                  
                </div>

                <div className=""></div>
                <button 
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-indigo-600 w-full"
                >
                  Login
                </button>
              </form>
              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
         Login Failed, either email or password is incorrect or credentials does not exist or is not verified by registered email.
        </Alert>
      </Snackbar>
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

export default Login