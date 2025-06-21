import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router components
import { AppContainer } from "./styles/AppStyles";
import ParticleContainer from "./components/ParticleContainer";
import Home from "./Home/home";
import Dashboard from "./Home/Dashboard"; // Adjust the path as needed
import Login from "./components/Login"
import Signup from './components/Signup'

const App = () => {
  return (
    <Router>
      <AppContainer>
        <ParticleContainer /> {/* This is now the background */}
        <Routes>
          <Route exact path="/" element={<Home />} /> {/* Home route */}
          <Route exact path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
          <Route exact path="/login" element={<Login />} /> {/* Login route */}
          <Route exact path="/signup" element={<Signup />} /> {/* Login route */}


        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
