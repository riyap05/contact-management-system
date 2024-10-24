

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Contacts.css'; 
const Contacts = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/contacts', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, 
                    },
                });
                setContacts(response.data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/contacts/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, 
                },
            });
            setContacts(contacts.filter((contact) => contact._id !== id)); 
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <div className="contacts-container">
            <h2>Contact List</h2>
            {contacts.map((contact) => (
                <div key={contact._id} className="contact-card">
                    <div className="contact-info">
                        <span>{contact.name}</span>
                        <span>{contact.email}</span>
                        <span>{contact.phone}</span>
                    </div>
                    <div className="contact-actions">
                        <button onClick={() => handleDelete(contact._id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Contacts;
