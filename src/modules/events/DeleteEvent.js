import React from 'react';

const DeleteEvent = ({ event, onDelete }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/event/${event.ID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Événement supprimé avec succès');
                window.location.reload();
            } else {
                console.error('Erreur lors de la suppression de l\'événement');
            }
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
