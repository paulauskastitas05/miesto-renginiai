const mysql = require('mysql2');

// Sukuriame MySQL prisijungimą
const db = mysql.createConnection({
    host: 'localhost', // Duombazės IP adresas
    user: 'root',      // Duombazės vartotojo vardas
    password: '',      // Duombazės slaptažodis
    database: 'miesto-renginiai' // Duombazės pavadinimas
});


// Prijungiame prie MySQL duomenų bazės
db.connect((err) => {
    if (err) {
        console.error('Nepavyko prisijungti prie duomenų bazės:', err);
        throw err;
    }
    console.log('Duomenų bazė prijungta!');
});

module.exports = db;
