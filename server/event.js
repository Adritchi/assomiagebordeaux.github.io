const express = require('express');
const router = express.Router();
const connection = require('./connection'); // Importer la connexion à la base de données

// Route pour la création d'un événement (requête POST)
router.post('/', (req, res) => {
    console.log('Requête POST reçue pour la création d\'un événement:', req.body);

    const newEvent = [
        req.body.titre || '',
        req.body.description || '',
        req.body.image || '',
        req.body.lien || '',
        req.body.date || '',
        req.body.lieu || ''
    ];

    const query = 'INSERT INTO evenement (titre, description, image, lien, date, lieu) VALUES (?, ?, ?, ?, ?, ?)';
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
router.get('/', (req, res) => {
    const query = 'SELECT * FROM evenement';

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
router.put('/:id', (req, res) => {
    const eventId = req.params.id;
    const updatedEvent = req.body;

    // Champs à mettre à jour
    const { titre, lieu, date, description, lien, image } = updatedEvent;

    const query = 'UPDATE evenement SET titre = ?, lieu = ?, date = ?, description = ?, lien = ?, image = ? WHERE ID = ?';
    connection.query(query, [titre, lieu, date, description, lien, image, eventId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de la mise à jour de l\'événement');
        } else {
            res.status(200).send('Événement mis à jour avec succès');
        }
    });
});

module.exports = router;