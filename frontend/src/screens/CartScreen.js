import React, { useContext } from 'react'
import {Store} from '../Store';
import {Helmet} from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
function CartScreen() {
  const navigate=useNavigate();
  const {state,dispatch:ctxDispatch}=useContext(Store);
  const {
    cart:{
      cartItems
    },
  }=state;

  const updateCartHandler=async (item,quantity)=>{
    const {data}=await axios.get(`/api/products/${item._id}`);
    if(data.countInStock<quantity){
      window.alert('sorry. Product is out of stock');
      return;
    }
  
    ctxDispatch({type:'CART_ADD_ITEM',payload:{...item,quantity},
    });
  };
  const removeCartHandler=(item)=>{
    ctxDispatch({type:'CART_REMOVE_ITEM',payload:item})
  };
  const checkoutHandler=()=>{
    navigate('/signin?redirect=/shipping');
  }
  return (
    <div className='cart'>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Shopping Cart</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {
              cartItems.length===0?(
                <p className='cartEmpty'>Cart is Empty.<Link to='/'>Go Shopping</Link></p>
              ):(
                <div className="cards">
                 {
                   cartItems.map((item)=>{
                    return(
                      <div className="card" key={item._id}>
                      <div className="row cardContent">
                        <div className="col">
                          <div className="nameImage">
                            <img className='itemImage'src={item.image} alt={item.name}/>
                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                          </div>
                        </div>
                        <div className="col">
                          <button onClick={()=>updateCartHandler(item,item.quantity-1)}disabled={item.quantity===1}>
                            <i className='fas fa-minus-circle'></i>
                          </button>{' '}

                          <span>{item.quantity}</span>{' '}

                          <button onClick={()=>updateCartHandler(item,item.quantity+1)}disabled={item.quantity===item.countInStock}>
                            <i className='fas fa-plus-circle'></i>
                          </button>
                        </div>
                        <div className="col">
                          <span className='price'>${item.price}</span>
                        </div>
                        <div className="col">
                          <button onClick={()=>removeCartHandler(item)}>
                            <i className='fas fa-trash'></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    )
                  })
                 }
                </div>
              )
            }
          </div>
          <div className="col">
            <div className="cart total">
              <h3>(Subtotal {cartItems.reduce((a,c)=>a+c.quantity,0)}{' '}items:${cartItems.reduce((a,c)=>a+c.price * c.quantity,0)})</h3>
              <button onClick={checkoutHandler} disabled={cartItems.length===0}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CartScreen