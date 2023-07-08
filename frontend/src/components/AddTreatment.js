import React, { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddTreatment = () => {
  const navigate = useNavigate();
  const [favoriteTreatments, setFavoriteTreatments] = useState([]);
  const [treatmentRecords, setTreatmentRecords] = useState([
    { code: "", quantity: "" },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const doctorId = 1; // TODO - change this one

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/get_favorites`, {
        doctor_id: doctorId,
      });
      setFavoriteTreatments(response.data.favorites);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveTreatment = async (e) => {
    e.preventDefault();

    const newTreatments = treatmentRecords.map((record) => ({
      treatment_code: record.code,
      quantity: record.quantity,
    }));

    try {
      await axios.post(`${BASE_URL}/save_treatments`, {
        doctor_id: doctorId,
        treatments: newTreatments,
        date: selectedDate.toISOString(),
      });
    } catch (error) {
      console.error(error);
    }
    navigate("/see_treatments");
  };

  const handleAddRow = () => {
    setTreatmentRecords((prevRecords) => [
      ...prevRecords,
      { code: "", quantity: "" },
    ]);
  };

  const handleCodeChange = (index, code) => {
    setTreatmentRecords((prevRecords) =>
      prevRecords.map((record, i) =>
        i === index ? { ...record, code } : record
      )
    );
  };

  const handleQuantityChange = (index, quantity) => {
    setTreatmentRecords((prevRecords) =>
      prevRecords.map((record, i) =>
        i === index ? { ...record, quantity } : record
      )
    );
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Add your Treatments</h1>
      <Form onSubmit={handleSaveTreatment}>
        <Form.Group controlId="date">
          <Form.Label>Select a date below</Form.Label>
          <br />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            maxDate={new Date()}
          />
        </Form.Group>
        <div className="pt-6">
          <Table bordered style={{ marginBottom: "1rem" }}>
            <thead>
              <tr>
                <th>Treatment Code</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {treatmentRecords.map((record, index) => (
                <tr key={index}>
                  <td>
                    <Form.Control
                      as="select"
                      value={record.code}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                    >
                      <option value="">
                        Select a favorite treatment code or enter below
                      </option>
                      {favoriteTreatments.map((favorite) => (
                        <option
                          key={favorite.treatment_id}
                          value={favorite.treatment_code}
                        >
                          {favorite.treatment_code} - {favorite.description}
                        </option>
                      ))}
                    </Form.Control>
                    <br />
                    <Form.Control
                      type="text"
                      value={record.code}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      placeholder="Enter a treatment code"
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={record.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Button
          variant="primary"
          onClick={handleAddRow}
          style={{ marginRight: "1rem" }}
        >
          Add Row
        </Button>
        <Button variant="primary" type="submit">
          Save Treatment
        </Button>
      </Form>
    </div>
  );
};

export default AddTreatment;
