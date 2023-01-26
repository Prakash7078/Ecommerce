import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps'
import { Store } from '../Store';
import { getError } from '../utils';
const reducer=(state,action)=>{
    switch(action.type){
        case 'CREATE_REQUEST':
            return {...state,loading:true};
        case 'CREATE_SUCCESS':
            return {...state,loading:false};
        case 'CREATE_FAIL':
            return {...state,loading:false};
        default:
            return state;
    }
}
function PlaceorderScreen() {
    const navigate=useNavigate();

    const [{loading},dispatch]=useReducer(reducer,{
        loading:false,

    });

    const {state,dispatch:ctxDispatch}=useContext(Store);
    const{cart,userInfo}=state;
    const round=(num)=>Math.round(num*100+Number.EPSILON)/100;

    cart.itemsPrice=round(cart.cartItems.reduce((a,c)=>a+c.quantity*c.price,0));
    cart.shippingPrice=cart.itemsPrice>100?round(0):round(10);
    cart.taxPrice=round(0.2*cart.itemsPrice);
    cart.totalPrice=cart.itemsPrice+cart.shippingPrice+cart.taxPrice;
    const placeOrderHandler=async()=>{
        try{
            dispatch({type:'CREATE_REQUEST'});

            const {data}=await axios.post('/api/orders',{
                orderItems:cart.cartItems,
                shippingAddress:cart.shippingAddress,
                paymentMethod:cart.paymentMethod,
                itemsPrice:cart.itemsPrice,
                shippingPrice:cart.shippingPrice,
                taxPrice:cart.taxPrice,
                totalPrice:cart.totalPrice,
                _id:userInfo._id
            },{
                headers:{
                    authorization:`Bearer ${userInfo.token}`,
                },
            });
            ctxDispatch({type:'CART_CLEAR'});
            dispatch({type:'CREATE_SUCCESS'});
            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);
        }catch(err){
            dispatch({type:'CREATE_FAIL'});
            toast.error(getError(err));
        }
    }

    useEffect(()=>{
        if(!cart.paymentMethod){
            navigate('/payment');
        }
    },[cart,navigate]);
    
  return (
    <div className='placeorder'>
        <div className="container">
            <div className="row">
                <div className="col">
                    <Helmet><title>Placeorder</title></Helmet>
                    <h1>PlaceOrder</h1>
                </div>
            </div>
            <div className="row">
                <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            </div>
            <div className="row">
                <div className="col">
                   <div className="card">
                    <div className="card-body">
                        <h4 className="shipping">Shipping</h4>
                        <p className="content">
                            <span>Name:<strong>{cart.shippingAddress.fullName}</strong></span><br></br>
                            <span>Address:<strong>{cart.shippingAddress.address},{cart.shippingAddress.city},{cart.shippingAddress.postalCode},{cart.shippingAddress.country}</strong></span><br/>

                        </p>
                        <Link to='/shipping'>Edit</Link>
                    </div>
                   </div>
                   <div className="card">
                    <div className="card-body">
                        <h4 className="shipping">Payment</h4>
                        <p className="content">
                            <span>Payment:<strong>{cart.paymentMethod}</strong></span><br/>
                        </p>
                        <Link to='/payment'>Edit</Link>
                    </div>
                   </div>
                   <div className="card">
                    <div className="card-body">
                        <h4 className="shipping">Items</h4>
                        <div className="items">
                        {
                             cart.cartItems.map((item)=>{
                                return(
                                  <div className="cardImg" key={item._id}>
                                  <div className="cardContent">
                                    <div className="colBox">
                                      <div className="nameImage">
                                        <img className='itemImage'src={item.image} alt={item.name}/>
                                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                      </div>
                                    </div>
                                    <div className="colBox">
                                      <span className='quantity'>{item.quantity}</span>
                                    </div>
                                    <div className="colBox">
                                      <span className='price'>${item.price}</span>
                                    </div>
                                    
                                  </div>
                                </div>
                                )
                            })
                            
                        }
                        </div>
                        <Link to='/cart'>Edit</Link>
                    </div>
                   </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="shipping">Order Summary</h4>
                            <p className="content">
                                <span>Items:<strong>${cart.itemsPrice.toFixed(2)}</strong></span><br/>
                                <span>Shipping:<strong>${cart.shippingPrice.toFixed(2)}</strong></span><br/>
                                <span>Tax:<strong>${cart.taxPrice.toFixed(2)}</strong></span><br/>
                                <span>Order Total:<strong>${cart.totalPrice.toFixed(2)}</strong></span><br/>
                            </p>
                            <button typeof='button' onClick={placeOrderHandler} disabled={cart.cartItems.length===0}>Place Order</button>
                        </div>
                        {loading &&
                        <div>
                            <h3 className="message">Loading...</h3>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PlaceorderScreen