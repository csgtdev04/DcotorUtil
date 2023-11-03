import React, { useState, useEffect } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../constants";

const Admin = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctors`);
        setDoctors(response.data);
      } catch (error) {
        setError("Error fetching doctors. Please try again later.");
        console.error(error);
      }
    };

    fetchDoctors();
  }, []);

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`${BASE_URL}/doctors/${doctorId}`);
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
    } catch (error) {
      setError("Error deleting doctor. Please try again later.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Doctor List</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors
            .filter((doctor) => doctor.name !== "admin") // Exclude the row with name "admin"
            .map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Admin;
