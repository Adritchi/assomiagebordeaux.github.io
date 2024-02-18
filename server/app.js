const express = require('express');
const path = require('path');
const mysql = require('mysql');
const os = require('os');

let password;
let database;
if (os.platform() === 'win32') {
    password = ''; // Windows
    database = 'siteamb';
} else if (os.platform() === 'darwin') {
    password = 'root'; // Mac
    database = 'siteAMB';
} else {
    // Autre système d'exploitation
    console.error('Système d"exploitation non pris en charge');
    process.exit(1);
}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password, 
    database: database
});

const port = 3000;
connection.connect((err) => {
    if (err) {
            console.error('Erreur de connexion à la base de données : ' + err.stack);
            return;
        }
        console.log('Connecté à la base de données avec l"identifiant ' + connection.threadId);
    }); 

    
const app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:`+ port);
});
