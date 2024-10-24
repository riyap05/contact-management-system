import React, { useState } from 'react';

const MergeContacts = () => {
  const [mergeOption, setMergeOption] = useState('');
  const [specificValue, setSpecificValue] = useState('');

  const handleMerge = async () => {
    const token = localStorage.getItem('token');
    let apiEndpoint = '';

    if (mergeOption === 'mergeAllByName') {
      apiEndpoint = 'http://localhost:5000/api/contacts/merge/name';
    } else if (mergeOption === 'mergeAllByPhone') {
      apiEndpoint = 'http://localhost:5000/api/contacts/merge/phone';
    } else if (mergeOption === 'mergeAllByEmail') {
      apiEndpoint = 'http://localhost:5000/api/contacts/merge/email';
    } else if (mergeOption === 'mergeSpecificByName') {
      apiEndpoint = `http://localhost:5000/api/contacts/merge/name/${specificValue}`;
    } else if (mergeOption === 'mergeSpecificByPhone') {
      apiEndpoint = `http://localhost:5000/api/contacts/merge/phone/${specificValue}`;
    } else if (mergeOption === 'mergeSpecificByEmail') {
      apiEndpoint = `http://localhost:5000/api/contacts/merge/email/${specificValue.toLowerCase()}`;
    } else {
      alert('Please select a merge option.');
      return;
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      window.location.reload(); 
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <select
        value={mergeOption}
        onChange={(e) => setMergeOption(e.target.value)}
      >
        <option value="">Select Merge Option</option>
        <option value="mergeAllByName">Merge All by Name</option>
        <option value="mergeAllByPhone">Merge All by Phone</option>
        <option value="mergeAllByEmail">Merge All by Email</option>
        <option value="mergeSpecificByName">Merge Specific by Name</option>
        <option value="mergeSpecificByPhone">Merge Specific by Phone</option>
        <option value="mergeSpecificByEmail">Merge Specific by Email</option>
      </select>

      {mergeOption.includes('Specific') && (
        <input
          type="text"
          value={specificValue}
          onChange={(e) => setSpecificValue(e.target.value)}
          placeholder="Enter value"
        />
      )}

      <button onClick={handleMerge} className="merge-button">
        Merge Contacts
      </button>
    </div>
  );
};

export default MergeContacts;
