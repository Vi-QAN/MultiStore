// Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Form, Container,  } from 'react-bootstrap';
import { login } from '../routes/authApi.js';
import { AuthenticationConsumer } from '../hooks/useAuthentication'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setLoggedIn, setUsername, setToken } = AuthenticationConsumer();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      // Handle successful login, redirect user or update UI
      if (result){
        localStorage.setItem('credential', JSON.stringify({token: result.token, username: result.username}));
        setLoggedIn(true);
        setUsername(result.username);
        setToken(result.token);
        navigate('/home')
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title className="text-center">Login</Card.Title>
          <Form validated onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </Form>
          <p className="mt-2">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
