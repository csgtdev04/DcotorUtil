import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../ViewTreatment.css";

const ViewTreatments = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctorId = location.state?.doctorId;
  // const doctorId = useSelector((state) => state.doctor.doctorId);

  const [date, setDate] = useState(new Date());
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchTreatments();
  }, [date]);

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Doctor id in get treatments: " + doctorId);
      const response = await axios.post(`${BASE_URL}/get_treatments`, {
        date: date.toISOString(),
        doctor_id: doctorId,
      }, {
        headers: {
          Authorization: `Bearer ${props.token}`
        },
      });

      // console.log(response.data.treatments[0]);
      setTreatments(response.data.treatments);
      setLoading(false);
    } catch (error) {
      setError("You need to relogin!");
      setLoading(false);
    }
  };

  return (
    <div className="view-treatments-container">
      <Button
        variant="primary"
        className="float-right mb-1"
        onClick={() => navigate("/add_treatment", { state: { doctorId } })}
      >
        Add Treatments
      </Button>
      <h1 className="page-heading">See Treatments</h1>
      <div className="clearfix"></div>
      <Button
        variant="primary"
        className="float-right mb-1"
        onClick={() => navigate("/doctor_management", { state: { doctorId } })}
      >
        Home
      </Button>

      <div className="date-picker-container">
        <DatePicker selected={date} onChange={setDate} maxDate={new Date()} />
      </div>

      {loading ? (
        <p>Loading treatments...</p>
      ) : error ? (
        <p className="loading-error-message">{error}</p>
      ) : treatments.length === 0 ? (
        <p>No treatments available.</p>
      ) : (
        <table className="treatments-table">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Treatment Code</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr key={treatment.treatment_id}>
                <td>{treatment.quantity}</td>
                <td>{treatment.treatment_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewTreatments;
