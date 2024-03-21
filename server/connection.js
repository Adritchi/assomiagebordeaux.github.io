// const mysql = require('mysql');
// const os = require('os');

// let password;
// let database;
// if (os.platform() === 'win32') {
//     password = ''; // Windows
//     database = 'siteamb';
// } else if (os.platform() === 'darwin') {
//     password = 'root'; // Mac
//     database = 'siteAMB';
// } else {
//     // Autre système d'exploitation
//     console.error('Système d"exploitation non pris en charge');
//     process.exit(1);
// }

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: password,
//     database: database
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Erreur de connexion à la base de données : ' + err.stack);
//         return;
//     }
//     console.log('Connecté à la base de données avec l"identifiant ' + connection.threadId);
// });

// module.exports = connection;