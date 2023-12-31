import React, { useState, useEffect } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL_AWS } from "../constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import "../style/AddTreatment.css";

const AddTreatment = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctorId = location.state?.doctorId;
  // const doctorId = useSelector((state) => state.doctor.doctorId);

  const [docTreatments, setDocTreatments] = useState([]);
  const [treatmentRecords, setTreatmentRecords] = useState([
    { code: "", quantity: "" },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  useEffect(() => {
    fetchTreatments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL_AWS}/get_doc_treatments`,
        {
          doctor_id: doctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );

      setDocTreatments(response.data.treatments);
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
      await axios.post(
        `${BASE_URL_AWS}/save_treatments`,
        {
          doctor_id: doctorId,
          treatments: newTreatments,
          date: selectedDate.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      navigate("/see_treatments", { state: { doctorId } });
    } catch (error) {
      console.error(error);
    }
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
    <div className="add-treatment-container">
      <Button
        variant="primary"
        className="float-right"
        onClick={() => navigate("/see_treatments", { state: { doctorId } })}
      >
        See Treatments
      </Button>
      <h1 className="add-treatment-title">Add Treatments</h1>
      <div className="clearfix"></div>
      <Button
        variant="primary"
        className="float-right mb-1"
        onClick={() => navigate("/doctor_management", { state: { doctorId } })}
      >
        Home
      </Button>


      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          maxDate={new Date()}
        />
      </div>

      <Form onSubmit={handleSaveTreatment}>
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
                    <Select
                      options={docTreatments.map((favorite) => ({
                        label: `${favorite.treatment_code}`,
                        value: favorite.treatment_code,
                      }))}
                      value={docTreatments.find(
                        (favorite) => favorite.treatment_code === record.code
                      )}
                      onChange={(selectedOption) =>
                        handleCodeChange(index, selectedOption.value)
                      }
                      isSearchable
                    />
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
