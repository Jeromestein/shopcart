import React, { Component } from "react";
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
      isModalOpen: false
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

  render() {
    return (
      <div className="App">
        <Header totalItems={this.getTotalItems()} />
        <ProductList 
          products={this.state.products} 
          onQuantityChange={this.handleQuantityChange}
          onProductClick={this.handleProductClick}
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