import React, { useState } from 'react';

const CreerEvenement = () => {
    const [nouvelEvenement, setNouvelEvenement] = useState({
        image: null,
        titre: '',
        lieu: '',
        date_debut: '',
        date_fin: '',
        description: '',
        lien: '',
    });

    const [error, setError] = useState(false);
    const [errorDate, setErrorDate] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNouvelEvenement(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setNouvelEvenement(prevState => ({
                ...prevState,
                image: reader.result // Stocker l'image en base64
            }));
        };

        reader.readAsDataURL(file);
    };


    const handleCreateEvent = async () => {
        try {
            setError(false);

            if (!nouvelEvenement.image || nouvelEvenement.titre.trim() === '' || nouvelEvenement.lieu.trim() === '' || nouvelEvenement.date_debut.trim() === '' || nouvelEvenement.description.trim() === '' || nouvelEvenement.lien.trim() === '') {
                setError(true);
                return;
            }
            
            if (nouvelEvenement.date_fin && nouvelEvenement.date_fin < nouvelEvenement.date_debut) {
                setErrorDate(true);
                console.error('La date de fin ne peut pas être antérieure à la date de début');
                return;
            }

            const response = await fetch('http://localhost:3000/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indiquer que le corps de la requête est du JSON
                },
                body: JSON.stringify(nouvelEvenement), // Convertir l'objet nouvelEvenement en JSON
            });

            if (response.ok) {
                console.log('Événement créé avec succès');
                setNouvelEvenement({
                    image: null,
                    titre: '',
                    lieu: '',
                    date_debut: '',
                    date_fin: '',
                    description: '',
                    lien: '',
                });
                setError(false);
                setErrorDate(false);
                window.location.reload();
            } else {
                console.error('Erreur lors de la création de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <input type="text" name="titre" placeholder="Titre" value={nouvelEvenement.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" placeholder="Lieu" value={nouvelEvenement.lieu} onChange={handleInputChange} />
            <input type="date" name="date_debut" placeholder="Date début (Ex: 2022-12-12)" value={nouvelEvenement.date_debut} onChange={handleInputChange} />
            <input type="date" name="date_fin" placeholder="Date fin (Ex: 2022-12-15)" value={nouvelEvenement.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={nouvelEvenement.description} onChange={handleInputChange} />
            <input type="text" name="lien" placeholder="Lien" value={nouvelEvenement.lien} onChange={handleInputChange} />
            <button onClick={handleCreateEvent}>Créer l'événement</button>
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

export default CreerEvenement;


