import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import Axios from 'axios'
import {Link,useLocation, useNavigate} from 'react-router-dom'
import { Store } from '../Store';
import { toast } from 'react-toastify';
import {getError} from '../utils';
function SignupScreen() {
    const navigate=useNavigate();
    const {search}=useLocation();
    const redirectInUrl=new URLSearchParams(search).get('redirect');
    const redirect=redirectInUrl?redirectInUrl:'/'

    const[name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');

    const {state,dispatch:ctxDispatch}=useContext(Store);
    const {userInfo}=state;
    const submitHandler=async(e)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            toast.error('Password do not match!');
            return;
        }
        try{
            const {data}=await Axios.post('/api/users/signup',{
                name,
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
    <div className='signup'>
        <div className="container">
            <div className="row">
                <div className="col">
                    <Helmet><title>Sign up</title></Helmet>
                    <h1>Sign up</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type='text' id='name' onChange={(e)=>{
                                setName(e.target.value)
                            }}required/>
                        </div>
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
                            <label>Confirm Password</label>
                            <input type='password' id='c_pass' onChange={(e)=>{setConfirmPassword(e.target.value)}}required/>
                        </div>
                        <div className="form-group">
                            <button type='submit'>Sign Up</button>
                        </div>
                        <div className="form-group">
                            <p>Already have an account{' '} <Link to={`/signin?redirect=${redirect}`}>Sign in</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignupScreen