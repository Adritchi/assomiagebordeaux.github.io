const express = require('express');
const path = require('path');
const mysql = require('mysql');
const os = require('os');

//! A utiliser plus tard au besoin
// const eventRoutes = require('./event'); 

const app = express();
//! A utiliser plus tard au besoin (pas forcément placé au bon endroit)
// app.use('/events', eventRoutes);

// -------------- PARAMETRAGE ----------------

// Middleware pour les requêtes entrantes au format JSON
app.use(express.json({ limit: '10mb' })); // C'est pas obligatoire
// Middleware pour les données de formulaire URL encodées (extended:true pour autoriser les objets et les tableaux)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Si l'image envoyé à +10Mo ça envera une erreur

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

// Initialisation : Connexion Base de données
app.use(express.json());
app.use((req, res, next) => {
    // Autorise l'accès depuis n'importe quelle origine
    res.header('Access-Control-Allow-Origin', '*');
    // Autorise les méthodes HTTP spécifiques
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Autorise les en-têtes spécifiques
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Passe à la prochaine étape du middleware
    next();
});

const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: password, // variable en fonction de l'OS utilisé
    database: 'siteamb' // Le nom de la base de donnée
}); 

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
ip = "";
const bannedIPs = {}; // Stocke les IPs bannies et le temps jusqu'à la fin du bannissement

const isAdminLoggedIn = (req, res, next) => {
    // Vérifier si l'administrateur est connecté
    if (!adminConnected || req.ip !== ip) {
        return res.status(403).json({ status: "error", message: "Accès refusé. Connectez-vous en tant qu'administrateur." });
    }
    // L'utilisateur est connecté en tant qu'administrateur
    next();
};

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
    if (req.ip === ip) {
        return res.json({ adminConnected: adminConnected }); // Renvoie l'état actuel de adminConnected
    } else {
        return res.json({ adminConnected: false });;
    }
});
app.post('/logout', (req, res) => {
    ip = "";
    console.log(ip);
    adminConnected = false; // Réinitialise la variable adminConnected à false lors de la déconnexion
    res.sendStatus(200); // Envoie une réponse indiquant que la déconnexion a réussi
});

// -------------- EVENTS ----------------

// Route pour supprimer un événement (requête DELETE)
app.delete('/event/:id', isAdminLoggedIn,(req, res) => {
    const eventId = req.params.id; // Récupère l'ID de l'événement à supprimer

    const query = 'DELETE FROM evenement WHERE ID = ?'; 

    // Exécution de la requête SQL avec les données reçus
    connection.query(query, eventId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la suppression de l\'événement');
        } else {
            // Vérifie si des lignes ont été affectées
            if (results.affectedRows > 0) {
                res.status(200).send('Événement supprimé avec succès');
            } else {
                res.status(404).send('Événement non trouvé');
            }
        }
    });
});

// Route pour la création d'un événement (requête POST)
app.post('/event', isAdminLoggedIn,(req, res) => {
    // Affichage dans la console des données reçues
    console.log('Requête POST reçue pour la création d\'un événement:', req.body);

    // Création d'un nouvel événement à partir des données de la requête
    const newEvent = [
        req.body.titre || '', // Titre (par défaut vide)
        req.body.description || '', // Description (par défaut vide)
        req.body.image || null, // Image (par défaut null)
        req.body.lien || '', // Lien (par défaut vide)
        req.body.date_debut || '', // Date de début (par défaut vide)
        req.body.date_fin || null, // Date de fin (par défaut null)
        req.body.lieu || '' // Lieu (par défaut vide)
    ];

    const query = 'INSERT INTO evenement (titre, description, image, lien, date_debut, date_fin, lieu) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    // Exécution de la requête SQL avec les données reçus
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
    const query = `SELECT * FROM evenement WHERE (date_fin IS NULL OR date_fin >= '${currentDate}') ORDER BY date_debut DESC`;

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
    const query = `SELECT * FROM evenement WHERE date_fin < '${currentDate}' ORDER BY date_debut DESC`;

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
app.put('/event/:id', isAdminLoggedIn,(req, res) => {
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


// -------------- PRODUCT ----------------

// Route pour supprimer un produit (requête DELETE)
app.delete('/product/:id', isAdminLoggedIn,(req, res) => {
    const productId = req.params.id; // Récupère l'ID du produit à supprimer

    const query = 'DELETE FROM produit WHERE ID = ?'; 

    // Exécution de la requête SQL avec les données reçus
    connection.query(query, productId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la suppression du produit');
        } else {
            // Vérifie si des lignes ont été affectées
            if (results.affectedRows > 0) {
                res.status(200).send('Produit supprimé avec succès');
            } else {
                res.status(404).send('Produit non trouvé');
            }
        }
    });
});

// Route pour la création d'un produit (requête POST)
app.post('/product', isAdminLoggedIn,(req, res) => {
    // Affichage dans la console des données reçues
    console.log('Requête POST reçue pour la création d\'un produit :', req.body);

    // Création d'un nouveau produit à partir des données de la requête
    const newProduct = [
        req.body.nomProduit || '',
        req.body.prix || '',
        req.body.imageProduit || null,
        req.body.lien || '',
        req.body.etatProduit ? 1 : 0, // Convertir en 1 si vrai, sinon en 0
    ];
    

    const query = 'INSERT INTO produit (nom, prix, image, lien, estDispo) VALUES (?, ?, ?, ?, ?)';
    
    // Exécution de la requête SQL avec les données reçus
    connection.query(query, newProduct, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la création du produit');
        } else {
            res.status(201).send('Produit créé avec succès');
        }
    });
});

