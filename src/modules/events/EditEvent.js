import React, { useState } from 'react';
import ImageDropdown from '../../pages/utilitaires/ImageDropdown';

const EditEvent = ({ event, onUpdate }) => {
    const [updatedEvent, setUpdatedEvent] = useState(event);
    const [error, setError] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

const handleEditSubmit = async () => {
    try {
        setError(false); // Réinitialiser error à false avant de vérifier les champs vides

        if (updatedEvent.titre.trim() === '' || updatedEvent.lieu.trim() === '' || updatedEvent.date_debut.trim() === '' || updatedEvent.description.trim() === '' || updatedEvent.image.trim() === ''||updatedEvent.lien.trim() === '') {
            setError(true);
            return; // Sortir de la fonction s'il y a des champs vides
        }

        const response = await fetch(`http://localhost:3000/event/${event.ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent),
        });

        if (response.ok) {
            console.log('Événement mis à jour avec succès');
            window.location.reload();
        } else {
            console.error('Erreur lors de la mise à jour de l\'événement');
        }
    } catch (error) {
        console.error(error);
    }
};


    return (
        <div>
            <ImageDropdown
                name="image"
                placeholder="Image (Ex: Afterwork.jpg)"
                value={updatedEvent.image}
                onChange={(e) => setUpdatedEvent(prevState => ({
                    ...prevState,
                    [e.target.name]: e.target.value
                }))}
            />
            <input type="text" name="titre" value={updatedEvent.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" value={updatedEvent.lieu} onChange={handleInputChange} />
            <input type="date" name="date_debut" value={updatedEvent.date_debut} onChange={handleInputChange} />
            <input type="date" name="date_fin" value={updatedEvent.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" value={updatedEvent.description} onChange={handleInputChange} />
            <input type="text" name="lien" value={updatedEvent.lien} onChange={handleInputChange} />
            <button onClick={handleEditSubmit}>Enregistrer les modifications</button>
            
            {/* Rendu conditionnel du label d'erreur */}
            {error && (
                <div style={{ color: 'red' }}>
                        <p>"Veuillez remplir tous les champs"</p>
                </div>
            )}
        </div>
    );
};

export default EditEvent;
