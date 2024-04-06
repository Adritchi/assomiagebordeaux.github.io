
import React from 'react';
import DELETE from '../../assets/icons/delete.svg';

// Récupère l'objet souvenir en tant que prop
const SupprimerSouvenir = ({ souvenir }) => {
    // Fonction pour gérer la suppression du souvenir
    const gererSuppression = async () => {
        try {
            // Envoi d'une requête DELETE à l'API
            const reponse = await fetch(`http://localhost:3000/souvenir/${souvenir.ID}`, {
                method: 'DELETE', // Utilisation de la méthode DELETE
            });

            // Vérification de la réponse de la requête
            if (reponse.ok) {
                console.log('Souvenir supprimé avec succès');
                window.location.reload(); // Recharge la page
            } else {
                console.error('Erreur lors de la suppression du souvenir');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Rendu avec un bouton qui appelle la fonction gererSuppression au clic
    return (
        <div>
            <button onClick={gererSuppression} alt="Supprimer"><img src={DELETE}></img></button>
        </div>
    );
};

export default SupprimerSouvenir;
