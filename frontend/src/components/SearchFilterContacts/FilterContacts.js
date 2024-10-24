

import React, { useState } from 'react';

const FilterContacts = ({ onFilterResults }) => {
  const [tags, setTags] = useState('');

  const handleFilter = async (e) => {
    e.preventDefault(); 

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/contacts/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tags: tags.split(',').map(tag => tag.trim()) }), // Send tags as an array
    });

    if (response.ok) {
      const results = await response.json();
      onFilterResults(results); 
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleFilter}>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Filter by tags (comma-separated)"
      />
      <button type="submit">Filter</button>
    </form>
  );
};

export default FilterContacts;
