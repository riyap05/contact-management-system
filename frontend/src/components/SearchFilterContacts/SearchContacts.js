
import React, { useState } from 'react';

const SearchContacts = ({ onSearchResults, contacts = [] }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault(); 

    if (query.trim() === '') {
      onSearchResults(contacts); 
      return;
    }

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/contacts/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }), 
    });

    if (response.ok) {
      const results = await response.json();
      onSearchResults(results); 
    } else {
      const data = await response.json();
      alert(data.message); 
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search contacts"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchContacts;
