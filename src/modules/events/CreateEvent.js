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
    const [error, setError] = useState(false); // State pour gérer les erreurs de sélection d'image

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNouvelEvenement(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateEvent = async () => {
        try {
            setError(false); // Réinitialiser error à false avant de vérifier les champs vides

            if (nouvelEvenement.titre.trim() === '' || nouvelEvenement.lieu.trim() === '' || nouvelEvenement.date_debut.trim() === '' || nouvelEvenement.description.trim() === '' || nouvelEvenement.image.trim() === ''|| nouvelEvenement.lien.trim() === '') {
                setError(true);
                return; // Sortir de la fonction s'il y a des champs vides
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
                setError(false); // Réinitialise l'état de l'erreur d'image
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
                    setError(false); // Réinitialise l'état de l'erreur d'image lors de la sélection
                }}
            />
            {/* Affichage du message d'erreur pour la sélection d'image */}
            {/* Champs de saisie pour chaque information de la tuile */}
            <input type="text" name="titre" placeholder="Titre" value={nouvelEvenement.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" placeholder="Lieu" value={nouvelEvenement.lieu} onChange={handleInputChange} />
            <input type="date" name="date_debut" placeholder="Date début (Ex: 2022-12-12)" value={nouvelEvenement.date_debut} onChange={handleInputChange} />
            <input type="date" name="date_fin" placeholder="Date fin (Ex: 2022-12-15)" value={nouvelEvenement.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={nouvelEvenement.description} onChange={handleInputChange} />
            <input type="text" name="lien" placeholder="Lien" value={nouvelEvenement.lien} onChange={handleInputChange} />

            {/* Bouton pour créer l'événement */}
            <button onClick={handleCreateEvent}>Créer l'événement</button>
            {error && (
                <div style={{ color: 'red' }}>
                        <p>"Veuillez remplir tous les champs"</p>
                </div>
            )}
        </div>
    );
};

export default CreerEvenement;


