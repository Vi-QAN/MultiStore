import React, {useEffect, useState} from 'react';
import { Container, Row, Col, Card, Button, Spinner,Pagination, Form } from 'react-bootstrap';

import { MdAddShoppingCart } from "react-icons/md";

import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductModal from  '../components/ProductModal';
import AddedToBasketToast from '../components/AddedToBasketToast';

import { getProducts } from '../routes/productApi';

import { SearchConsumer } from '../hooks/useSearch';
import { CartConsumer } from '../hooks/useCart';

const HomePage = () => {
  const { searchTerm, chosenCategories, priceRange, chosenSort, 
          products, setProducts, 
          totalPage, setTotalPage, 
          currentPage, setCurrentPage,
          pageSize } = SearchConsumer();
  const { cartItems } = CartConsumer();  

  const [ product, setProduct ] = useState(null);
  const [ showProductModal, setShowProductModal ] = useState(false);
  const [ addedProduct, setAddedProduct ] = useState(null)
  const [ showSuccessToast, setShowSuccessToast ] = useState(false);

  const categories = ['Category 1', 'Category 2', 'Category 3'];

  const handleHideProductMode = () => {
    setShowProductModal(false);
  }

  const handleViewProductDetails = (item) => {
    setProduct(item);
    setShowProductModal(true);
  }

  const handleQuantityChange = (index, quantity) => {
    if (quantity < 0) return;
    const updatedProducts = [...products];
    updatedProducts[index].quantity = quantity;
    setProducts(updatedProducts);
  };

  const handleAddToCart = (item) => {
    cartItems.current = [...cartItems.current, item];
    setAddedProduct(item);
    setShowSuccessToast(true);
  }

  const handleCloseToast = () => {
    setShowSuccessToast(false);
  }

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    const result = await getProducts(searchTerm, chosenCategories, priceRange, chosenSort, pageNumber, pageSize);
    setProducts(result.paginatedProducts.map(product => {return {...product, quantity: 1}}));
    setTotalPage(result.totalPage);
  }

  const loadData = async () => {
    const result = await getProducts(searchTerm, chosenCategories, priceRange, chosenSort, currentPage, pageSize);
    console.log(result);
    setProducts(result.paginatedProducts.map(product => {return {...product, quantity: 1}}));
    setTotalPage(result.totalPage);
  }

  useEffect(() => {
    loadData();
  },[])

  return (
    <Container fluid>
      <NavBar />
      <Container fluid className="d-flex row flex-lg-row flex-column p-0">
        <Container className='col-12 col-lg-3'>
          <Sidebar categories={categories} />
          {addedProduct && <AddedToBasketToast item={addedProduct} show={showSuccessToast} handleClose={handleCloseToast}/>}
        </Container>
        { products.length > 0 ? 
        <Container className='d-flex flex-column col-12 col-md-9'>
          <Row>
            {products.map((item, index) =>{ 
              return (
              <Col key={item.sku} md={6} lg={3} className=" mb-4 ">
                <Card className="shadow bg-body-tertiary rounded">
                  <Card.Img variant="top" style={{height: 400, objectFit: 'contain'}} src={item.image}/>
                  <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                    <Card.Title style={{height: 50, overflow: 'clip'}}>{item.name}</Card.Title>
                    <Card.Text style={{height: 100, maxHeight: 100, overflowY: 'clip'}}>
                      {item.description}
                    </Card.Text>
                    <Button variant="primary" className="mt-3 mb-3 align-self-center" onClick={() => handleViewProductDetails(item)}>View Details</Button>
                    <Container fluid className="d-flex flex-row p-0"> 
                      <Button variant="outline-primary" onClick={() => handleQuantityChange(index, item.quantity - 1)}>-</Button>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                      />
                      <Button variant="outline-primary" onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</Button>
                      <Button onClick={() => handleAddToCart(item)}><MdAddShoppingCart /></Button>
                    </Container>
                  </Card.Body>
                </Card>
              </Col>)}
            )}
          </Row>
          <Pagination className='align-self-center shadow rounded'>
            {currentPage - 1 > 0 && <Pagination.First onClick={() => handlePageChange(1)}/>}
            {currentPage - 1 > 0 && <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)}/>}
            {currentPage - 1 > 0 && <Pagination.Item disabled>{currentPage - 1}</Pagination.Item>}
            <Pagination.Item active>{currentPage}</Pagination.Item>
            {currentPage + 1 <= totalPage && <Pagination.Item disabled>{currentPage + 1}</Pagination.Item>}
            {currentPage + 1 <= totalPage && <Pagination.Next onClick={() => handlePageChange(currentPage + 1)}/>}
            {currentPage + 1 <= totalPage && <Pagination.Last onClick={() => handlePageChange(totalPage)}/>}
          </Pagination>
        </Container> :  
        <Container className='col-12 col-md-9'>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
        }
      </Container>
      {product && <ProductModal show={showProductModal} onHide={handleHideProductMode} product={product} />}
    </Container>
  );
};

export default HomePage;
