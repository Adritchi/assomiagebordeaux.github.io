import React, { useState } from 'react';

const EditEvent = ({ event }) => {
    const [updatedEvent, setUpdatedEvent] = useState(event);
    const [error, setError] = useState(false);
    const [errorDate, setErrorDate] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setUpdatedEvent(prevState => ({
                ...prevState,
                image: reader.result // Mettre à jour l'image avec le contenu base64
            }));
        };
        reader.readAsDataURL(imageFile);
    };

    const handleEditSubmit = async () => {
        try {
            setError(false);
            if (updatedEvent.titre === '' || updatedEvent.lieu === '' || updatedEvent.date_debut === '1970-01-01' || updatedEvent.description === '' || updatedEvent.lien === '') {
                setError(true);
                return;
            }
            if (updatedEvent.date_fin && updatedEvent.date_fin < updatedEvent.date_debut) {
                setErrorDate(true);
                return;
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
                setErrorDate(false);
                setError(false);
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
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
                    <p>Veuillez remplir tous les champs</p>
                </div>
            )}
            {errorDate && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez entrer des dates valides</p>
                </div>
            )}
        </div>
    );
};

export default EditEvent;
