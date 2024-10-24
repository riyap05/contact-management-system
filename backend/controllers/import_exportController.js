const Contact = require('../models/Contact');
const vcardParser = require('vcard-parser'); 
const vCard = require('vcf'); 
const multer = require('multer');


const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// Function to export contacts as VCF
const exportContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user._id });

        if (contacts.length === 0) {
            return res.status(404).json({ message: 'No contacts found' });
        }

        let vcfData = '';
        contacts.forEach(contact => {
            vcfData += `BEGIN:VCARD\n`;
            vcfData += `VERSION:3.0\n`;
            vcfData += `FN:${contact.name}\n`; 
            if (contact.email) {
                vcfData += `EMAIL:${contact.email}\n`; 
            }
            if (contact.phone) {
                vcfData += `TEL:${contact.phone}\n`; 
            }
            vcfData += `END:VCARD\n`;
        });

        res.setHeader('Content-Type', 'text/vcard');
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.vcf');
        res.status(200).send(vcfData); 
    } catch (error) {
        console.error('Error exporting contacts:', error);
        res.status(500).json({ message: 'Error exporting contacts' });
    }
};

const importContacts= async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const vcfData = req.file.buffer.toString();

        // Parse the VCF data
        const contacts = vcardParser.parse(vcfData);
        console.log('Parsed contacts:', contacts); 

        const contactsToSave = [];

        const name = contacts.fn[0]?.value || ''; 
        const email = contacts.email[0]?.value || ''; 
        const phone = contacts.tel[0]?.value || ''; 

        console.log('Extracted Name:', name);
        console.log('Extracted Email:', email);
        console.log('Extracted Phone:', phone);

        if (name && email && phone) {
            contactsToSave.push({
                user: req.user._id,
                name,
                email,
                phone,
                tags: contacts.tags ? contacts.tags[0].value.split(',').map(tag => tag.trim()) : [], 
            });
        } else {
            console.log('One or more contact fields are empty.');
        }

        if (contactsToSave.length === 0) {
            return res.status(400).json({ message: 'No valid contacts to save' });
        }

        const result = await Contact.insertMany(contactsToSave);
        res.status(200).json({ message: 'Contacts imported successfully', data: result });
    } catch (error) {
        console.error('Error importing contacts:', error);
        res.status(500).json({ message: 'Error importing contacts', error: error.message });
    }
};

module.exports = { exportContacts, importContacts};