import { useState, useMemo } from 'react'
import axios from 'axios';
import Select from 'react-select';
import countryList from 'react-select-country-list'
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import ImageHeader from '../components/ImageHeader';
import { httpRoute } from '../helperFunctions.js';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';


const Register = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('');
  const [formData, setFormData] = useState({

    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    surname: '',
    otherName: '',
    affiliation: '',
  });

  const [checkedFormdata, setCheckedFormdata] = useState({
    marketingCommunications : false,
    agreeTerms : false
  })
  const [passwordError, setPasswordError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setValue(value)
    console.log(value);
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === 'password') {
      validatePassword(value);
    }
    console.log(formData, e);
  };

  const handleCheckBoxChange = (event) => {
   setCheckedFormdata({ ...checkedFormdata, [event.target.name]: event.target.checked });
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one special character, and have a minimum length of 8 characters.');
    } else {
      setPasswordError('');
      setIsValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(e.target[0]);
    if (formData.password !== formData.confirmPassword) {
      return alert("Password do not match")
    }
    const mergeForm = Object.assign({}, formData, value, checkedFormdata)
    console.log(mergeForm, 'merged');
    try {
      const res = await axios.post(`${httpRoute}/api/auth/register`, mergeForm)
      console.log(res);
      if (res.status === 201) {
        handleClick();
          setAlertMessage(res.data.message);
          setAlertColor('success');

        setTimeout(() => {
          navigate('/login')
        }, 3000);
      }
      setLoading(false);
    }
    catch (err) {
      console.log(err,'error');
      handleClick();
      setAlertMessage(err.response.data);
      setAlertColor('error');
      setLoading(false);
    }
    console.log('Form submitted:', mergeForm);
  };
  console.log(checkedFormdata, 'checked');
  return (
    <div className="h-auto w-auto">
      <ImageHeader />
      <div className="min-h-screen flex flex-col md:items-center justify-center bg-gray-100 md:p-10">
        <img src="./images/SJP-Image.png" alt="ScientificJournalsPortal" className=' object-scale-down md: h-64 w-auto my-1 md:my-2' />
        <div className="bg-white p-8 rounded shadow-md w-full md:w-5/6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
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
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
              {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Prof</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                Surname
              </label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otherName">
                Other Name
              </label>
              <input
                type="text"
                id="otherName"
                name="otherName"
                value={formData.otherName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="affiliation">
                Affiliation
              </label>
              <input
                type="text"
                id="affiliation"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="affiliation">
                Country
              </label>
              <Select options={options} value={value} onChange={changeHandler} />
            </div>
            <div className=" flex justify-start items-center mb-6">
              <Checkbox
                checked={checkedFormdata.marketingCommunications}
                name='marketingCommunications'
                onChange={handleCheckBoxChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <label className=' text-xs md:w-1/2 '>Scientific Journals Portal may send you marketing communications about relevant products and events. You can unsubscribe at any time via your Scientific Journals Portal account. </label>
            </div>
            <div className=" text-xs"><span className=' text-red-500'>*</span>By continuing you agree with our Terms and conditions and Privacy policy</div>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-indigo-600 w-full"
              disabled={!isValid}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Register'}
            </button>
            <div className=" text-center p-4">
              Already Registered?
              <span>
                <Link to='/login' className=' text-blue-600'> CLICK HERE TO LOGIN</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertColor}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Register