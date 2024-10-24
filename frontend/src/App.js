import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home'; 
import CreateContact from './components/CreateContact/CreateContact'
import EditContact from './components/EditContact/EditContact';

const App = () => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the token exists

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Register />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/create-contact" element={<CreateContact />} />
        <Route path="/edit/:id" element={<EditContact />} /> {/* Ensure this route is defined */}
      </Routes>
    </Router>
  );
};

export default App;
