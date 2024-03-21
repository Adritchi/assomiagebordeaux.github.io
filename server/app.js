const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const os = require('os');
// const eventRoutes = require('./event'); // Importer les routes de event.js


const app = express();

// -------------- CONNECTION ----------------
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

// app.use('/events', eventRoutes);

// Connexion Base de données
const port = 3000;
connection.connect((err) => {
    if (err) {
            console.error('Erreur de connexion à la base de données : ' + err.stack);
            return;
        }
        console.log('Connecté à la base de données avec l"identifiant ' + connection.threadId);
    }); 

// -------------- ADMIN ----------------
adminConnected = false; 
ip= "";
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

// -------------- EVENTS ----------------

// Route pour supprimer un événement (requête DELETE)
app.delete('/event/:id', (req, res) => {
    const eventId = req.params.id; // Récupère l'ID de l'événement à supprimer

    const query = 'DELETE FROM evenement WHERE ID = ?'; // Requête SQL

    connection.query(query, eventId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la suppression de l\'événement');
        } else {
            if (results.affectedRows > 0) {
                // Vérifie si des lignes ont été affectées
                res.status(200).send('Événement supprimé avec succès');
            } else {
                res.status(404).send('Événement non trouvé');
            }
        }
    });
});

// Route pour la création d'un événement (requête POST)
app.post('/event', (req, res) => {
    console.log('Requête POST reçue pour la création d\'un événement:', req.body);

    const newEvent = [
        req.body.titre || '',
        req.body.description || '',
        req.body.image || '',
        req.body.lien || '',
        req.body.date_debut || '',
        req.body.date_fin || '',
        req.body.lieu || ''
    ];

    const query = 'INSERT INTO evenement (titre, description, image, lien, date_debut, date_fin, lieu) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, newEvent, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la création de l\'événement');
        } else {
            res.status(201).send('Événement créé avec succès');
        }
    });
});

// Route pour récupérer tous les événements (requête GET)
app.get('/event', (req, res) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD
    const query = `SELECT * FROM evenement WHERE date_fin > '${currentDate}' ORDER BY date_debut ASC`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des événements');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/eventPasse', (req, res) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD
    const query = `SELECT * FROM evenement WHERE date_fin < '${currentDate}' ORDER BY date_debut ASC`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des événements');
        } else {
            res.status(200).json(results);
        }
    });
});

// Route pour la modification d'un événement (requête PUT)
app.put('/event:id', (req, res) => {
    const eventId = req.params.id;
    const updatedEvent = req.body;

    // Champs à mettre à jour
    const { titre, lieu, date_debut, date_fin, description, lien, image } = updatedEvent;

    let query = 'UPDATE evenement SET titre = ?, lieu = ?, date_debut = ?, description = ?, lien = ?, image = ? WHERE ID = ?';
    let queryParams = [titre, lieu, date_debut, description, lien, image, eventId];

    // Vérifie si date_fin est fourni dans updatedEvent
    if (date_fin !== undefined) {
        query = 'UPDATE evenement SET titre = ?, lieu = ?, date_debut = ?, date_fin = ?, description = ?, lien = ?, image = ? WHERE ID = ?';
        queryParams = [titre, lieu, date_debut, date_fin, description, lien, image, eventId];
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la mise à jour de l\'événement');
        } else {
            res.status(200).send('Événement mis à jour avec succès');
        }
    });
});

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:`+ port);
});