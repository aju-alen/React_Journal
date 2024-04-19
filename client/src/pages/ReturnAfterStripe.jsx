import axios from 'axios';
import {useState,useEffect} from 'react'
import ImageHeader from '../components/ImageHeader';
import { Link,Navigate } from 'react-router-dom';
import { httpRoute } from '../helperFunctions';
const ReturnAfterStripe = () => {

    const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [userId, setUserId] = useState('')


  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    const getSessionStatus = async () => {
      const getUser = JSON.parse(localStorage.getItem('currentUser'))?.user
      setUserId(getUser.id)
      console.log(userId, 'getuser');
        const resp = await axios.get(`${httpRoute}/api/stripe/session-status?session_id=${sessionId}`)
        setStatus(resp.data.status)
        setCustomerEmail(resp.data.customer_email)
    }
    getSessionStatus()
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    )
  }

  if (status === 'complete') {
    return (
      <div className="h-auto w-auto  ">
      <ImageHeader/>
      <div className="flex flex-col items-center justify-center md:m-20 ">
      <h1 className=' mb-8 ' >Payment Complete!✅</h1>
      <h1 className=' mx-4 text-center' > You can download the invoice or get any details regarding the payment on your 
      <Link to={`/dashboard/${userId}`} className='text-blue-700'>
      <b className=' text-xl'> Dashboard </b>
      </Link>
       menu.</h1>
      </div>
      </div>
    )
  }

  return null;
}


export default ReturnAfterStripe