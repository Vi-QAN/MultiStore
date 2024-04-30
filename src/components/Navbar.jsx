import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import { SearchConsumer } from '../hooks/useSearch';
import { CartConsumer } from '../hooks/useCart';
import { AuthenticationConsumer } from '../hooks/useAuthentication'

import { getProducts } from '../routes/productApi';

const NavBar = () => {
  const {loggedIn, setLoggedIn, username, setUsername} = AuthenticationConsumer(); // Assuming user is initially not logged in
  const { searchTerm, chosenCategories, priceRange, chosenSort, handleSearchTermChange, setProducts, setCurrentPage, pageSize, setTotalPage} = SearchConsumer();
  const { cartItems} = CartConsumer();
  const navigate = useNavigate();


  const handleLogout = () => {
    // Implement logout logic here
    setLoggedIn(false);
    setUsername('');
    localStorage.removeItem('credential')
    navigate('/home');
  };

  const handleSearch = async () => {
    const result = await getProducts(searchTerm, chosenCategories, priceRange, chosenSort, 1, pageSize);
    setCurrentPage(1);
    setProducts(result.paginatedProducts);
    setTotalPage(result.totalPage);
  }

  useEffect(() => {

  },[cartItems.current])

  return (
    <Navbar bg="light" expand="lg" className="d-flex justify-content-between">
      <Navbar.Brand onClick={() => navigate('/home')} className="col-3">MultiStores</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Form inline className="d-flex mr-auto col-12 col-md-6 flex-column flex-lg-row">
          <FormControl type="text" placeholder="Search item" className="mr-sm-2" onChange={(e) => handleSearchTermChange(e.target.value)}/>
          <Button variant="outline-success" onClick={() => handleSearch()}>Search</Button>
        </Form>
        <Nav className="ml-auto col-12 col-md-6 justify-content-end">
          <>
            <Nav.Link onClick={() => navigate('/about', {state: {cartItems: cartItems.current}})}>About</Nav.Link>
          </>
          {loggedIn ? (
            <>
              <Nav.Link onClick={() => navigate('/orders', {state: {cartItems: cartItems.current}})}>Orders</Nav.Link>
              <Nav.Link onClick={() => navigate('/cart', {state: {cartItems: cartItems.current}})}>Cart</Nav.Link>
              <Nav.Link href="#">{username}</Nav.Link>
              <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
