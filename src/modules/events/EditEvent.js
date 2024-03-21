import React, { useState } from 'react';

const EditEvent = ({ event, onUpdate }) => {
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
            const response = await fetch(`http://localhost:3000/event/${event.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEvent),
            });

            if (response.ok) {
                console.log('Événement mis à jour avec succès');
                onUpdate(updatedEvent); 
            } else {
                console.error('Erreur lors de la mise à jour de l\'événement');
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input type="text" name="titre" value={updatedEvent.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" value={updatedEvent.lieu} onChange={handleInputChange} />
            <input type="text" name="date_debut" value={updatedEvent.date_debut} onChange={handleInputChange} />
            <input type="text" name="date_fin" value={updatedEvent.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" value={updatedEvent.description} onChange={handleInputChange} />
            <input type="text" name="lien" value={updatedEvent.lien} onChange={handleInputChange} />
            <button onClick={handleEditSubmit}>Enregistrer les modifications</button>
        </div>
    );
};

export default EditEvent;
