
import React, { useState } from 'react';
import './CreateContact.css';

const CreateContact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagArray = tags.split(',').map(tag => tag.trim()); 

        const contactData = {
            name,
            email,
            phone,
            tags: tagArray,
        };

        try {
            const response = await fetch('http://localhost:5000/api/contacts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Contact created successfully!');
                setName('');
                setEmail('');
                setPhone('');
                setTags('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error creating contact:', error);
        }
    };

    return (
        <div className="create-contact">
            <h2>Create Contact</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <button type="submit">Create Contact</button>
            </form>
        </div>
    );
};

export default CreateContact;
