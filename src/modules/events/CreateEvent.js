import React, { useState } from 'react';
import '../../assets/design/commun/tuileEvent.css';

const creerEvenement = () => {
    // Etat local pour gérer les données du nouvel événement
    const [nouveauEvenement, setNouveauEvenement] = useState({
        image: null,
        titre: '',
        lieu: '',
        date_debut: '',
        date_fin: '',
        description: '',
        lien: '',
    });

    // Etat local pour gérer les erreurs de formulaire
    const [erreur, setErreur] = useState(false);
    const [erreurDate, setErreurDate] = useState(false);

    // Gestion de changement pour les champs de saisie
    const gererChangementEntree = (element) => {
        // Extraie le nom et la valeur de l'élément déclencheur de l'event
        const { name, value } = element.target;
        // Met à jour l'état nouveauEvenement en utilisant la fonction de mise à jour avec l'ancien état
        setNouveauEvenement(prevState => ({
            ...prevState, // Garde les valeurs précédentes des champs inchangées
            [name]: value // Met à jour la valeur du champ spécifié par son nom
        }));
    };

    // Gestion de changement pour le champ image (fichier)
    const gererChangementImage = (element) => {
        // Récupère le fichier sélectionné
        const fichier = element.target.files[0];
        const lecteur = new FileReader();

        // Configure le lecteur pour lire le fichier
        lecteur.onloadend = () => {
            // Met à jour l'état newEvent pour inclure l'image sous forme de base64
            setNouveauEvenement(prevState => ({
                ...prevState,
                image: lecteur.result // Stock l'image en base64
            }));
        };

        // Lit le contenu du fichier en tant que données URL
        lecteur.readAsDataURL(fichier);
    };


    // Gestion de la création d'event
    const gererCreationEvenement = async () => {
        try {
            setErreur(false); // Réinitialisation des erreurs

            // Vérification de la saisie des champs obligatoires
            if (!nouveauEvenement.image || nouveauEvenement.titre.trim() === '' || nouveauEvenement.lieu.trim() === '' || nouveauEvenement.date_debut.trim() === '' || nouveauEvenement.description.trim() === '' || nouveauEvenement.lien.trim() === '') {
                setErreur(true);
                return;
            }

            // Vérification de la validité des dates
            if (nouveauEvenement.date_fin && nouveauEvenement.date_fin < nouveauEvenement.date_debut) {
                setErreurDate(true);
                console.error('La date de fin ne peut pas être antérieure à la date de début');
                return;
            }

            // Envoi d'une requête POST
            const reponse = await fetch('http://localhost:3000/evenement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indique à la requête que c'est du JSON
                },
                body: JSON.stringify(nouveauEvenement), // Converti l'objet newEvent en JSON
            });

            // Vérification de la réponse de la requête
            if (reponse.ok) {
                console.log('Événement créé avec succès');
                // Réinitialisation des champs après la création réussie
                setNouveauEvenement({
                    image: null,
                    titre: '',
                    lieu: '',
                    date_debut: '',
                    date_fin: '',
                    description: '',
                    lien: '',
                });

                setErreur(false); // Réinitialisation des erreurs
                setErreurDate(false); // Réinitialisation des erreurs de date
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
            <input type="file" accept="image/*" onChange={gererChangementImage} />
            <br></br>
            <br></br>
            <input type="text" name="titre" placeholder="Titre" value={nouveauEvenement.titre} onChange={gererChangementEntree} />
            <input type="text" name="lieu" placeholder="Lieu" value={nouveauEvenement.lieu} onChange={gererChangementEntree} />
            <input type="date" name="date_debut" placeholder="Date début (Ex: 2022-12-12)" value={nouveauEvenement.date_debut} onChange={gererChangementEntree} />
            <input type="date" name="date_fin" placeholder="Date fin (Ex: 2022-12-15)" value={nouveauEvenement.date_fin} onChange={gererChangementEntree} />
            <input type="text" name="description" placeholder="Description" value={nouveauEvenement.description} onChange={gererChangementEntree} />
            <input type="text" name="lien" placeholder="Lien" value={nouveauEvenement.lien} onChange={gererChangementEntree} />
            <br></br>
            <br></br>
            <button onClick={gererCreationEvenement}>Ajouter l'événement</button>

            {/* Affichage des erreurs */}
            {erreur && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez remplir tous les champs</p>
                </div>
            )}
            {erreurDate && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez entrer des dates valides</p>
                </div>
            )}
        </div>
    );
};

export default creerEvenement;
