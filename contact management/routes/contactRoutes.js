// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const contactService = require('../services/contactService');

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Contact's name
 *               email:
 *                 type: string
 *                 description: Contact's email
 *               phone:
 *                 type: string
 *                 description: Contact's phone number
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const contactData = req.body;
        const contact = await contactService.createContact(req.user.userId, contactData);
        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter contacts by name
 *     responses:
 *       200:
 *         description: List of contacts
 *       400:
 *         description: Bad request
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const filters = req.query;
        const contacts = await contactService.getContacts(req.user.userId, filters);
        res.json(contacts);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update an existing contact
 *     tags: [Contacts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to update
 *       - in: body
 *         name: contact
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updates = req.body;
        const contact = await contactService.updateContact(req.user.userId, req.params.id, updates);
        res.json(contact);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the contact to delete
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *       400:
 *         description: Bad request
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await contactService.deleteContact(req.user.userId, req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
