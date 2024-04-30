import React from 'react';
import { Modal } from 'react-bootstrap';

const ProductModal = ({ show, onHide, product }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex flex-column'>
        <img className="mb-3 align-self-center" src={product.image} alt={product.name} height="500px" width="50%"/>
        <p><span className="fw-medium">Description:</span> {product.description}</p>
        <p><span className="fw-medium">Manufacturer:</span> {product.manufacturer}</p>
        <p><span className="fw-medium">Model:</span> {product.model}</p>
        <p><span className="fw-medium">Price:</span> ${product.price}</p>
        <p><span className="fw-medium">Shipping:</span> ${product.shipping}</p>
        <p><span className="fw-medium">Type:</span> {product.type}</p>
        <p><span className="fw-medium">UPC:</span> {product.upc}</p>
        <p><span className="fw-medium">URL:</span> <a href={product.url} target="_blank" rel="noreferrer">{product.url}</a></p>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
