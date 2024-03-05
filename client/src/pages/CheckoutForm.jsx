import React, { useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import axios from 'axios';
import ImageHeader from '../components/ImageHeader';
const stripePromise = loadStripe("pk_test_51OmAAaC0iMczP50IYfYY6UQfkPaNsmSLw4x58ORMXQPhSqQoE08UazgTs4hYsIPGHSbL9dQ0hbklAqT7qcMHvrPj00SYJ1QA50");
import { useParams } from "react-router-dom";
import { httpRoute } from "../helperFunctions.js";
const CheckoutForm = () => {
    const {articleId} = useParams()

    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
     
      const getStripeCheckoutSession = async () => {
          const resp = await axios.post(`${httpRoute}/api/stripe/create-checkout-session`,{articleId} ) 
          setClientSecret(resp.data.clientSecret)
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