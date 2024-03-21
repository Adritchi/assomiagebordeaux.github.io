// const express = require('express');
// const router = express.Router();
// const connection = require('./connection'); // Importer la connexion à la base de données

// // Route pour supprimer un événement (requête DELETE)
// router.delete('/:id', (req, res) => {
//     const eventId = req.params.id; // Récupère l'ID de l'événement à supprimer

//     const query = 'DELETE FROM evenement WHERE ID = ?'; // Requête SQL

//     connection.query(query, eventId, (error, results) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('Erreur lors de la suppression de l\'événement');
//         } else {
//             if (results.affectedRows > 0) {
//                 // Vérifie si des lignes ont été affectées
//                 res.status(200).send('Événement supprimé avec succès');
//             } else {
//                 res.status(404).send('Événement non trouvé');
//             }
//         }
//     });
// });

// // Route pour la création d'un événement (requête POST)
// router.post('/', (req, res) => {
//     console.log('Requête POST reçue pour la création d\'un événement:', req.body);

//     const newEvent = [
//         req.body.titre || '',
//         req.body.description || '',
//         req.body.image || '',
//         req.body.lien || '',
//         req.body.date_debut || '',
//         req.body.date_fin || '',
//         req.body.lieu || ''
//     ];

//     const query = 'INSERT INTO evenement (titre, description, image, lien, date_debut, date_fin, lieu) VALUES (?, ?, ?, ?, ?, ?, ?)';
//     connection.query(query, newEvent, (error, results) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('Erreur lors de la création de l\'événement');
//         } else {
//             res.status(201).send('Événement créé avec succès');
//         }
//     });
// });

// // Route pour récupérer tous les événements (requête GET)
// router.get('/', (req, res) => {
//     const currentDate = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD
//     const query = `SELECT * FROM evenement WHERE date_fin > '${currentDate}'`;

//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('Erreur lors de la récupération des événements');
//         } else {
//             res.status(200).json(results);
//         }
//     });
// });

// router.get('/eventsPasse', (req, res) => {
//     const currentDate = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD
//     const query = `SELECT * FROM evenement WHERE date_fin < '${currentDate}'`;

//     connection.query(query, (error, results) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('Erreur lors de la récupération des événements');
//         } else {
//             res.status(200).json(results);
//         }
//     });
// });

// // Route pour la modification d'un événement (requête PUT)
// router.put('/:id', (req, res) => {
//     const eventId = req.params.id;
//     const updatedEvent = req.body;

//     // Champs à mettre à jour
//     const { titre, lieu, date_debut, date_fin, description, lien, image } = updatedEvent;

//     let query = 'UPDATE evenement SET titre = ?, lieu = ?, date_debut = ?, description = ?, lien = ?, image = ? WHERE ID = ?';
//     let queryParams = [titre, lieu, date_debut, description, lien, image, eventId];

//     // Vérifie si date_fin est fourni dans updatedEvent
//     if (date_fin !== undefined) {
//         query = 'UPDATE evenement SET titre = ?, lieu = ?, date_debut = ?, date_fin = ?, description = ?, lien = ?, image = ? WHERE ID = ?';
//         queryParams = [titre, lieu, date_debut, date_fin, description, lien, image, eventId];
//     }

//     connection.query(query, queryParams, (error, results) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('Erreur lors de la mise à jour de l\'événement');
//         } else {
//             res.status(200).send('Événement mis à jour avec succès');
//         }
//     });
// });

// module.exports = router;