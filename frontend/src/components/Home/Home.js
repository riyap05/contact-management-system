

import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import SearchContacts from '../SearchFilterContacts/SearchContacts';
import FilterContacts from '../SearchFilterContacts/FilterContacts';

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const navigate = useNavigate();

  // Fetch contacts from the backend
  const fetchContacts = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    const response = await fetch('http://localhost:5000/api/contacts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setContacts(data);
      setFilteredContacts(data);
    } else if (response.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [navigate]);

  const handleEdit = (contactId) => {
    navigate(`/edit/${contactId}`);
  };

  const handleDelete = async (contactId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5000/api/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setContacts(contacts.filter(contact => contact._id !== contactId));
      setFilteredContacts(filteredContacts.filter(contact => contact._id !== contactId));
    }
  };

  const handleSearchResults = (results) => {
    setFilteredContacts(results);
  };

  const handleFilterResults = (results) => {
    setFilteredContacts(results);
  };

  return (
    <div className="home-container">
      <Navbar />

      <div className="search-filter-container">
        <SearchContacts onSearchResults={handleSearchResults} />
        <FilterContacts onFilterResults={handleFilterResults} />
      </div>

      <Link to="/create-contact">
        <button className="create-button">Create Contact</button>
      </Link>

      <h1>Your Contacts</h1>

      <div className="contact-list">
        {filteredContacts.map(contact => (
          <div key={contact._id} className="contact-card">
            <div className="contact-info">
              <h2>{contact.name}</h2>
              <p>{contact.email}</p>
              <p>{contact.phone}</p>
            </div>
            <div className="card-actions">
              <button onClick={() => handleEdit(contact._id)}>Edit</button>
              <button onClick={() => handleDelete(contact._id)}>Delete</button>
            </div>
            {/* Conditionally display tags only if they exist and are not empty */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="contact-tags">
                <p>Tags: {contact.tags.join(', ')}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
