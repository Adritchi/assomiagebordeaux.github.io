import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DELETE from '../../assets/icons/delete.svg';

// Récupère l'objet event en tant que prop
const SuppressionProduit = ({ produit }) => {
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    // Fonction gererSuppression pour gérer la suppression de l'événement
    const gererSuppression = async () => {
        try {
            // Envoi d'une requête DELETE à l'API
            const reponse = await fetch(`http://localhost:3000/produit/${produit.ID}`, {
                method: 'DELETE', // Utilisation de la méthode DELETE
            });

            // Vérification de la réponse de la requête
            if (reponse.ok) {
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // Attente de 3 secondes
                setDeleteSuccess(true);
            } else {
                console.error('Erreur lors de la suppression de l\'événement');
            }
        } catch (erreur) {
            console.error(erreur);
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

export default SuppressionProduit;
