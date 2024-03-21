import React, { useState } from 'react';

const EditEvent = ({ event }) => {
    const [updatedEvent, setUpdatedEvent] = useState(event);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditSubmit = async () => {
        try {
            // Vérifie si tous les champs requis sont remplis
            const errors = {};
            if (updatedEvent.titre.trim() === '') {
                errors.titre = 'Le champ titre ne peut pas être vide';
            }
            if (updatedEvent.lieu.trim() === '') {
                errors.lieu = 'Le champ lieu ne peut pas être vide';
            }
            if (updatedEvent.date_debut.trim() === '') {
                errors.date_debut = 'Le champ date de début ne peut pas être vide';
            }
            if (updatedEvent.date_fin.trim() === '') {
                errors.date_fin = 'Le champ date de fin ne peut pas être vide';
            }
            if (updatedEvent.description.trim() === '') {
                errors.description = 'Le champ description ne peut pas être vide';
            }
            if (updatedEvent.lien.trim() === '') {
                errors.lien = 'Le champ lien ne peut pas être vide';
            }
    
            if (Object.keys(errors).length > 0) {
                // Met à jour l'état avec les erreurs
                setUpdatedEvent(prevState => ({
                    ...prevState,
                    ...errors
                }));
                return;
            }
            const response = await fetch(`http://localhost:3000/event/${event.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });
            window.location.reload();

            if (response.ok) {
                console.log('Événement mis à jour avec succès');
            } else {
                console.error('Erreur lors de la mise à jour de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input type="text" name="image" value={updatedEvent.image} onChange={handleInputChange} />
            <input type="text" name="titre" value={updatedEvent.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" value={updatedEvent.lieu} onChange={handleInputChange} />
            <input type="date" name="date_debut" value={updatedEvent.date_debut} onChange={handleInputChange} />
            <input type="date" name="date_fin" value={updatedEvent.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" value={updatedEvent.description} onChange={handleInputChange} />
            <input type="text" name="lien" value={updatedEvent.lien} onChange={handleInputChange} />
            <button onClick={handleEditSubmit}>Enregistrer les modifications</button>
        </div>
    );
};

export default EditEvent;
