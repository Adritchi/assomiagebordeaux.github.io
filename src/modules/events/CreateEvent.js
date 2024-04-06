import React, { useState } from 'react';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import CANCEL from '../../assets/icons/cancel.svg';
import '../../assets/design/commun/tuileEvent.css';

const CreateEvent = () => {
    // Etat local pour gérer les données du nouvel événement
    const [newEvent, setNewEvent] = useState({
        image: null,
        titre: '',
        lieu: '',
        date_debut: '',
        date_fin: '',
        description: '',
        lien: '',
    });

    // Etat de succès
    const [success, setSuccess] = useState(false);

    // Etat local pour gérer les erreurs de formulaire
    const [error, setError] = useState(false);
    const [errorDate, setErrorDate] = useState(false);


    // Gestion de changement pour les champs de saisie
    const handleInputChange = (e) => {
        // Extraie le nom et la valeur de l'élément déclencheur de l'event
        const { name, value } = e.target;
        // Met à jour l'état newEvent en utilisant la fonction de mise à jour avec l'ancien état
        setNewEvent(prevState => ({
            ...prevState, // Garde les valeurs précédentes des champs inchangées
            [name]: value // Met à jour la valeur du champ spécifié par son nom
        }));
    };

    // Gestion de changement pour le champ image (fichier)
    const handleImageChange = (e) => {
        // Récupère le fichier sélectionné
        const file = e.target.files[0];
        const reader = new FileReader();

        // Configure le lecteur pour lire le fichier
        reader.onloadend = () => {
            // Met à jour l'état newEvent pour inclure l'image sous forme de base64
            setNewEvent(prevState => ({
                ...prevState,
                image: reader.result // Stock l'image en base64
            }));
        };

        // Lit le contenu du fichier en tant que données URL
        reader.readAsDataURL(file);
    };

    // Gestion du clic sur le bouton "Annuler"
    const handleCancelClick = () => {
        setNewEvent(false);
    };

    // Gestion de la création d'event
    const handleCreateEvent = async () => {
        try {
            setError(false); // Réinitialisation des erreurs

            // Vérification de la saisie des champs obligatoires
            if (!newEvent.image || newEvent.titre.trim() === '' || newEvent.lieu.trim() === '' || newEvent.date_debut.trim() === '' || newEvent.description.trim() === '' || newEvent.lien.trim() === '') {
                setError(true);
                return;
            }

            // Vérification de la validité des dates
            if (newEvent.date_fin && newEvent.date_fin < newEvent.date_debut) {
                setErrorDate(true);
                console.error('La date de fin ne peut pas être antérieure à la date de début');
                return;
            }

            // Envoi d'une requête POST
            const response = await fetch('http://localhost:3000/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indique à la requête que c'est du JSON
                },
                body: JSON.stringify(newEvent), // Converti l'objet newEvent en JSON
            });

            // Vérification de la réponse de la requête
            if (response.ok) {
                // Réinitialisation des champs après la création réussie
                setNewEvent({
                    image: null,
                    titre: '',
                    lieu: '',
                    date_debut: '',
                    date_fin: '',
                    description: '',
                    lien: '',
                });

                // Définir un délai avant de recharger la page
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // Attente de 3 secondes
                
                setSuccess(true); // Success
                setError(false); // Réinitialisation des erreurs
                setErrorDate(false); // Réinitialisation des erreurs de date                
            } else {
                console.error('Erreur lors de la création de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Rendu avec les champs de saisie et le bouton de création d'événement
    return (
        <div className="container my-3">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Ajouter un événement</h5>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input className="form-control" type="file" id="image" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="titre" className="form-label">Titre</label>
                            <input className="form-control" type="text" id="titre" name="titre" placeholder="Titre" value={newEvent.titre} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lieu" className="form-label">Lieu</label>
                            <input className="form-control" type="text" id="lieu" name="lieu" placeholder="Lieu" value={newEvent.lieu} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date_debut" className="form-label">Date de début</label>
                            <input className="form-control" type="date" id="date_debut" name="date_debut" value={newEvent.date_debut} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date_fin" className="form-label">Date de fin</label>
                            <input className="form-control" type="date" id="date_fin" name="date_fin" value={newEvent.date_fin} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" id="description" name="description" rows="3" placeholder="Description" value={newEvent.description} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lien" className="form-label">Lien</label>
                            <input className="form-control" type="url" id="lien" name="lien" placeholder="Lien" value={newEvent.lien} onChange={handleInputChange} />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="button" onClick={handleCancelClick}>
                                <img src={CANCEL} alt="Annuler" />
                            </button>
                            <button className="module-tuileEvent-info-buttons-button2" type="button" onClick={handleCreateEvent}>Ajouter l'événement</button>
                        </div>
                    </form>
                </div>
            </div>
            {success && (
                <div className="alert alert-success" role="alert">
                    L'événement a été créé avec succès !
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    Veuillez remplir tous les champs.
                </div>
            )}
            {errorDate && (
                <div className="alert alert-danger" role="alert">
                    Veuillez entrer des dates valides.
                </div>
            )}
        </div>
    );
};

export default CreateEvent;
