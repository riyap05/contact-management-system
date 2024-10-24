

import React from 'react';

const ImportContacts = () => {
  const importContacts = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/contacts/import', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert('Contacts imported successfully!');
      // Optionally, refresh the contacts list
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importContacts(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".vcf"
        id="import-file"
        style={{ display: 'none' }} // Hide the default file input
        onChange={handleFileChange} // Triggered when a file is selected
      />
      <button
        onClick={() => document.getElementById('import-file').click()} // Trigger the file input click
        className="import-button" // Apply button styles
      >
        Import Contacts
      </button>
    </div>
  );
};

export default ImportContacts;
