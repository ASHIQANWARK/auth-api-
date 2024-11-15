// services/contactService.js
const Contact = require('../models/contact');

const createContact = async (user, contactData) => {
    const contact = new Contact({ user, ...contactData });
    await contact.save();
    return contact;
};

const getContacts = async (user, filters) => {
    const query = { user };
    if (filters.name) query.name = new RegExp(filters.name, 'i');
    if (filters.email) query.email = new RegExp(filters.email, 'i');
    if (filters.favorite) query.favorite = filters.favorite;

    const contacts = await Contact.find(query).sort(filters.sortBy || 'createdAt').skip(filters.skip || 0).limit(filters.limit || 10);
    return contacts;
};

const updateContact = async (user, contactId, updates) => {
    const contact = await Contact.findOneAndUpdate({ user, _id: contactId }, updates, { new: true });
    return contact;
};

const deleteContact = async (user, contactId) => {
    await Contact.deleteOne({ user, _id: contactId });
};

module.exports = { createContact, getContacts, updateContact, deleteContact };
