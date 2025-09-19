import React, { Component, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { faShoppingCart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.css";

// Product Modal Component (Functional Component)
const ProductModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">{product.desc}</h5>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
          <img 
            src={product.image} 
            alt={product.desc}
            className="modal-product-image"
          />
          <div className="modal-rating">
            <span>Ratings: {product.rating || '3.5'}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product List Component (Functional Component)
const ProductList = ({ products, onQuantityChange, onProductClick }) => {
  return (
    <div className="container mt-4">
      {products.map((product, index) => (
        <div key={index} className="row mb-3 pb-3 border-bottom">
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              <img 
                src={product.image} 
                alt={product.desc}
                className="me-3 product-image clickable"
                onClick={() => onProductClick(product)}
              />
              <div className="flex-grow-1">
                <h5 className="mb-1 clickable" onClick={() => onProductClick(product)}>{product.desc}</h5>
              </div>
              <div className="quantity-controls">
                <span className="me-2">Quantity</span>
                <button 
                  className="btn btn-outline-secondary btn-sm me-1"
                  onClick={() => onQuantityChange(index, Math.max(0, product.value - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={product.value}
                  onChange={(e) => onQuantityChange(index, parseInt(e.target.value) || 0)}
                  className="form-control quantity-input text-center"
                />
                <button 
                  className="btn btn-outline-secondary btn-sm ms-1"
                  onClick={() => onQuantityChange(index, product.value + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// SignIn Component (Functional Component)
const SignIn = ({ onLoginSuccess, onBackToCart }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState('');

  // Load Facebook SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    script.onload = () => {
      if (window.FB) {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID || 'your-facebook-app-id', // You need to set this in your .env file
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      }
    };

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://connect.facebook.net/en_US/sdk.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`Welcome ${formData.name}!`);
    onLoginSuccess({ name: formData.name, email: formData.email });
  };

  // Handle Facebook login
  const handleFacebookLogin = () => {
    if (window.FB) {
      // Check if user is already logged in
      window.FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          // User is already logged in
          console.log('User already logged in:', response);
          setLogin(true);
          setData(response);
          getUserInfo();
        } else {
          // User needs to log in
          window.FB.login((loginResponse) => {
            if (loginResponse.authResponse) {
              console.log('Facebook login success:', loginResponse);
              setLogin(true);
              setData(loginResponse);
              getUserInfo();
            } else {
              console.log('Facebook login cancelled or failed');
              alert('Facebook login cancelled or failed, please try again');
            }
          }, { 
            scope: 'email,public_profile',
            return_scopes: true
          });
        }
      });
    } else {
      alert('Facebook SDK is not loaded, please refresh the page and try again');
    }
  };

  // Get user information from Facebook
  const getUserInfo = () => {
    window.FB.api('/me', { fields: 'name,picture,email' }, (userInfo) => {
      console.log('User info:', userInfo);
      setData(prev => ({
        ...prev,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture?.data?.url
      }));
      if (userInfo.picture?.data?.url) {
        setPicture(userInfo.picture.data.url);
      }
      // Call login success callback
      onLoginSuccess({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture?.data?.url
      });
    });
  };

  // Handle Facebook logout
  const handleFacebookLogout = () => {
    if (window.FB) {
      window.FB.logout((response) => {
        console.log('Facebook logout:', response);
        setLogin(false);
        setData({});
        setPicture('');
        alert('Logout successfully');
      });
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Sign In</h1>
        <p className="signin-description">Please login using one of the following:</p>
        
        {/* Traditional Form Login */}
        <div className="form-section">
          <form onSubmit={handleFormSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>

        {/* Facebook Login Button */}
        <div className="facebook-section">
          <button 
            className="facebook-login-button"
            onClick={handleFacebookLogin}
          >
            LOGIN WITH FACEBOOK
          </button>
        </div>

        {/* Back to Cart Button */}
        <div className="back-section">
          <button 
            className="back-button"
            onClick={onBackToCart}
          >
            Back to Cart
          </button>
        </div>

        {/* Display login success info */}
        {login && (
          <div className="success-info">
            <h3>Welcome {data.name}!</h3>
            {picture && <img src={picture} alt="Profile" className="profile-picture" />}
            {data.email && <p>Email: {data.email}</p>}
            <button 
              className="logout-button"
              onClick={handleFacebookLogout}
            >
              Logout Facebook
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Component (Functional Component)
const Cart = ({ products, onCheckout }) => {
  const cartItems = products.filter(product => product.value > 0);
  
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <h3 className="mb-3">Your Cart Items</h3>
          {cartItems.map((product, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img 
                      src={product.image} 
                      alt={product.desc}
                      className="img-fluid"
                      style={{ maxHeight: '100px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="card-title">{product.desc}</h5>
                    <p className="card-text">Quantity: {product.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button 
            className="btn btn-primary btn-lg"
            onClick={onCheckout}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

// Header Component (Functional Component)
const Header = ({ totalItems }) => {
  return (
    <header className="bg-primary text-white py-3">
      <div className="container">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="mb-0 d-flex align-items-center">
              Shop 2 
              <span className="react-logo ms-2">R</span>
              eact
            </h2>
          </div>
          <div className="col-auto">
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            <span>{totalItems} items</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Main App Component (Class Component)
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        {
          image: './products/cologne.jpg',
          desc: 'Unisex Cologne',
          value: 2,
          rating: '4.2'
        },
        {
          image: './products/iwatch.jpg',
          desc: 'Apple iWatch',
          value: 1,
          rating: '3.5'
        },
        {
          image: './products/mug.jpg',
          desc: 'Unique Mug',
          value: 3,
          rating: '4.8'
        },
        {
          image: './products/wallet.jpg',
          desc: 'Mens Wallet',
          value: 0,
          rating: '4.0'
        }
      ],
      selectedProduct: null,
      isModalOpen: false,
      showSignIn: false,
      isLoggedIn: false,
      userInfo: null
    };
  }

  handleQuantityChange = (index, newValue) => {
    this.setState(prevState => ({
      products: prevState.products.map((product, i) => 
        i === index ? { ...product, value: newValue } : product
      )
    }));
  };

  getTotalItems = () => {
    return this.state.products.reduce((total, product) => total + product.value, 0);
  };

  handleProductClick = (product) => {
    this.setState({
      selectedProduct: product,
      isModalOpen: true
    });
  };

  handleCloseModal = () => {
    this.setState({
      selectedProduct: null,
      isModalOpen: false
    });
  };

  handleCheckout = () => {
    const cartItems = this.state.products.filter(product => product.value > 0);
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // 跳转到登录页面
    this.setState({
      showSignIn: true
    });
  };

  handleLoginSuccess = (userInfo) => {
    this.setState({
      isLoggedIn: true,
      userInfo: userInfo,
      showSignIn: false
    });
    
    // 显示结账信息
    const cartItems = this.state.products.filter(product => product.value > 0);
    const checkoutMessage = cartItems.map(item => 
      `${item.desc} x ${item.value}`
    ).join('\n');
    
    alert(`Welcome ${userInfo.name}!\n\nCheckout Summary:\n${checkoutMessage}\n\nTotal Items: ${this.getTotalItems()}`);
    
    // 清空购物车
    this.setState(prevState => ({
      products: prevState.products.map(product => ({ ...product, value: 0 }))
    }));
  };

  handleBackToCart = () => {
    this.setState({
      showSignIn: false
    });
  };

  render() {
    // 如果显示登录页面
    if (this.state.showSignIn) {
      return (
        <div className="App">
          <SignIn 
            onLoginSuccess={this.handleLoginSuccess}
            onBackToCart={this.handleBackToCart}
          />
        </div>
      );
    }

    return (
      <div className="App">
        <Header totalItems={this.getTotalItems()} />
        <ProductList 
          products={this.state.products} 
          onQuantityChange={this.handleQuantityChange}
          onProductClick={this.handleProductClick}
        />
        <Cart 
          products={this.state.products}
          onCheckout={this.handleCheckout}
        />
        <ProductModal 
          product={this.state.selectedProduct}
          isOpen={this.state.isModalOpen}
          onClose={this.handleCloseModal}
        />
      </div>
    );
  }
}

export default App;