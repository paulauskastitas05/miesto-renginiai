const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Gauti visus renginius
router.get('/', (req, res) => {
    const query = 'SELECT * FROM renginiai';
    db.query(query, (err, results) => {
        if (err) {
            console.error('DB klaida:', err.message);
            return res.status(500).json({ error: 'Nepavyko gauti renginių' });
        }
        res.status(200).json(results);
    });
});


// Gauti renginio detales (visiems prisijungusiems vartotojams)
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM renginiai WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        if (results.length === 0) return res.status(404).json({ message: 'Renginys nerastas' });
        res.status(200).json(results[0]);
    });
});

// Pridėti renginį
router.post('/add', (req, res) => {
    const { title, category, date, location, image } = req.body;
    const query = 'INSERT INTO renginiai (title, category, date, location, image) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, category, date, location, image], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Renginys pridėtas sėkmingai!' });
    });
});

// Filtruoti renginius pagal kategoriją ir datą
router.get('/filter', (req, res) => {
    const { category, startDate, endDate } = req.query;
    let query = 'SELECT * FROM renginiai WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Vertinti renginį
router.post('/rate/:id', (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Įvertinimas turi būti tarp 1 ir 5.' });
    }

    const query = `
        UPDATE renginiai 
        SET rating = (rating * votes + ?) / (votes + 1), votes = votes + 1 
        WHERE id = ?`;
    db.query(query, [rating, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Renginys nerastas' });
        res.status(200).json({ message: 'Renginys sėkmingai įvertintas!' });
    });
});



// Pridėti naują renginį (tik administratoriams)
router.post('/add', verifyToken, verifyAdmin, (req, res) => {
    const { title, category, date, location, image } = req.body;
    const query = 'INSERT INTO renginiai (title, category, date, location, image) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, category, date, location, image], (err, result) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        res.status(201).json({ message: 'Renginys sėkmingai pridėtas!' });
    });
});

// Atnaujinti renginį (tik administratoriams)
router.put('/update/:id', verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { title, category, date, location, image } = req.body;

    if (!id || !title || !category || !date || !location) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `UPDATE renginiai SET title = ?, category = ?, date = ?, location = ?, image = ? WHERE id = ?`;
    db.query(query, [title, category, date, location, image, id], (err, result) => {
        if (err) {
            console.error('Error updating event:', err.message);
            return res.status(500).json({ message: 'Database update failed' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event updated successfully' });
    });
});


// Ištrinti renginį (tik administratoriams)
router.delete('/delete/:id', verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Missing event ID' });
    }

    const query = `DELETE FROM renginiai WHERE id = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting event:', err.message);
            return res.status(500).json({ message: 'Database deletion failed' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    });
});


// Gauti visus vartotojus (tik administratoriams)
router.get('/admin/users', verifyToken, verifyAdmin, (req, res) => {
    const query = 'SELECT id, username, email, role FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('DB klaida gaunant vartotojus:', err.message);
            return res.status(500).json({ error: 'Serverio klaida' });
        }
        res.status(200).json(results);
    });
});


module.exports = router;
