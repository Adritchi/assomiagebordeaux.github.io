const express = require('express'); // Importation du module Express pour la création d'une application web
const path = require('path'); // Importation du module Path pour la gestion des chemins de fichiers
const mysql = require('mysql'); // Importation du module MySQL pour la connexion à la base de données
const os = require('os'); // Importation du module OS pour obtenir des informations sur le système d'exploitation

const app = express(); // Création d'une application Express

// -------------- PARAMETRAGE ----------------

// Middleware pour les requetes entrantes au format JSON
app.use(express.json({ limit: '10mb' })); // C'est pas obligatoire
// Middleware pour les données de formulaire URL encodées (extended:true pour autoriser les objets et les tableaux)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Si l'image envoyé à +10Mo ça envera une erreur

// -------------- CONNECTION ----------------

// Définition du mot de passe en fonction du système d'exploitation
let motDePasse;
if (os.platform() === 'win32') {
    motDePasse = ''; // Mot de passe vide pour Windows
} else if (os.platform() === 'darwin') {
    motDePasse = 'root'; // Mot de passe vide pour Mac
} else {
    // Autre système d'exploitation
    console.error('Système d"exploitation non pris en charge');
    process.exit(1);
}

// Initialisation : Connexion Base de données
app.use(express.json());
app.use((requete, resultat, next) => {
    // Autorise l'accès depuis n'importe quelle origine
    resultat.header('Access-Control-Allow-Origin', '*');
    // Autorise les méthodes HTTP spécifiques
    resultat.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Autorise les en-têtes spécifiques
    resultat.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Passe à la prochaine étape du middleware
    next();
});

const connexion = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: motDePasse, // variable en fonction de l'OS utilisé
    database: 'siteamb' // Le nom de la base de donnée
}); 

// Connexion Base de données
const port = 3000;
connexion.connect((erreur) => {
    if (erreur) {
        console.error('erreur de connexion à la base de données : ' + erreur.stack);
        return;
    }
    console.log('Connecté à la base de données avec l"identifiant ' + connexion.threadId);
});

// -------------- ADMIN ----------------

let adminConnecte = false;
let ip = "";
const ipBannies = {}; // Stocke les IPs bannies et le temps jusqu'à la fin du bannissement

const estAdminConnecte = (requete, resultat, next) => {
    // Vérifier si l'administrateur est connecté
    if (!adminConnecte || requete.ip !== ip) {
        return resultat.status(403).json({ status: "erreur", message: "Accès refusé. Connectez-vous en tant qu'administrateur." });
    }
    // L'utilisateur est connecté en tant qu'administrateur
    next();
};

// Fonction pour vérifier si l'IP est bannie
const ipEstBannie = (ip) => {
    if (ipBannies[ip] && ipBannies[ip] > Date.now()) {
        return true;
    }
    return false;
};

// Ajouter cette route dans app.js
app.get('/verifierBannissementIp', (requete, resultat) => {
    const ip = requete.ip;
    if (ipEstBannie(ip)) {
        return resultat.status(200).json({ banned: true });
    } else {
        return resultat.status(200).json({ banned: false });
    }
});

app.get('/bannissementIP', (requete, resultat) => {
    ipBannies[requete.ip] = Date.now() + 3600000;
    console.log(ipBannies);
    return;
});

app.post('/connexion', (requete, resultat) => {
    // Vérifier si l'IP est bannie
    if (ipEstBannie(requete.ip)) {
        return resultat.status(403).json({ status: "erreur", message: "Vous êtes banni. Réessayez plus tard." });
    }

    const sql = "SELECT * FROM Utilisateur WHERE identifiant = ? AND password = ?";
    const valeurs = [
        requete.body.identifiant,
        requete.body.motDePasse
    ]
    connexion.query(sql, valeurs, (erreur, data) => {
        if (erreur) return resultat.status(500).json({ status: "erreur", message: "erreur interne du serveur" });
        if (data.length > 0) {
            ip = requete.ip;
            adminConnecte = true;
            return resultat.status(200).json({ status: "success", message: "Connexion réussie" });
        } else {
            return resultat.status(401).json({ status: "erreur", message: "Identifiant ou mot de passe incorrect" });
        }
    });
});

app.get('/estAdminConnecte', (requete, resultat) => {
    if (requete.ip === ip) {
        return resultat.json({ adminConnecte: adminConnecte }); // Renvoie l'état actuel de adminConnecte
    } else {
        return resultat.json({ adminConnecte: false });;
    }
});
app.post('/deconnexion', (requete, resultat) => {
    ip = "";
    console.log(ip);
    adminConnecte = false; // Réinitialise la variable adminConnecte à false lors de la déconnexion
    resultat.sendStatus(200); // Envoie une réponse indiquant que la déconnexion a réussi
});

// -------------- EVENTS ----------------

