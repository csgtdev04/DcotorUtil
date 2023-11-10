import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL_AWS } from '../constants';
import '../style/Login.css';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL_AWS}/validate_user`, { email, password });
      const data = response.data;
      // console.log("user data: " + data.doctor_id)
      if (data.valid) {
        if (email === 'admin@gmail.com' && password === 'admin') {
          navigate('/admin', { state: { doctorId: data.doctor_id } });
        } else {
          navigate('/doctor_management', { state: { doctorId: data.doctor_id } });
        }

        props.setToken(data.access_token)
        // dispatch(setDoctorId(data.doctor_id));
      } else {
        setError('Invalid email or password. Please try again.');
        navigate("/signup")        
      }
    } catch (error) {
      setError('An error occurred during login. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Doctor Management</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4">
            Login
          </Button>

          <p className="mt-2">
            Don't have an account? <br></br><Link to="/signup">Sign up here</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
