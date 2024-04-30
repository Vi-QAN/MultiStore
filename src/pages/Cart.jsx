import React, { useState, useEffect} from 'react';
import { Button, Card, Col, Container, Form, ListGroup, Row, Nav, ListGroupItem } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

import { IoMdClose } from "react-icons/io";

import Navbar from '../components/Navbar';
import OrderPlacingModal from '../components/OrderPlacingModal';

import { CartConsumer } from '../hooks/useCart';
import { AuthenticationConsumer } from '../hooks/useAuthentication';

import { addOrder } from '../routes/orderApi';

const CartPage = () => {
  const { cartItems, totalPrice, setTotalPrice, calculateTotalPrice } = CartConsumer();
  const { isAuthenticated, token } = AuthenticationConsumer();
  const [cookies, setCookie, removeCookie] = useCookies(['cartItems']);
  const [ showOrderPlacingModal, setShowOrderPlacingModal ] = useState(false);
  const [ onPlacingOrder, setOnPlacingOrder ] = useState(false);
  const [ orderId, setOrderId ] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to handle quantity change
  const handleQuantityChange = (index, quantity) => {
    if (quantity < 1) return;
    const updatedCartItems = [...cartItems.current];
    updatedCartItems[index].quantity = quantity;
    cartItems.current = updatedCartItems;
    calculateTotalPrice();
  };

  // Function to remove item from cart
  const handleRemoveItem = (index) => {
    const updatedCartItems = cartItems.current.filter((_, i) => i !== index);
    cartItems.current = updatedCartItems;
    calculateTotalPrice();
  };

  const handleContinueShopping = () => {
    //setCookie('cartItems', cartItems.current, { path: '/cart' });
    navigate('/home');
  }

  const handleAddOrder = async () => {
    if (cartItems.current.length < 1) return;
    if (token === null) return;
    setOnPlacingOrder(true);
    setShowOrderPlacingModal(true);
    const items = cartItems.current.map(item => { return { productId: item.sku, productName: item.name, imageUrl: item.image, quantity: item.quantity}});
    const response = await addOrder({products: items, totalPrice: totalPrice}, token);
    if (response){
      setOnPlacingOrder(false);
      if (response.status === 200){
        setOrderId(response.orderNumber);
        cartItems.current = [];
        setTotalPrice(0);
      }
    }
  }

  const handleCloseOrderPlacingModal = () => {
    setShowOrderPlacingModal(false);
  }

  useEffect(() => {
    if (!isAuthenticated){
      navigate('/home');
    } else {
      try {
        if (location.state.cartItems){
          cartItems.current = [...location.state.cartItems];
          calculateTotalPrice();
        }
      } catch(e){
        navigate('/home');
      }
    }
    
    // if (location.state.cartItems && cookies.cartItems){
      
    //   cartItems.current = [...location.state.cartItems, ...cookies.cartItems];
    //   calculateTotalPrice();
    // }
    

    return () => {
      setCookie('cartItems', cartItems.current, { path: '/cart' });
    }
  }, []);

  return (
    <Container fluid>
        <Navbar />
      <h1>Cart</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <Row>
                <Col>Product</Col>
                <Col>Price</Col>
                <Col>Quantity</Col>
                <Col>Subtotal</Col>
                <Col></Col>
              </Row>
            </Card.Header>
            {cartItems.current.length > 0 && 
            <ListGroup variant="flush">
              {cartItems.current.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col>{item.name}</Col>
                    <Col>${item.price.toFixed(2)}</Col>
                    <Col className="d-flex flex-row">
                      <Button variant="outline-primary" onClick={() => handleQuantityChange(index, item.quantity - 1)}>-</Button>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                      />
                      <Button variant="outline-primary" onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</Button>
                    </Col>
                    <Col>${(item.quantity * item.price).toFixed(2)}</Col>
                    <Col>
                      <Button className="bg-transparent border-0" onClick={() => handleRemoveItem(index)}>                                
                        <IoMdClose color={'black'} size={24}/>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>}
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Summary</Card.Header>
            <Row className='ps-3 pe-3 mt-2'>
                <Col sm={9}>Product Detail</Col>
                <Col className="d-flex pe-3 justify-content-end" sm={3}>Quantity</Col>
            </Row>
            <ListGroup className='border border-0 mt-2'>
              {cartItems.current.map((item, index) => {
                return (
                  <ListGroup.Item key={index} style={{border: 'none', borderColor: 'transparent'}} className="d-flex flex-row">
                    <Col xs={10} className="d-flex flex-row">
                      <img src={item.image} height={'70px'} width={'50px'}/>
                      <p className='ms-3 me-3 me-lg-5 fw-medium'>{item.name}</p>
                    </Col>
                    <Col xs={2} className="d-flex pe-1 justify-content-end">
                      x{item.quantity}

                    </Col>
                  </ListGroup.Item>)
              })}
              
            </ListGroup>
            <ListGroup variant="flush" className="align-items-end">
              <ListGroup.Item>Total: ${totalPrice.toFixed(2)}</ListGroup.Item>
              {/* Add tax or other summary information here if needed */}
            </ListGroup>
            <Card.Footer className='d-flex justify-content-between align-items-center'>
              <Button variant="primary" onClick={() => handleAddOrder()}>Place Order</Button>

              <Nav.Link onClick={() => handleContinueShopping()}>Continue shopping</Nav.Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <OrderPlacingModal 
        show={showOrderPlacingModal} 
        onClose={handleCloseOrderPlacingModal} 
        onPlacingOrder={onPlacingOrder}
        orderId={orderId}
        />
    </Container>
  );
};

export default CartPage;
