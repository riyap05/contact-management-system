const express = require('express');
const router = express.Router();
const multer = require('multer');
const vcardParser = require('vcard-parser'); // vCard parsing library
const vCard = require('vcf'); // vCard library to generate VCF files
const protect = require('../middlewares/authMiddleware');
const Contact = require('../models/Contact');
const {
    addContacts,
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    filterContacts,
} = require('../controllers/contactController');
const { importContacts , exportContacts} = require('../controllers/import_exportController');
const { mergeSpecificEmail, mergePhone, mergeName, mergeEmail,mergeSpecificPhone,mergeSpecificName } = require('../controllers/mergeController');
const { toggleFavorite } = require('../controllers/favController');


// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store the file in memory temporarily
const upload = multer({ storage });

// GET /api/contacts - Get all user contacts (Protected)
router.get('/', protect, getContacts);

// POST /api/contacts - Create a new contact (Protected)
router.post('/', protect, createContact);

// PUT /api/contacts/:id - Update contact (Protected)
router.put('/:id', protect, updateContact);

// DELETE /api/contacts/:id - Delete contact (Protected)
router.delete('/:id', protect, deleteContact);

// Route to search contacts (Protected)
router.post('/search', protect, searchContacts);

router.post('/filter', protect, async (req, res) => {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { tags } = req.body; // Expecting { tags: ['tag1', 'tag2'] }
    try {
        const contacts = await filterContacts(req.user._id, tags);
        res.json(contacts);
    } catch (error) {
        console.error('Error filtering contacts:', error);
        res.status(500).json({ message: 'Error filtering contacts', error: error.message });
    }
});


// Route to upload a VCF file
router.post('/import', upload.single('file'), protect, importContacts)


// Route to export contacts as VCF
router.get('/export', protect, exportContacts); 


// Merging contacts by name
router.post('/merge/name', protect, mergeName);


// Merging contacts by phone
router.post('/merge/phone', protect, mergePhone);


// Merging contacts by email
router.post('/merge/email', protect, mergeEmail);

// Merging contacts by specific name
router.post('/merge/name/:name', protect, mergeSpecificName);

// Merging contacts by specific phone number
router.post('/merge/phone/:phone', protect, mergeSpecificPhone);

// Merging contacts by specific email
router.post('/merge/email/:email', protect, mergeSpecificEmail);

router.patch('/contacts/:contactId/favorite', toggleFavorite);

module.exports = router;
