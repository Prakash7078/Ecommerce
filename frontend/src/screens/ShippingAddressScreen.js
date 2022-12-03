import React, { useContext, useEffect, useState } from 'react'
import {Helmet} from 'react-helmet-async';
import {  useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';
function ShippingAddressScreen() {

    const navigate=useNavigate();
    const {state,dispatch:ctxDispatch}=useContext(Store);
    
    const {
        userInfo,
        cart:{
            shippingAddress
        },
    }=state;

    
    const [fullName,setFullName]=useState(shippingAddress.fullName || '');
    const [address,setAddress]=useState(shippingAddress.address || '');
    const[city,setCity]=useState(shippingAddress.city || '');
    const[country,setCountry]=useState(shippingAddress.country|| '');
    const[postalCode,setPostalCode]=useState(shippingAddress.postalCode || '');

    useEffect(()=>{
        if(!userInfo){
            navigate('/signin?redirect=/shipping');
        }
    },[userInfo,navigate]);
    const submitHandler=async(e)=>{
        e.preventDefault();
        ctxDispatch({
            type:'SAVE_SHIPPING_ADDRESS',
            payload:{
                fullName,
                address,
                city,
                postalCode,
                country
            },
        });
        localStorage.setItem('shippingAddress',JSON.stringify({
            fullName,
            address,
            city,
            postalCode,
            country
        }));
        navigate('/payment');
    }
  return (
    <div className='shipping'>
        <div className="container">
            <div className="row">
                <div className="col">
                    <Helmet><title>Shipping Address</title></Helmet>
                    <h1>Shipping Address</h1>
                </div>
            </div>
            <div className="row">
                <CheckoutSteps step1 step2 ></CheckoutSteps>
            </div>
            <div className="row">
                <div className="col">
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type='text' value={fullName}id='f_name' onChange={(e)=>{
                                setFullName(e.target.value)
                            }}required/>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type='text' value={address} id='address' onChange={(e)=>{setAddress(e.target.value)}}required/>
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input type='text'value={city} id='city' onChange={(e)=>{setCity
                                (e.target.value)}}required/>
                        </div>
                        <div className="form-group">
                            <label>Postal Code</label>
                            <input type='text'value={postalCode} id='p_code' onChange={(e)=>{setPostalCode
                                (e.target.value)}}required/>
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input type='text'value={country} id='country' onChange={(e)=>{setCountry
                                (e.target.value)}}required/>
                        </div>
                        <div className="form-group">
                            <button type='submit'>Continue</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShippingAddressScreen