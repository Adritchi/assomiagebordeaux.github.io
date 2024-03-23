import React, { useState } from 'react';

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
                console.log('Événement créé avec succès');
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

                setError(false); // Réinitialisation des erreurs
                setErrorDate(false); // Réinitialisation des erreurs de date
                window.location.reload(); // Recharge la page
                
            } else {
                console.error('Erreur lors de la création de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Rendu avec les champs de saisie et le bouton de création d'événement
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <input type="text" name="titre" placeholder="Titre" value={newEvent.titre} onChange={handleInputChange} />
            <input type="text" name="lieu" placeholder="Lieu" value={newEvent.lieu} onChange={handleInputChange} />
            <input type="date" name="date_debut" placeholder="Date début (Ex: 2022-12-12)" value={newEvent.date_debut} onChange={handleInputChange} />
            <input type="date" name="date_fin" placeholder="Date fin (Ex: 2022-12-15)" value={newEvent.date_fin} onChange={handleInputChange} />
            <input type="text" name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange} />
            <input type="text" name="lien" placeholder="Lien" value={newEvent.lien} onChange={handleInputChange} />
            <button onClick={handleCreateEvent}>Créer l'événement</button>

            {/* Affichage des erreurs */}
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

export default CreateEvent;
