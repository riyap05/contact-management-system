const Contact = require('../models/Contact');
const mergeName = async (req, res) => {
    try {
        const duplicates = await Contact.aggregate([
            { $match: { user: req.user._id } }, 
            { $group: {
                _id: "$name",
                count: { $sum: 1 },
                contacts: { $push: "$$ROOT" }
            }},
            { $match: { count: { $gt: 1 } } } 
        ]);

        if (duplicates.length === 0) {
            return res.json({ message: 'No duplicate contacts found by name.' });
        }

        await mergeContacts(duplicates);
        res.json({ message: 'Contacts merged successfully by name.' });
    } catch (error) {
        console.error('Error merging contacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const mergePhone = async (req, res) => {
    try {
        
        const contacts = await Contact.find({ user: req.user._id });

       
        const contactMap = {};
        contacts.forEach(contact => {
            const phone = contact.phone; 
            if (!contactMap[phone]) {
                contactMap[phone] = []; 
            }
            contactMap[phone].push(contact);
        });

        const duplicates = Object.values(contactMap).filter(group => group.length > 1);

        if (duplicates.length === 0) {
            return res.json({ message: 'No duplicate contacts found by phone.' });
        }

        await mergeContacts(duplicates);
        res.json({ message: 'Contacts merged successfully by phone.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const mergeEmail = async (req, res) => {
    try {
        
        const contacts = await Contact.find({ user: req.user._id });
        console.log(`Found ${contacts.length} contacts for user ${req.user._id}`);

        const contactMap = {};
        contacts.forEach(contact => {
            if (contact.email) { 
                const email = contact.email.toLowerCase(); 
                if (!contactMap[email]) {
                    contactMap[email] = []; 
                }
                contactMap[email].push(contact);
            }
        });

        const duplicates = Object.values(contactMap).filter(group => group.length > 1);
        console.log(`Found ${duplicates.length} duplicate groups by email.`);

        if (duplicates.length === 0) {
            return res.json({ message: 'No duplicate contacts found by email.' });
        }

        await mergeContacts(duplicates);
        res.json({ message: 'Contacts merged successfully by email.' });
    } catch (error) {
        console.error('Error merging contacts by email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const mergeContacts = async (duplicates) => {
    for (const group of duplicates) {
       
        const contacts = group.contacts || group; 

        if (!Array.isArray(contacts) || contacts.length < 2) {
            console.log('No contacts to merge.');
            continue; 
        }

        const baseContact = contacts[0]; 
        const duplicateIds = contacts.slice(1).map(contact => contact._id); 

        console.log(`Merging contacts: ${baseContact.email}`);
        console.log(`Deleting duplicates with IDs: ${duplicateIds.join(', ')}`);

        await Contact.deleteMany({ _id: { $in: duplicateIds } });
    }
};



// Merging contacts by specific name
const mergeSpecificName = async (req, res) => {
    const { name } = req.params; 
    try {
        const contacts = await Contact.find({ user: req.user._id, name: name });

        
        if (contacts.length < 2) {
            return res.json({ message: 'No duplicate contacts found with that name.' });
        }

        
        await mergeContacts([contacts]); 
        res.json({ message: 'Contacts merged successfully by name.' });
    } catch (error) {
        console.error('Error merging contacts by name:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Merging contacts by specific phone number
const mergeSpecificPhone = async (req, res) => {
    const { phone } = req.params; 
    try {
        const contacts = await Contact.find({ user: req.user._id, phone: phone });

        
        if (contacts.length < 2) {
            return res.json({ message: 'No duplicate contacts found with that phone number.' });
        }

        
        await mergeContacts([contacts]); 
        res.json({ message: 'Contacts merged successfully by phone number.' });
    } catch (error) {
        console.error('Error merging contacts by phone number:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const mergeSpecificEmail = async (req, res) => {
    const { email } = req.params; 
    try {
        const contacts = await Contact.find({ user: req.user._id, email: email.toLowerCase() }); 

      
        if (contacts.length < 2) {
            return res.json({ message: 'No duplicate contacts found with that email.' });
        }

       
        await mergeContacts([contacts]); 
        res.json({ message: 'Contacts merged successfully by email.' });
    } catch (error) {
        console.error('Error merging contacts by email:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    mergeEmail,
    mergeName,
    mergePhone,
    mergeSpecificEmail,
    mergeSpecificName,
    mergeSpecificPhone,
};
