import axios from 'axios';
import React,{useState,useEffect} from 'react'
import ImageHeader from '../components/ImageHeader';
const ReturnAfterStripe = () => {

    const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    const getSessionStatus = async () => {
        const resp = await axios.get(`http://localhost:3001/api/stripe/session-status?session_id=${sessionId}`)
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
        <div className="h-auto w-auto bg-slate-200 ">
        <ImageHeader/>
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.

          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
        </div>
    )
  }

  return null;
}


export default ReturnAfterStripe