// Route pour supprimer un événement (requete DELETE)
app.delete('/evenement/:id', estAdminConnecte,(requete, reponse) => {
    const identifiantEvenement = requete.params.id; // Récupère l'ID de l'événement à supprimer

    const query = 'DELETE FROM evenement WHERE ID = ?'; 

    // Exécution de la requete SQL avec les données reçus
    connexion.query(query, identifiantEvenement, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la suppression de l\'événement');
        } else {
            // Vérifie si des lignes ont été affectées
            if (resultat.affectedRows > 0) {
                reponse.status(200).send('Événement supprimé avec succès');
            } else {
                reponse.status(404).send('Événement non trouvé');
            }
        }
    });
});

// Route pour la création d'un événement (requete POST)
app.post('/evenement', estAdminConnecte,(requete, reponse) => {
    // Affichage dans la console des données reçues
    console.log('requete POST reçue pour la création d\'un événement:', requete.body);

    // Création d'un nouvel événement à partir des données de la requete
    const nouveauEvenement = [
        requete.body.titre || '', // Titre (par défaut vide)
        requete.body.description || '', // Description (par défaut vide)
        requete.body.image || null, // Image (par défaut null)
        requete.body.lien || '', // Lien (par défaut vide)
        requete.body.date_debut || '', // Date de début (par défaut vide)
        requete.body.date_fin || null, // Date de fin (par défaut null)
        requete.body.lieu || '' // Lieu (par défaut vide)
    ];

    const query = 'INSERT INTO evenement (titre, description, image, lien, date_debut, date_fin, lieu) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    // Exécution de la requete SQL avec les données reçues
    connexion.query(query, nouveauEvenement, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la création de l\'événement');
        } else {
            reponse.status(201).send('Événement créé avec succès');
        }
    });
});

// Route pour récupérer tous les événements (requete GET)
app.get('/evenement', (requete, reponse) => {
    const dateActuelle = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD
    const query = `SELECT * FROM evenement WHERE (date_fin IS NULL OR date_fin >= '${dateActuelle}') ORDER BY date_debut DESC`;

    connexion.query(query, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la récupération des événements');
        } else {
            reponse.status(200).json(resultat);
        }
    });
});

app.get('/evenementPasse', (requete, reponse) => {
    const dateActuelle = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD
    const query = `SELECT * FROM evenement WHERE date_fin < '${dateActuelle}' ORDER BY date_debut DESC`;

    connexion.query(query, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la récupération des événements');
        } else {
            reponse.status(200).json(resultat);
        }
    });
});

// Route pour la modification d'un événement (requete PUT)
app.put('/evenement/:id', estAdminConnecte,(requete, reponse) => {
    const identifiantEvenement = requete.params.id;
    const evenementMiseAJour = requete.body;

    // Champs à mettre à jour
    const { titre, lieu, date_debut, date_fin, description, lien, image } = evenementMiseAJour;

    let query = 'UPDATE evenement SET titre = ?, lieu = ?, date_debut = ?, description = ?, lien = ?, image = ? WHERE ID = ?';
    let queryParams = [titre, lieu, date_debut, description, lien, image, identifiantEvenement];

    // Vérifie si date_fin est fourni dans evenementMiseAJour
    if (date_fin !== undefined) {
        query = 'UPDATE evenement SET titre = ?, lieu = ?, date_debut = ?, date_fin = ?, description = ?, lien = ?, image = ? WHERE ID = ?';
        queryParams = [titre, lieu, date_debut, date_fin, description, lien, image, identifiantEvenement];
    }

    connexion.query(query, queryParams, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la mise à jour de l\'événement');
        } else {
            reponse.status(200).send('Événement mis à jour avec succès');
        }
    });
});



// -------------- PRODUCT ----------------

// Route pour supprimer un produit (requete DELETE)
app.delete('/produit/:id', estAdminConnecte,(requete, reponse) => {
    const identifiantProduit = requete.params.id; // Récupère l'ID du produit à supprimer

    const query = 'DELETE FROM produit WHERE ID = ?'; 

    // Exécution de la requete SQL avec les données reçues
    connexion.query(query, identifiantProduit, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la suppression du produit');
        } else {
            // Vérifie si des lignes ont été affectées
            if (resultat.affectedRows > 0) {
                reponse.status(200).send('Produit supprimé avec succès');
            } else {
                reponse.status(404).send('Produit non trouvé');
            }
        }
    });
});

