const Contact = require('../models/contact');

exports.createContact = async (req, res) => {
    const { name, phone, email, address, notes, birthday, tags } = req.body;
    try {
        const contact = new Contact({ name, phone, email, address, notes, birthday, tags, user: req.user.id });
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateContact = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const contact = await Contact.findByIdAndUpdate(id, updates, { new: true });
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        await Contact.findByIdAndRemove(id);
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
