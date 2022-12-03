import './App.css';
import HomeScreen from './screens/HomeScreen'
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import {Store} from './Store';
import {useContext} from 'react';
import CartScreen from './screens/CartScreen';
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/paymentMethodScreen';
import PlaceorderScreen from './screens/placeorderScreen';

function App() {

  const {state,dispatch:ctxDispatch}=useContext(Store);
  const {cart,userInfo}=state;

  const signoutHandler=()=>{
    ctxDispatch({type:'USER_SIGNOUT'});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  }

  return (
    <BrowserRouter>
    <div className='main-container'>
      <ToastContainer position='bottom-center' limit={1}/>
      <header>
        <div>
          <Link to='/'>PNR</Link>
        </div>
        <div className='right'>
          <Link to='/cart'>
            <p>Cart
              {
                cart.cartItems.length>0 && (
                  <span className='cart'>{cart.cartItems.reduce((a,c)=>a+c.
                  quantity,0)}</span>
                )
              }
            </p>
          </Link>
          {userInfo ?(
            <div className="dropdown">
              <Link to="" className='dropbtn'>{userInfo.name}</Link>
                <div className="dropdown-content">
                  <Link to='/profile'>User Profile</Link>
                  <Link to='/orderhistory'>Order History</Link>
                  <Link to='#signout' onClick={signoutHandler}>Sign Out</Link>
                </div>
            </div>
          ):(
            <Link to='/signin'>
              <p>Sign In</p>
            </Link>
          )};
        </div>
      </header>
      <main>
        <Routes>
          <Route path='/' element={<HomeScreen/>}></Route>
          <Route path='/cart' element={<CartScreen/>}></Route>
          <Route path='/signin' element={<SigninScreen/>}></Route>
          <Route path='/signup' element={<SignupScreen/>}></Route>
          <Route path='/shipping' element={<ShippingAddressScreen/>}></Route>
          <Route path='/payment' element={<PaymentMethodScreen/>}></Route>
          <Route path='/placeorder' element={<PlaceorderScreen/>}></Route>
          <Route path='/product/:slug' element={<ProductScreen/>}></Route>
        </Routes>
      </main>
      <footer>
        <p>&copy;2022, All Rights Reserved. Powered by Prakash</p>
      </footer>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
