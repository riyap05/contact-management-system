

import React from 'react';
import './ContactCard.css'; 

const ContactCard = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="contact-card">
      <div className="contact-info">
        <h2>{contact.name}</h2>
        <p>{contact.email}</p>
        <p>{contact.phone}</p>

        <div className="contact-tags">
          {contact.tags && contact.tags.length > 0 ? (
            <ul>
              {contact.tags.map((tag, index) => (
                <li key={index} className="tag-item">{tag}</li>
              ))}
            </ul>
          ) : (
            <p>No tags available</p>
          )}
        </div>
      </div>
      <div className="card-actions">
        <button onClick={() => onEdit(contact._id)}>Edit</button>
        <button onClick={() => onDelete(contact._id)}>Delete</button>
      </div>
    </div>
  );
};

export default ContactCard;
