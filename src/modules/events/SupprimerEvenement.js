import React, { useState } from 'react';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import DELETE from '../../assets/icons/delete.svg';

// Récupère l'objet event en tant que prop
const SupprimerEvenement = ({ evenement }) => {
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    // Fonction handleDelete pour gérer la suppression de l'événement
    const gererSuppression = async () => {
        try {
            // Envoi d'une requête DELETE à l'API
            const reponse = await fetch(`http://localhost:3000/evenement/${evenement.ID}`, {
                method: 'DELETE', // Utilisation de la méthode DELETE
            });

            // Vérification de la réponse de la requête
            if (reponse.ok) {
                // Définir un délai avant de recharger la page
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // Attente de 3 secondes
                setDeleteSuccess(true);
            } else {
                console.error('Erreur lors de la suppression de l\'événement');
            }
        } catch (error) {
            setDeleteSuccess(false);
            console.error(error);
        }
    };

    // Rendu avec un bouton qui appelle la fonction gererSuppression au clic
    return (
        <>
            <button onClick={gererSuppression} className="btn btn-outline-danger" alt="Supprimer">
                <img src={DELETE}></img>
            </button>
            {deleteSuccess && (
                <div className="alert alert-danger" role="alert">
                    Produit supprimé avec succès !
                </div>
            )}
        </>
    );
};

export default SupprimerEvenement;
