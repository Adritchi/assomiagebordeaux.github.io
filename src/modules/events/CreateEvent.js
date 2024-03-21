import React, { useState } from 'react';

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNouvelEvenement(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateEvent = async () => {
        try {
            const response = await fetch('http://localhost:3000/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titre: nouvelEvenement.titre,
                    description: nouvelEvenement.description,
                    image: nouvelEvenement.image,
                    lien: nouvelEvenement.lien,
                    date_debut: nouvelEvenement.date_debut,
                    date_fin: nouvelEvenement.date_fin,
                    lieu: nouvelEvenement.lieu,
                }),
            });
    
            if (response.ok) {
                // Gére la réussite de la création
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
            } else {
                // Gére l'échec de la création
                console.error('Erreur lors de la création de l\'événement');
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {/* Champs de saisie pour chaque information de la tuile */}
            <input type="text" name="image" placeholder="Image (Ex: Afterwork.jpg)" value={nouvelEvenement.image} onChange={handleInputChange} />
            <input type="text" name="titre" placeholder="Titre" value={nouvelEvenement.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" placeholder="Lieu" value={nouvelEvenement.lieu} onChange={handleInputChange} />
            <input type="text" name="date_debut" placeholder="Date début (Ex: 2022-12-12)" value={nouvelEvenement.date_debut} onChange={handleInputChange} />
            <input type="text" name="date_fin" placeholder="Date fin (Ex: 2022-12-15" value={nouvelEvenement.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={nouvelEvenement.description} onChange={handleInputChange} />
            <input type="text" name="lien" placeholder="Lien" value={nouvelEvenement.lien} onChange={handleInputChange} />

            {/* Bouton pour créer l'événement */}
            <button onClick={handleCreateEvent}>Créer l'événement</button>
        </div>
    );
};

export default CreerEvenement;

