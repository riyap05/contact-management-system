

import React from 'react';

const ExportContacts = () => {
  const handleExport = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/contacts/export', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.vcf'; 
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  return (
    <button onClick={handleExport} className="export-button">
      Export Contacts
    </button>
  );
};

export default ExportContacts;
