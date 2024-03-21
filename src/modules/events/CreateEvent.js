import React, { useState, useEffect } from 'react';
import ImageDropdown from '../../pages/utilitaires/imageDropdown';

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
        // Votre logique pour créer un événement
    };

    return (
        <div>
            <ImageDropdown/>
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
