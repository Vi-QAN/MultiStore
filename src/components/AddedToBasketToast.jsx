import React from 'react';
import { Toast } from 'react-bootstrap';

function AddedToBasketToast({show, item, handleClose}) {
  const getTime = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  };
  return (
    <Toast className="mt-3" show={show} onClose={() => handleClose()} delay={3000} autohide>
        <Toast.Header>
        <span
            className="rounded me-2 bg-success p-1"
            alt="">
        </span>
        <strong className="me-auto">Success</strong>
        <small>{getTime()}</small>
        </Toast.Header>
        <Toast.Body><span>{item.name}</span> has been successfully added to basket!</Toast.Body>
    </Toast>
     
  );
}

export default AddedToBasketToast;