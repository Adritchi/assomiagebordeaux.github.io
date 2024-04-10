import React, { useState } from 'react';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const EditEvent = ({ event }) => {
    const [updatedEvent, setUpdatedEvent] = useState(event);
    const [error, setError] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [updatedSuccess, setUpdatedSuccess] = useState(false);

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
                // Définir un délai avant de recharger la page
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // Attente de 3 secondes
                
                setUpdatedSuccess(true); // Success
                setErrorDate(false);
                setError(false);
            } else {
                setError(true);
                console.error('Erreur lors de la mise à jour de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container my-4">
            <form>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input className="form-control" type="file" id="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="titre" className="form-label">Titre</label>
                    <input className="form-control" type="text" id="titre" name="titre" value={updatedEvent.titre} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="lieu" className="form-label">Lieu</label>
                    <input className="form-control" type="text" id="lieu" name="lieu" value={updatedEvent.lieu} onChange={handleInputChange} />
                </div>
                <div className="row g-3">
                    <div className="col">
                        <label htmlFor="date_debut" className="form-label">Date de début</label>
                        <input className="form-control" type="date" id="date_debut" name="date_debut" value={updatedEvent.date_debut} onChange={handleInputChange} />
                    </div>
                    <div className="col">
                        <label htmlFor="date_fin" className="form-label">Date de fin</label>
                        <input className="form-control" type="date" id="date_fin" name="date_fin" value={updatedEvent.date_fin} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" rows="3" value={updatedEvent.description} onChange={handleInputChange}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="lien" className="form-label">Lien</label>
                    <input className="form-control" type="url" id="lien" name="lien" value={updatedEvent.lien} onChange={handleInputChange} />
                </div>
                <div className="d-grid gap-2">
                    <button className="module-tuileEvent-info-buttons-button2" type="button" onClick={handleEditSubmit}>Enregistrer les modifications</button>
                </div>
            </form><br></br>
            {updatedSuccess && (
                <div className="alert alert-success" role="alert">
                    L'événement a été modifié avec succès !
                </div>
            )}
            {error && <div className="alert alert-danger">Veuillez remplir tous les champs.</div>}
            {errorDate && <div className="alert alert-danger">Veuillez entrer des dates valides.</div>}
        </div>
    );
};

export default EditEvent;