// Route pour la création d'un produit (requete POST)
app.post('/produit', estAdminConnecte,(requete, reponse) => {
    // Affichage dans la console des données reçues
    console.log('requete POST reçue pour la création d\'un produit :', requete.body);

    // Création d'un nouveau produit à partir des données de la requete
    const nouveauProduit = [
        requete.body.nom || '',
        requete.body.prix || '',
        requete.body.image || null,
        requete.body.lien || '',
        requete.body.estDispo ? 1 : 0, // Convertir en 1 si vrai,  sinon en 0
    ];

    const query = 'INSERT INTO produit (nom, prix, image, lien, estDispo) VALUES (?, ?, ?, ?, ?)';
    
    // Exécution de la requete SQL avec les données reçues
    connexion.query(query, nouveauProduit, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la création du produit');
        } else {
            reponse.status(201).send('Produit créé avec succès');
        }
    });
});

// Route pour récupérer tous les produits (requete GET)
app.get('/produit', (requete, reponse) => {
    const query = `SELECT * FROM produit`;

    connexion.query(query, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la récupération des produits');
        } else {
            reponse.status(200).json(resultat);
        }
    });
});

// Route pour la modification d'un produit (requete PUT)
app.put('/produit/:id', estAdminConnecte,(requete, reponse) => {
    const identifiantProduit = requete.params.id;
    const produitMiseAJour = requete.body;

    // Champs à mettre à jour
    const { nom, prix, image, lien, estDispo } = produitMiseAJour;

    let query = 'UPDATE produit SET nom = ?, prix = ?, image = ?, lien = ?, estDispo = ? WHERE ID = ?';
    let queryParams = [nom, prix, image, lien, estDispo, identifiantProduit];

    connexion.query(query, queryParams, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la mise à jour du produit');
        } else {
            reponse.status(200).send('Produit mis à jour avec succès');
        }
    });
});

// -------------- MEMORY ----------------

// Route pour supprimer un souvenir (requete DELETE)
app.delete('/souvenir/:id', estAdminConnecte,(requete, reponse) => {
    const identifiantSouvenir = requete.params.id; // Récupère l'ID du souvenir à supprimer

    const query = 'DELETE FROM memory WHERE ID = ?'; 

    // Exécution de la requete SQL avec les données reçues
    connexion.query(query, identifiantSouvenir, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la suppression du souvenir');
        } else {
            // Vérifie si des lignes ont été affectées
            if (resultat.affectedRows > 0) {
                reponse.status(200).send('Souvenir supprimé avec succès');
            } else {
                reponse.status(404).send('Souvenir non trouvé');
            }
        }
    });
});

// Route pour la création d'un souvenir (requete POST)
app.post('/souvenir', estAdminConnecte,(requete, reponse) => {
    // Affichage dans la console des données reçues
    console.log('requete POST reçue pour la création d\'un souvenir :', requete.body);

    // Création d'un nouveau souvenir à partir des données de la requete
    const nouveauSouvenir = [
        requete.body.titre || '', // Nom (par défaut vide)
        requete.body.description || '', // Prix (par défaut vide)
        requete.body.image || null, // Image (par défaut null)
        requete.body.lien || '', // Lien (par défaut vide)
        requete.body.date_debut || '', // Date de début (par défaut vide)
        requete.body.date_fin || null // Date de fin (par défaut vide)
    ];

    const query = 'INSERT INTO memory (titre, description, image, lien, date_debut, date_fin) VALUES (?, ?, ?, ?, ?, ?)';
    
    // Exécution de la requete SQL avec les données reçues
    connexion.query(query, nouveauSouvenir, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la création du souvenir');
        } else {
            reponse.status(201).send('Souvenir créé avec succès');
        }
    });
});

// Route pour récupérer tous les événements (requete GET)
app.get('/souvenir', (requete, reponse) => {
    const query = `SELECT * FROM memory ORDER BY date_debut DESC`;

    connexion.query(query, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la récupération des souvenirs');
        } else {
            reponse.status(200).json(resultat);
        }
    });
});

// Route pour la modification d'un souvenir (requete PUT)
app.put('/souvenir/:id',estAdminConnecte, (requete, reponse) => {
    const identifiantSouvenir = requete.params.id;
    const souvenirMiseAJour = requete.body;

    // Champs à mettre à jour
    const { titre, description, image, lien, date_debut, date_fin } = souvenirMiseAJour;

    let query = 'UPDATE memory SET titre = ?, description = ?, image = ?, lien = ?, date_debut = ?,  date_fin = ? WHERE ID = ?';
    let queryParams = [titre, description, image, lien, date_debut, date_fin, identifiantSouvenir];

    connexion.query(query, queryParams, (erreur, resultat) => {
        if (erreur) {
            console.error(erreur);
            reponse.status(500).send('erreur lors de la mise à jour du souvenir');
        } else {
            reponse.status(200).send('Souvenir mis à jour avec succès');
        }
    });
});


// -------------- BUILD ----------------

// Middleware les fichiers statiques du dossier de build
app.use(express.static(path.join(__dirname, '../build')));

// Gestion de la route par défaut
app.get('*', (requete, resultat) => {
    // Envoie du fichier index.html pour toutes les autres routes
    resultat.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server is running at http://localhost:` + port);
});
