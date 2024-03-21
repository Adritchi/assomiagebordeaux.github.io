import React, { useState } from 'react';
import ImageDropdown from '../../pages/utilitaires/ImageDropdown';

const CreerEvenement = () => {
    const [nouvelEvenement, setNouvelEvenement] = useState({
        image: '',
        titre: '',
        lieu: '',
        date_debut: '',
        date_fin: '',
        description: '',
        lien: '',
    });
    const [imageError, setImageError] = useState(false); // State pour gérer les erreurs de sélection d'image

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNouvelEvenement(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateEvent = async () => {
        try {
            // Vérifie si tous les champs requis sont remplis
            const errors = {};
            if (nouvelEvenement.titre.trim() === '') {
                errors.titre = 'Le champ titre ne peut pas être vide';
            }
            if (nouvelEvenement.lieu.trim() === '') {
                errors.lieu = 'Le champ lieu ne peut pas être vide';
            }
            if (nouvelEvenement.date_debut.trim() === '') {
                errors.date_debut = 'Le champ date de début ne peut pas être vide';
            }
            if (nouvelEvenement.date_fin.trim() === '') {
                errors.date_fin = 'Le champ date de fin ne peut pas être vide';
            }
            if (nouvelEvenement.description.trim() === '') {
                errors.description = 'Le champ description ne peut pas être vide';
            }
            if (nouvelEvenement.lien.trim() === '') {
                errors.lien = 'Le champ lien ne peut pas être vide';
            }
            if (nouvelEvenement.image.trim() === '') {
                setImageError(true); // Définit l'erreur si aucune image n'est sélectionnée
                return; // Arrête le traitement si une image n'est pas sélectionnée
            }

            if (Object.keys(errors).length > 0 || imageError) {
                // Met à jour l'état avec les erreurs
                setNouvelEvenement(prevState => ({
                    ...prevState,
                    ...errors
                }));
                return;
            }

            // Si tous les champs requis sont remplis, continuez avec la logique de création de l'événement
            const response = await fetch('http://localhost:3000/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nouvelEvenement),
            });

            if (response.ok) {
                // Gère la réussite de la création
                console.log('Événement créé avec succès');
                // Réinitialise le formulaire après la création
                setNouvelEvenement({
                    image: '',
                    titre: '',
                    lieu: '',
                    date_debut: '',
                    date_fin: '',
                    description: '',
                    lien: '',
                });
                setImageError(false); // Réinitialise l'état de l'erreur d'image
                window.location.reload();
            } else {
                // Gère l'échec de la création
                console.error('Erreur lors de la création de l\'événement');
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
                value={nouvelEvenement.image}
                onChange={(e) => {
                    setNouvelEvenement(prevState => ({
                        ...prevState,
                        [e.target.name]: e.target.value
                    }));
                    setImageError(false); // Réinitialise l'état de l'erreur d'image lors de la sélection
                }}
            />
            {/* Affichage du message d'erreur pour la sélection d'image */}
            {imageError && (
                <div style={{ color: 'red' }}>
                    Veuillez sélectionner une image
                </div>
            )}
            {/* Champs de saisie pour chaque information de la tuile */}
            <input type="text" name="titre" placeholder="Titre" value={nouvelEvenement.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" placeholder="Lieu" value={nouvelEvenement.lieu} onChange={handleInputChange} />
            <input type="text" name="date_debut" placeholder="Date début (Ex: 2022-12-12)" value={nouvelEvenement.date_debut} onChange={handleInputChange} />
            <input type="text" name="date_fin" placeholder="Date fin (Ex: 2022-12-15)" value={nouvelEvenement.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={nouvelEvenement.description} onChange={handleInputChange} />
            <input type="text" name="lien" placeholder="Lien" value={nouvelEvenement.lien} onChange={handleInputChange} />

            {/* Bouton pour créer l'événement */}
            <button onClick={handleCreateEvent}>Créer l'événement</button>
        </div>
    );
};

export default CreerEvenement;
