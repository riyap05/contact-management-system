const Contact = require('../models/Contact');

// Function to save parsed contacts from VCF to MongoDB
const addContacts = async (contacts) => {
    try {
        const savedContacts = [];
        for (const contact of contacts) {
            const newContact = new Contact({
                name: contact.fn || 'Unknown',
                phone: contact.tel || 'N/A',
                email: contact.email || 'N/A',
            });
            const savedContact = await newContact.save();
            savedContacts.push(savedContact);
        }
        return savedContacts;
    } catch (error) {
        console.error('Error saving contacts:', error);
        throw error;
    }
};

// Function to get all contacts from MongoDB
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user._id }); // Filter by user ID
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
};

//create contact
const createContact = async (req, res) => {
    const { name, email, phone, tags } = req.body;

    try {
        const contact = new Contact({
            user: req.user._id,
            name,
            email,
            phone,
            tags,
        });

        await contact.save();
        res.status(201).json({ message: 'Contact created successfully', data: contact });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Error creating contact', error });
    }
};




//update an existing contact
const updateContact = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id);
        if (contact && contact.user.toString() === req.user._id.toString()) {
            contact.name = req.body.name || contact.name;
            contact.email = req.body.email || contact.email;
            contact.phone = req.body.phone || contact.phone;
            contact.tags = req.body.tags || contact.tags;

            const updatedContact = await contact.save();
            res.json(updatedContact);
        } else {
            res.status(404).json({ message: 'Contact not found or not authorized' });
        }
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Error updating contact', error });
    }
};

// Function to delete a contact
const deleteContact = async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await Contact.findOneAndDelete({ _id: id, user: req.user._id });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found or not authorized' });
        }

        res.json({ message: 'Contact removed successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Error deleting contact', error });
    }
};


// Search Contacts Function
const searchContacts = async (req, res) => {
    try {
        const { query, tag } = req.body; 

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        const filterCriteria = {
            user: req.user._id, 
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } },
            ]
        };

        if (tag) {
            filterCriteria.tags = { $regex: tag, $options: 'i' }; 
        }

        console.log('Filter Criteria:', filterCriteria); 

        const results = await Contact.find(filterCriteria);
        console.log('Search Results:', results); 
        res.status(200).json(results);
    } catch (error) {
        console.error('Error searching contacts:', error);
        res.status(500).json({ message: 'Error searching contacts', error });
    }
};

const filterContacts = async (userId, tags) => {
    // Check if tags is provided and is an array
    console.log('User ID:', userId);
    console.log('Tags:', tags);

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
        throw new Error('Tags are required and should be an array');
    }

    // Create the filter criteria
    const filterCriteria = {
        user: userId,  // Ensure we only search for contacts belonging to the user
        tags: { $in: tags }  // Match any of the tags provided
    };

    console.log('Filter Criteria:', filterCriteria); // Log the filter criteria

    // Fetch the contacts that match the criteria
    const contacts = await Contact.find(filterCriteria);
    console.log('Fetched Contacts:', contacts); // Log fetched contacts
    return contacts;
};



module.exports = {
    getContacts,
    addContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    filterContacts,
};
