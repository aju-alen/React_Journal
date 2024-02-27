import  { useState,useMemo } from 'react'
import axios from 'axios';
import Select from 'react-select';
import countryList from 'react-select-country-list'
import { Link,useNavigate } from 'react-router-dom';
import ImageHeader from '../components/ImageHeader';


const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({

    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    surname: '',
    otherName: '',
    affiliation: '',
  });

  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setValue(value)
    console.log(value);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData, e);
  };

  const handleSubmit =async  (e) => {
    e.preventDefault();
    console.log(e.target[0]);
    if (formData.password !== formData.confirmPassword) {
      return alert("Password do not match")
    }
    const mergeForm = Object.assign({},formData,value)
    try{
      const res = await axios.post('http://localhost:3001/api/auth/register',mergeForm)
      console.log(res);
      if (res.status === 201){
        navigate('/login')
      }
      else {
        alert('Registration failed')
      }

    }
    catch(err){
      console.log(err);
    }
    console.log('Form submitted:', mergeForm);
  };
  return (
    <div className="h-auto w-auto">
      <ImageHeader/>
      <div className="min-h-screen flex md:items-center justify-center bg-gray-100 md:p-10">
        <div className="bg-white p-8 rounded shadow-md w-full md:w-5/6">
          <h2 className="text-2xl font-semibold mb-6 text-center">Please enter your details to create your account and submit articles</h2>
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
              <Select options={options} value={value} onChange={changeHandler}  />
            </div>
            <div className=""></div>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded focus:outline-none hover:bg-indigo-600 w-full"
            >
              Register
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
    </div>
  )
}

export default Register