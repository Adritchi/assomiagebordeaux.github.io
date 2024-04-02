
import React from 'react';
import DELETE from '../../assets/icons/delete.svg';

// Récupère l'objet event en tant que prop
const DeleteMemory = ({ memory }) => {
    // Fonction handleDelete pour gérer la suppression de l'événement
    const handleDelete = async () => {
        try {
            // Envoi d'une requête DELETE à l'API
            const response = await fetch(`http://localhost:3000/memory/${memory.ID}`, {
                method: 'DELETE', // Utilisation de la méthode DELETE
            });

            // Vérification de la réponse de la requête
            if (response.ok) {
                console.log('Souvenir supprimé avec succès');
                window.location.reload(); // Recharge la page
            } else {
                console.error('Erreur lors de la suppression du souvenir');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Rendu avec un bouton qui appelle la fonction handleDelete au clic
    return (
        <div>
            <button onClick={handleDelete} alt="Supprimer"><img src={DELETE}></img></button>
        </div>
    );
};

export default DeleteMemory;
