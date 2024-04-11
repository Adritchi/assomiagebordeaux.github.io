
import React from 'react';
import Suppression from '../../assets/icons/delete.svg';

// Récupère l'objet event en tant que prop
const SuppressionProduit = ({ produit }) => {
    // Fonction gererSuppression pour gérer la suppression de l'événement
    const gererSuppression = async () => {
        try {
            // Envoi d'une requête DELETE à l'API
            const reponse = await fetch(`http://localhost:3000/produit/${produit.ID}`, {
                method: 'DELETE', // Utilisation de la méthode DELETE
            });

            // Vérification de la réponse de la requête
            if (reponse.ok) {
                console.log('Événement supprimé avec succès');
                window.location.reload(); // Recharge la page
            } else {
                console.error('Erreur lors de la suppression de l\'événement');
            }
        } catch (erreur) {
            console.error(erreur);
        }
    };

    // Rendu avec un bouton qui appelle la fonction gererSuppression au clic
    return (
        <div>
            <button onClick={gererSuppression} alt="Supprimer"><img src={Suppression}></img></button>
        </div>
    );
};

export default SuppressionProduit;
