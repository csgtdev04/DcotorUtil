import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import AddTreatments from "./components/AddTreatment";
import ViewTreatments from "./components/SeeTreatment";
import DoctorManagement from "./components/DoctorManagement";
import Admin from "./components/Admin";
import useToken from "./useToken";

function App() {
  const { token, setToken } = useToken();

  return (
    <Router>
      <div className="App">
        {!token && token !== "" && token !== undefined ? (
          <>
            <Login setToken={setToken} />
          </>
        ) : (
          <>
            <Routes>
              <>
                <Route exact path="/" element={<Login />} />
                <Route
                  exact
                  path="/Login"
                  element={<Login setToken={setToken} />}
                />
                <Route exact path="/signup" element={<Signup />} />
                <Route
                  exact
                  path="/doctor_management"
                  element={<DoctorManagement token={token} />}
                />
                <Route
                  exact
                  path="/add_treatment"
                  element={<AddTreatments token={token} setToken={setToken} />}
                />
                <Route
                  exact
                  path="/see_treatments"
                  element={<ViewTreatments token={token} setToken={setToken} />}
                />
                <Route
                  exact
                  path="/admin"
                  element={<Admin />}
                />
              </>
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
