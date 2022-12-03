import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import CheckoutSteps from '../components/CheckoutSteps'
import {  useNavigate } from 'react-router-dom'
import { Store } from '../Store';
function PaymentMethodScreen() {
    const navigate=useNavigate();

    const {state,dispatch:ctxDispatch}=useContext(Store);

    const {
        cart:{
            shippingAddress,paymentMethod
        },
    }=state;
    const[paymentMethodName,setPaymentMethod]=useState(
        paymentMethod || 'PayPal'
    );
    useEffect(()=>{
        if(!shippingAddress){
            navigate('/shipping');
        }
    },[shippingAddress,navigate]);
    const submitHandler=async(e)=>{
        e.preventDefault();
        ctxDispatch({
            type:'SAVE_PAYMENT_METHOD',
            payload:paymentMethodName,
        });
        localStorage.setItem('paymentMethod',paymentMethodName);
        navigate('/placeorder');
    }

  return (
    <div className='payment'>
        <div className="container">
            <div className="row">
                <div className="col">
                    <Helmet><title>Payment Method</title></Helmet>
                    <h1>Payment Method</h1>
                </div>
            </div>
            <div className="row">
                <CheckoutSteps step1 step2 step3></CheckoutSteps>
            </div>
            <div className="row">
                <div className="col">
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>PayPal</label>
                            <input type="radio" value="PayPal"id="PayPal" checked={paymentMethodName==='PayPal'} onChange={(e)=>setPaymentMethod(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label>Stripe</label>
                            <input type="radio"value="Stripe" id="Stripe" checked={paymentMethodName==='Stripe'} onChange={(e)=>setPaymentMethod(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <button type='submit' className='paymentCon'>Continue</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PaymentMethodScreen