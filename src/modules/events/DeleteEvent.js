import React from 'react';

const DeleteEvent = ({ event, onDelete }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/event/${event.ID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Événement supprimé avec succès');
                onDelete(event.ID); // Appel de la fonction onDelete avec l'ID de l'événement supprimé
            } else {
                console.error('Erreur lors de la suppression de l\'événement');
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <button onClick={handleDelete}>Supprimer</button>
        </div>
    );
};

export default DeleteEvent;
