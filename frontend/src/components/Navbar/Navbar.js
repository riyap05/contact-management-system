// src/components/Navbar/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImportContacts from '../ImportContacts/ImportContacts'; 
import ExportContacts from '../ExportContacts/ExportContacts'; 
import MergeContacts from '../MergeContact/MergeContact'; 
import './Navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    window.location.reload(); // Refresh the page
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="navbar">
      <div className="navbar-buttons">
        <ImportContacts />
        <ExportContacts />
        <MergeContacts />
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </div>
    </div>
  );
};

export default Navbar;
