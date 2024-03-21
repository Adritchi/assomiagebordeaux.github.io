const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const os = require('os');
const eventRoutes = require('./event'); // Importer les routes de event.js


const app = express();

adminConnected = false; 
ip= "";


// Système d'exploitation
let password;
if (os.platform() === 'win32') {
    password = ''; // Windows
} else if (os.platform() === 'darwin') {
    password = 'root'; // Mac
} else {
    // Autre système d'exploitation
    console.error('Système d"exploitation non pris en charge');
    process.exit(1);
}

app.use(express.json());
// Initialisation : Connexion Base de données
app.use(cors());
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password, 
    database: 'siteamb'
});

app.use('/events', eventRoutes);

// Connexion Base de données
const port = 3000;
connection.connect((err) => {
    if (err) {
            console.error('Erreur de connexion à la base de données : ' + err.stack);
            return;
        }
        console.log('Connecté à la base de données avec l"identifiant ' + connection.threadId);
    }); 

const bannedIPs = {}; // Stocke les IPs bannies et le temps jusqu'à la fin du bannissement

// Fonction pour vérifier si l'IP est bannie
const isIPBanned = (ip) => {
    if (bannedIPs[ip] && bannedIPs[ip] > Date.now()) {
        return true;
    }
    return false;
};

// Ajouter cette route dans app.js
app.get('/checkIPBanned', (req, res) => {
    const ip = req.ip;
    if (isIPBanned(ip)) {
        return res.status(200).json({ banned: true });
    } else {
        return res.status(200).json({ banned: false });
    }
});

app.get('/banIP', (req, res) => {
    bannedIPs[req.ip] = Date.now() + 3600000;
    console.log(bannedIPs);
    return;
});

app.post('/login', (req, res) => {
    // Vérifier si l'IP est bannie
    if (isIPBanned(req.ip)) {
        return res.status(403).json({ status: "error", message: "Vous êtes banni. Réessayez plus tard." });
    }

    const sql = "SELECT * FROM Utilisateur WHERE identifiant = ? AND password = ?";
    const values = [
        req.body.id,
        req.body.password
    ]
    connection.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ status: "error", message: "Erreur interne du serveur" });
        if (data.length > 0) {
            ip = req.ip;
            adminConnected = true;
            return res.status(200).json({ status: "success", message: "Connexion réussie" });
        } else {
            return res.status(401).json({ status: "error", message: "Identifiant ou mot de passe incorrect" });
        }
    });
});

    app.get('/checkLoginStatus', (req, res) => {
        if(req.ip === ip){
            return res.json({ adminConnected: adminConnected }); // Renvoie l'état actuel de adminConnected
        }else {
            return res.json({ adminConnected: false });;
        }
    });
    app.post('/logout', (req, res) => {
        ip="";
        console.log(ip);
        adminConnected = false; // Réinitialise la variable adminConnected à false lors de la déconnexion
        res.sendStatus(200); // Envoie une réponse indiquant que la déconnexion a réussi
    });

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:`+ port);
});
