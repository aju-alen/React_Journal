import  { useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import axios from 'axios';
import ImageHeader from '../components/ImageHeader';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
import { useParams } from "react-router-dom";
import { httpRoute } from "../helperFunctions.js";
const CheckoutForm = () => {
    const {articleId,checkoutStatus,userId,emailId,stripeLookupId} = useParams()
    
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
      console.log(articleId,checkoutStatus,userId,emailId,stripeLookupId);
      
     
      const getStripeCheckoutSession = async () => {
          const resp = await axios.post(`${httpRoute}/api/stripe/create-checkout-session`,{articleId,checkoutStatus,userId,emailId,stripeLookupId} ) 
          setClientSecret(resp.data.clientSecret)
          console.log(resp.data.clientSecret,'clientSecret in checkout');
      }
      getStripeCheckoutSession()
    }, []);


  return (
    <div className="h-auto w-auto bg-slate-200 ">
    <ImageHeader/>
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{clientSecret}}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
    </div>
  )
}

export default CheckoutForm