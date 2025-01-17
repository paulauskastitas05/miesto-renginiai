const express = require('express');
const bcrypt = require('bcryptjs');


const { body, validationResult } = require('express-validator');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const jwt = require('jsonwebtoken');
import { jwtDecode } from 'jwt-decode';
const router = express.Router();
const db = require('../db');



// Registracija su validacija

router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Vartotojo vardas privalomas'),
        body('email').isEmail().withMessage('Netinkamas el. pašto formatas'),
        body('password').isLength({ min: 6 }).withMessage('Slaptažodis turi būti bent 6 simbolių'),
    ],
    async (req, res) => {
        // Tikriname validacijos klaidas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            // Tikriname, ar vartotojas arba el. paštas nėra užimtas
            const checkUserQuery = 'SELECT * FROM vartotojai WHERE username = ? OR email = ?';
            db.query(checkUserQuery, [username, email], async (err, results) => {
                if (err) {
                    console.error('Duomenų bazės klaida registracijos metu:', err.message);
                    return res.status(500).json({ error: 'Serverio klaida. Bandykite vėliau.' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ message: 'Vartotojo vardas arba el. paštas jau egzistuoja' });
                }

                // Sukuriame slaptažodžio hash
                const hashedPassword = await bcrypt.hash(password, 10);

                // Įrašome naują vartotoją į duombazę
                const insertUserQuery =
                    'INSERT INTO vartotojai (username, email, password, role, status) VALUES (?, ?, ?, "user", "active")';
                db.query(insertUserQuery, [username, email, hashedPassword], (err, result) => {
                    if (err) {
                        console.error('DB klaida įrašant vartotoją:', err.message);
                        return res.status(500).json({ error: 'Serverio klaida. Bandykite vėliau.' });
                    }

                    res.status(201).json({ message: 'Vartotojas sėkmingai užregistruotas!' });
                });
            });
        } catch (err) {
            console.error('Serverio klaida:', err.message);
            res.status(500).json({ error: 'Serverio klaida. Bandykite vėliau.' });
        }
    }
);

// Prisijungimas su validacija
router.post(
    '/login',
    [
        body('username').notEmpty().withMessage('Vartotojo vardas privalomas'),
        body('password').notEmpty().withMessage('Slaptažodis privalomas'),
    ],
    (req, res) => {
        // Tikriname validacijos klaidas
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Patikriname, ar vartotojas egzistuoja
        const query = 'SELECT * FROM vartotojai WHERE username = ?';
        db.query(query, [username], async (err, results) => {
            if (err) {
                console.error('DB klaida prisijungimo metu:', err.message);
                return res.status(500).json({ error: 'Serverio klaida. Bandykite vėliau.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Vartotojas nerastas' });
            }

            const user = results[0];

            // Tikriname, ar paskyra aktyvi
            if (user.status !== 'active') {
                return res.status(403).json({ message: 'Paskyra yra neaktyvi. Kreipkitės į administratorių.' });
            }

            try {
                // Tikriname slaptažodį
                const isValid = await bcrypt.compare(password, vartotojai.password);
                if (!isValid) {
                    return res.status(401).json({ message: 'Neteisingas slaptažodis' });
                }

                // Sukuriame JWT tokeną
                const token = jwt.sign(
                    { id: user.id, role: user.role },
                    'secretKey', // Pakeiskite į aplinkos kintamąjį gamybos režimu
                    { expiresIn: '1h' }
                );

                return res.status(200).json({ token, message: 'Prisijungimas sėkmingas!' });
            } catch (err) {
                console.error('Klaida tikrinant slaptažodį:', err.message);
                return res.status(500).json({ error: 'Serverio klaida. Bandykite vėliau.' });
            }
        });
    }
);

// Gauti visus renginius (visiems prisijungusiems vartotojams)
router.get('/', verifyToken, (req, res) => {
    const query = 'SELECT * FROM renginiai';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        res.status(200).json(results);
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
    const query = 'UPDATE renginiai SET title = ?, category = ?, date = ?, location = ?, image = ? WHERE id = ?';
    db.query(query, [title, category, date, location, image, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        res.status(200).json({ message: 'Renginys sėkmingai atnaujintas!' });
    });
});

// Ištrinti renginį (tik administratoriams)
router.delete('/delete/:id', verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM renginiai WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        res.status(200).json({ message: 'Renginys sėkmingai ištrintas!' });
    });
});

// Gauti visus vartotojus (tik administratoriams)
router.get('/admin/vartotojai', verifyToken, verifyAdmin, (req, res) => {
    const query = 'SELECT id, username, email, role FROM vartotojai';
    db.query(query, (err, results) => {
        if (err) {
            console.error('DB klaida gaunant vartotojus:', err.message);
            return res.status(500).json({ error: 'Serverio klaida' });
        }
        res.status(200).json(results);
    });
});

router.get('/vartotojai', verifyToken, (req, res) => {
    const query = 'SELECT id, username, email, role FROM vartotojai';
    db.query(query, (err, results) => {
        if (err) {
            console.error('DB klaida gaunant vartotojus:', err.message);
            return res.status(500).json({ error: 'Serverio klaida' });
        }
        res.status(200).json(results);
    });
});


module.exports = router;
