import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import Axios from 'axios'
import {Link,useLocation, useNavigate} from 'react-router-dom'
import { Store } from '../Store';
import { toast } from 'react-toastify';
import {getError} from '../utils';
function SigninScreen() {
    const navigate=useNavigate();
    const {search}=useLocation();
    const redirectInUrl=new URLSearchParams(search).get('redirect');
    const redirect=redirectInUrl?redirectInUrl:'/'

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const {state,dispatch:ctxDispatch}=useContext(Store);
    const {userInfo}=state;
    const submitHandler=async(e)=>{
        e.preventDefault();
        try{
            const {data}=await Axios.post('/api/users/signin',{
                email,
                password,
            });
            ctxDispatch({type:'USER_SIGNIN',payload:data});
            localStorage.setItem('userInfo',JSON.stringify(data));
            navigate(redirect || '/');
            
        }catch(err){ 
            toast.error(getError(err));
        }
    }
    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    },[navigate,redirect,userInfo]);
  return (
    <div className='signin'>
        <div className="container">
            <div className="row">
                <div className="col">
                    <Helmet><title>Sign In</title></Helmet>
                    <h1>Sign In</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type='email' id='email' onChange={(e)=>{
                                setEmail(e.target.value)
                            }}required/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type='password' id='pass' onChange={(e)=>{setPassword(e.target.value)}}required/>
                        </div>
                        <div className="form-group">
                            <button type='submit'>Sign In</button>
                        </div>
                        <div className="form-group">
                            <p>New Customer?{} <Link to={`/signup?redirect=${redirect}`}>Create your account</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SigninScreen