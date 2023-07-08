import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const DoctorManagement = () => {
  const navigate = useNavigate();

  const handleSeeTreatments = () => {
    navigate("/see_treatments");
  };

  const handleAddTreatments = () => {
    navigate("/add_treatment");
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="w-72">
        <h1 className="text-2xl font-bold mb-4">Doctor Management</h1>
        <div className="flex items-center space-x-4">
          <Button variant="primary" onClick={handleSeeTreatments}>
            See Treatments
          </Button>
          <Button variant="success" onClick={handleAddTreatments}>
            Add Treatments
          </Button>
        </div>
      </div>
    </div>
  );  
};

export default DoctorManagement;
