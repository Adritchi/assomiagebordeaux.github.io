import React, { useState } from 'react';

const CreerEvenement = () => {
    const [nouvelEvenement, setNouvelEvenement] = useState({
        image: '',
        titre: '',
        lieu: '',
        date: '',
        description: '',
        lien: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNouvelEvenement(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateEvent = async () => {
        try {
            const response = await fetch('http://localhost:3000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titre: nouvelEvenement.titre,
                    description: nouvelEvenement.description,
                    image: nouvelEvenement.image,
                    lien: nouvelEvenement.lien,
                    date: nouvelEvenement.date,
                    lieu: nouvelEvenement.lieu,
                }),
            });
    
            if (response.ok) {
                // Gérer la réussite de la création
                console.log('Événement créé avec succès');
                // Réinitialiser le formulaire après la création
                setNouvelEvenement({
                    image: '',
                    titre: '',
                    lieu: '',
                    date: '',
                    description: '',
                    lien: '',
                });
            } else {
                // Gérer l'échec de la création
                console.error('Erreur lors de la création de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* Champs de saisie pour chaque information de la tuile */}
            <input type="text" name="image" placeholder="URL de l'image" value={nouvelEvenement.image} onChange={handleInputChange} />
            <input type="text" name="titre" placeholder="Titre de l'événement" value={nouvelEvenement.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" placeholder="Lieu de l'événement" value={nouvelEvenement.lieu} onChange={handleInputChange} />
            <input type="text" name="date" placeholder="Date et heure de l'événement" value={nouvelEvenement.date} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description de l'événement" value={nouvelEvenement.description} onChange={handleInputChange} />
            <input type="text" name="lien" placeholder="Lien vers l'événement" value={nouvelEvenement.lien} onChange={handleInputChange} />

            {/* Bouton pour créer l'événement */}
            <button onClick={handleCreateEvent}>Créer l'événement</button>
        </div>
    );
};

export default CreerEvenement;

