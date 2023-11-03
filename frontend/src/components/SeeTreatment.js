import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useSelector } from 'react-redux';
import { useLocation } from "react-router-dom";

const ViewTreatments = (props) => {
  const location = useLocation();
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
      setError("An error occurred while fetching treatments.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>See Treatments</h1>

      <div className="mb-4">
        <DatePicker selected={date} onChange={setDate} maxDate={new Date()} />
      </div>

      {loading ? (
        <p>Loading treatments...</p>
      ) : error ? (
        <p>{error}</p>
      ) : treatments.length === 0 ? (
        <p>No treatments available.</p>
      ) : (
        <ul>
          {treatments.map((treatment) => (
            <li key={treatment.treatment_id}>
              Quantity: {treatment.quantity}, Treatment Code:{" "}
              {treatment.treatment_code}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewTreatments;
