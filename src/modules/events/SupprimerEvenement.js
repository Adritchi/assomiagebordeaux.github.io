
import React from 'react';
import DELETE from '../../assets/icons/delete.svg';

// Récupère l'objet event en tant que prop
const SupprimerEvenement = ({ evenement }) => {
    // Fonction pour gérer la suppression de l'événement
    const gererSuppression = async () => {
        try {
            // Envoi d'une requête DELETE à l'API
            const reponse = await fetch(`http://localhost:3000/evenement/${evenement.ID}`, {
                method: 'DELETE', // Utilisation de la méthode DELETE
            });

            // Vérification de la réponse de la requête
            if (reponse.ok) {
                console.log('Événement supprimé avec succès');
                window.location.reload(); // Recharge la page
            } else {
                console.error('Erreur lors de la suppression de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Rendu avec un bouton qui appelle la fonction gererSuppression au clic
    return (
        <button onClick={gererSuppression} alt="Supprimer"><img src={DELETE}></img></button>
    );
};

export default SupprimerEvenement;
