import React, { useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const OrderPlacingModal = ({ show, onClose, onPlacingOrder, orderId }) => {

  useEffect(() => {

  },[orderId, onPlacingOrder])
  return (
    <Modal show={show} onHide={onClose}>
      {!onPlacingOrder && <Modal.Header closeButton>
        <Modal.Title>Order Placed Successfully</Modal.Title>
      </Modal.Header>}
      {!onPlacingOrder && 
      <Modal.Body>
        Your order has been placed successfully. Your order number is {orderId}.
        
      </Modal.Body>}
      {onPlacingOrder && <Spinner animation="border" />}
    </Modal>
  );
};

export default OrderPlacingModal;
