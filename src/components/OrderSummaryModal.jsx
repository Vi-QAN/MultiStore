import React, { useState } from 'react';
import { Modal, Row, Col, ListGroup} from 'react-bootstrap';

const convertDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
};
const OrderSummaryModal = ({order, show, onHide }) => {

  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
        <Modal.Title>Order #{order.orderNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {/* Render product names and quantities */}
        <Row className='ps-3 pe-3 mt-2'>
          <Col sm={9}>Product Detail</Col>
          <Col className="d-flex pe-3 justify-content-end" sm={3}>Quantity</Col>
        </Row>
          <ListGroup className='border border-0 mt-2'>
            {order.products.map(item => {
              return (
                <ListGroup.Item style={{border: 'none', borderColor: 'transparent'}} className="d-flex flex-row">
                  <Col xs={10} className="d-flex flex-row">
                    <img src={item.imageUrl} height={'70px'} width={'50px'}/>
                    <p className='ms-3 me-3 me-lg-5 fw-medium'>{item.productName}</p>
                  </Col>
                  <Col xs={2} className="d-flex pe-1 justify-content-end">
                    x{item.quantity}

                  </Col>
                </ListGroup.Item>)
            })}
            
          </ListGroup>
          <ListGroup variant="flush" className="align-items-end">
            <ListGroup.Item>Total: ${order.total.toFixed(2)}</ListGroup.Item>
            
              
            {/* Add tax or other summary information here if needed */}
          </ListGroup>
          <ListGroup>
          <ListGroup.Item className="d-flex flex-row justify-content-between">
            <Col>Status:</Col> 
            <Col>{order.status}</Col>
            </ListGroup.Item>
            {order.deliveredAt && <ListGroup.Item className="d-flex flex-row justify-content-between">
              <Col>Delivery Date:</Col> 
              <Col>{convertDate(order.deliveredAt)}</Col>
              
            </ListGroup.Item>}
            {order.cancelledAt && <ListGroup.Item className="d-flex flex-row justify-content-between">
              <Col sm={6}>Cancellation Date:</Col> 
              <Col className="justify-content-end" sm={6}>{convertDate(order.cancelledAt)}</Col>
            </ListGroup.Item>}
          </ListGroup>
        </Modal.Body>
    </Modal>
  );
};

export default OrderSummaryModal;
