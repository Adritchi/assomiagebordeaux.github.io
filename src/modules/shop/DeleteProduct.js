
import React from 'react';

// Récupère l'objet event en tant que prop
const DeleteProduct = ({ product }) => {
    // Fonction handleDelete pour gérer la suppression de l'événement
    const handleDelete = async () => {
        try {
            // Envoi d'une requête DELETE à l'API
            const response = await fetch(`http://localhost:3000/product/${product.ID}`, {
                method: 'DELETE', // Utilisation de la méthode DELETE
            });

            // Vérification de la réponse de la requête
            if (response.ok) {
                console.log('Événement supprimé avec succès');
                window.location.reload(); // Recharge la page
            } else {
                console.error('Erreur lors de la suppression de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Rendu avec un bouton qui appelle la fonction handleDelete au clic
    return (
        <div>
            <button onClick={handleDelete}>Supprimer</button>
        </div>
    );
};

export default DeleteProduct;
