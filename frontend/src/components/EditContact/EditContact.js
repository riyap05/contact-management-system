import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditContact.css';

const EditContact = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    tags: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Fetched contact data:', data); 
      if (response.ok) {
        setContact({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          tags: data.tags.join(', ') || '', 
        });
      } else {
        alert(data.message);
      }
    };

    fetchContact();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        tags: contact.tags.split(',').map(tag => tag.trim()), 
      }),
    });

    if (response.ok) {
      alert('Contact updated successfully!');
      navigate('/'); 
    } else {
      const data = await response.json();
      alert(data.message);
    }
  };

  return (
    <div className="edit-contact-container">
      <h1>Edit Contact</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={contact.name} 
          onChange={handleChange}
          placeholder="Name (Leave blank to keep unchanged)"
        />
        <input
          type="email"
          name="email"
          value={contact.email} 
          onChange={handleChange}
          placeholder="Email (Leave blank to keep unchanged)"
        />
        <input
          type="text"
          name="phone"
          value={contact.phone} 
          onChange={handleChange}
          placeholder="Phone (Leave blank to keep unchanged)"
        />
        <input
          type="text"
          name="tags"
          value={contact.tags} 
          onChange={handleChange}
          placeholder="Tags (comma separated, Leave blank to keep unchanged)"
        />
        <button type="submit">Update Contact</button>
      </form>
    </div>
  );
};

export default EditContact;
