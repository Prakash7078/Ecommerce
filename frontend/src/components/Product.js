import axios from 'axios';
import React, { useContext } from 'react'
import {Link} from 'react-router-dom';
import Rating from '../components/Rating'
import { Store } from '../Store';
function Product(props) {
  const {product}=props;
  const {state,dispatch:ctxDispatch}=useContext(Store);
  //from cartScreen we fetch the updateCartHandler
  const {
    cart:{
      cartItems
    },
  }=state;
  const addToCartHandler=async (item)=>{
    //fetch from ProductScreen
    const existItem=cartItems.find((x)=>x._id===product._id);
      //if not exist then quantity 1 , but id exist +1
      const quantity=existItem ? existItem.quantity + 1: 1;
    const {data}=await axios.get(`/api/products/${item._id}`);
    if(data.countInStock<quantity){
      window.alert('sorry. Product is out of stock');
      return;
    }
  
    ctxDispatch({type:'CART_ADD_ITEM',payload:{...item,quantity},
    });
  };

  return (
    <div className="product" key={product.slug}>
        <Link to={`/product/${product.slug}`}>
            <img src={product.image} alt={product.name}/>
        </Link>
        <div className="productInfo">
            <Link to={`/product/${product.slug}`}><p className='name'>{product.name}</p></Link>
            <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
            <p className='price'>${product.price}</p>
            {
              product.countInStock===0 ?(
              <button className='out' disabled>Out Of Stock</button>
              )
              :
              ( <button onClick={()=>addToCartHandler(product)}>Add to Cart</button>)
            }
            
        </div>
     </div>
  )
}

export default Product