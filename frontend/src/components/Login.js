import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants';
import { connect } from 'react-redux';
import { setDoctorId } from '../actions';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/validate_user`, { email, password });
      const data = response.data;

      if (data.valid) {
        navigate('/doctor_management');        
        let doctor_id = data.doctor_id
        setDoctorId(doctor_id);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during login. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="w-72">
        <h1 className="text-2xl font-bold mb-4">Login Page</h1>

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
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    doctorId: state.doctorId,
  };
};

const mapDispatchToProps = {
  setDoctorId,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