// Route pour récupérer tous les produits (requête GET)
app.get('/product', (req, res) => {
    const query = `SELECT * FROM produit`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des produits');
        } else {
            res.status(200).json(results);
        }
    });
});

// Route pour la modification d'un produit (requête PUT)
app.put('/product/:id', isAdminLoggedIn,(req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    // Champs à mettre à jour
    const { nomProduit, prix, imageProduit, lien, etatProduit } = updatedProduct;

    let query = 'UPDATE produit SET nom = ?, prix = ?, image = ?, lien = ?, estDispo = ? WHERE ID = ?';
    let queryParams = [nomProduit, prix, imageProduit, lien, etatProduit, productId];

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la mise à jour du produit');
        } else {
            res.status(200).send('Produit mis à jour avec succès');
        }
    });
});

// -------------- MEMORY ----------------

// Route pour supprimer un souvenir (requête DELETE)
app.delete('/memory/:id', isAdminLoggedIn,(req, res) => {
    const memoryId = req.params.id; // Récupère l'ID du souvenir à supprimer

    const query = 'DELETE FROM memory WHERE ID = ?'; 

    // Exécution de la requête SQL avec les données reçus
    connection.query(query, memoryId, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la suppression du souvenir');
        } else {
            // Vérifie si des lignes ont été affectées
            if (results.affectedRows > 0) {
                res.status(200).send('Souvenir supprimé avec succès');
            } else {
                res.status(404).send('Souvenir non trouvé');
            }
        }
    });
});

// Route pour la création d'un souvenir (requête POST)
app.post('/memory', isAdminLoggedIn,(req, res) => {
    // Affichage dans la console des données reçues
    console.log('Requête POST reçue pour la création d\'un souvenir :', req.body);

    // Création d'un nouveau souvenir à partir des données de la requête
    const newMemory = [
        req.body.titre || '', // Nom (par défaut vide)
        req.body.description || '', // Prix (par défaut vide)
        req.body.image || null, // Image (par défaut null)
        req.body.lien || '', // Lien (par défaut vide)
        req.body.date_debut || '', // Date de début (par défaut vide)
        req.body.date_fin || null // Date de fin (par défaut vide)
    ];

    const query = 'INSERT INTO memory (titre, description, image, lien, date_debut, date_fin) VALUES (?, ?, ?, ?, ?,?)';
    
    // Exécution de la requête SQL avec les données reçus
    connection.query(query, newMemory, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la création du souvenir');
        } else {
            res.status(201).send('Souvenir créé avec succès');
        }
    });
});

// Route pour récupérer tous les événements (requête GET)
app.get('/memory', (req, res) => {
    const query = `SELECT * FROM memory ORDER BY date_debut DESC`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la récupération des souvenirs');
        } else {
            res.status(200).json(results);
        }
    });
});

// Route pour la modification d'un souvenir (requête PUT)
app.put('/memory/:id',isAdminLoggedIn, (req, res) => {
    const memoryId = req.params.id;
    const updatedMemory = req.body;

    // Champs à mettre à jour
    const { titre, description, image, lien, date_debut, date_fin } = updatedMemory;

    let query = 'UPDATE memory SET titre = ?, description = ?, image = ?, lien = ?, date_debut = ?,  date_fin = ? WHERE ID = ?';
    let queryParams = [titre, description, image, lien, date_debut, date_fin, memoryId];

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la mise à jour du souvenir');
        } else {
            res.status(200).send('Souvenir mis à jour avec succès');
        }
    });
});


// -------------- BUILD ----------------

// Middleware les fichiers statiques du dossier de build
app.use(express.static(path.join(__dirname, '../build')));

// Gestion de la route par défaut
app.get('*', (req, res) => {
    // Envoie du fichier index.html pour toutes les autres routes
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server is running at http://localhost:` + port);
});
