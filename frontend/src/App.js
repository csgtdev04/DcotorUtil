import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Signup from './components/Signup'
import AddTreatments from './components/AddTreatment'
import ViewTreatments from './components/SeeTreatment'
import DoctorManagement from './components/DoctorManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/login" element={<Login/>} />
        <Route exact path="/doctor_management" element={<DoctorManagement />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/add_treatment" element={<AddTreatments />} />
        <Route exact path="/see_treatments" element={<ViewTreatments />} />
      </Routes> 
    </Router>
  );
}

export default App;

