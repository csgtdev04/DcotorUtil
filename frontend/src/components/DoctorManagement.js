import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Button, Card, ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../constants";
import axios from "axios";

const DoctorManagement = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctorId = location.state?.doctorId;
  const [previousTreatments, setPreviousTreatments] = useState([]);
  const filteredTreatments = previousTreatments.filter(
    (treatment) => treatment.treatment_code
  );

  useEffect(() => {
    const fetchPreviousTreatments = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/get_doc_treatments`,
          {
            doctor_id: doctorId,
          },
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          }
        );

        setPreviousTreatments(response.data.treatments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPreviousTreatments();
  }, [doctorId, props.token]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSeeTreatments = () => {
    navigate("/see_treatments", { state: { doctorId } });
  };

  const handleAddTreatments = () => {
    navigate("/add_treatment", { state: { doctorId } });
  };

  return (
    <div className="container mt-5">
      <Button variant="danger" className="position-absolute top-0 start-0 m-3" onClick={handleLogout}>
        Logout
      </Button>
      <Row>
        <Col md={8}>
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <h1 className="text-2xl font-bold mb-4">Doctor Management</h1>
            <div className="d-flex justify-content-start mb-3">
              <Button
                variant="primary"
                className="mr-3"
                onClick={handleSeeTreatments}
              >
                See Treatments
              </Button>
              <Button variant="success" onClick={handleAddTreatments}>
                Add Treatments
              </Button>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header as="h3">Previous Treatments</Card.Header>
            <ListGroup variant="flush">
              {filteredTreatments.map((treatment) => (
                <ListGroup.Item key={treatment.treatment_id}>
                  {treatment.treatment_code}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorManagement;
