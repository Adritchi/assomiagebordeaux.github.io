import React, { useState } from 'react';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import DELETE from '../../assets/icons/delete.svg';

// Récupère l'objet event en tant que prop
const DeleteMemory = ({ memory }) => {
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    // Fonction handleDelete pour gérer la suppression de l'événement
    const handleDelete = async () => {
        try {
            // Envoi d'une requête DELETE à l'API
            const response = await fetch(`http://localhost:3000/memory/${memory.ID}`, {
                method: 'DELETE', // Utilisation de la méthode DELETE
            });

            // Vérification de la réponse de la requête
            if (response.ok) {
                // Définir un délai avant de recharger la page
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // Attente de 3 secondes
                setDeleteSuccess(true);
            } else {
                console.error('Erreur lors de la suppression du souvenir');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Rendu avec un bouton qui appelle la fonction handleDelete au clic
    return (
        <>
            <button onClick={handleDelete} alt="Supprimer" className="btn btn-memories btn-outline-danger-memories">
                <img src={DELETE}></img>
            </button>
            {deleteSuccess && (
                <div className="alert alert-danger" role="alert">
                    Souvenir supprimé avec succès !
                </div>
            )}
        </>
    );
};

export default DeleteMemory;
