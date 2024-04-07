import React, { useState } from 'react';

const CreerProduit = () => {
    // Etat local pour gérer les données du nouvel événement
    const [nouveauProduit, setNouveauProduit] = useState({
        image: null,
        nom: '',
        prix: '',
        lien: '',
        estDispo: false, // Initialisé comme un booléen
    });

    // Etat local pour gérer les erreurs de formulaire
    const [erreur, setErreur] = useState(false);

    // Gestion de changement pour la case à cocher
    const gererChangementCheckbox = () => {
        setNouveauProduit(prevState => ({
            ...prevState,
            estDispo: !prevState.estDispo // Inverse l'état actuel
        }));
    };

    // Gestion de changement pour les champs de saisie
    const gererChangementEntree = (element) => {
        // Extraie le nom et la valeur de l'élément déclencheur de l'event
        const { name, value } = element.target;

        // Vérification si le champ est "prix" et si la valeur est numérique ou float
        if (name === 'prix' && (!isNaN(value) || (value === '' || /^\d*\.?\d*$/.test(value)))) {
            // Met à jour l'état nouveauProduit en utilisant la fonction de mise à jour avec l'ancien état
            setNouveauProduit(prevState => ({
                ...prevState, // Garde les valeurs précédentes des champs inchangées
                [name]: value // Met à jour la valeur du champ spécifié par son nom
            }));
        } else if (name !== 'prix') {
            // Si le champ n'est pas "prix", met à jour l'état directement sans vérification
            setNouveauProduit(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Gestion de changement pour le champ image (fichier)
    const gererChangementImage = (element) => {
        // Récupère le fichier sélectionné
        const fichier = element.target.files[0];
        const lecteur = new FileReader();

        // Configure le lecteur pour lire le fichier
        lecteur.onloadend = () => {
            // Met à jour l'état pour inclure l'image sous forme de base64
            setNouveauProduit(prevState => ({
                ...prevState,
                image: lecteur.result // Stock l'image en base64
            }));
        };

        // Lit le contenu du fichier en tant que données URL
        lecteur.readAsDataURL(fichier);
    };

    // Gestion de la création de produit
    const creerProduit = async () => {
        try {
            setErreur(false);
            // Vérification de la saisie des champs obligatoires
            if (!nouveauProduit.image || nouveauProduit.nom === '' || nouveauProduit.lien === '' || nouveauProduit.prix === '') {
                setErreur(true);
                return;
            }
            
            // Envoi d'une requête POST avec la version modifiée de l'objet nouveauProduit
            const reponse = await fetch('http://localhost:3000/produit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indique à la requête que c'est du JSON
                },
                body: JSON.stringify(nouveauProduit), // Converti l'objet nouveauProduit en JSON
            });
            // Vérification de la réponse de la requête
            if (reponse.ok) {
                // Réinitialisation des champs après la création réussie
                setNouveauProduit({
                    image: null,
                    nom: '',
                    prix: '',
                    estDispo: '',
                    lien: '',
                });
                setErreur(false); // Réinitialisation des erreurs
                window.location.reload(); // Recharge la page
            } else {
                console.error('Erreur lors de la création du produit');
            }
        } catch (erreur) {
            console.error(erreur);
        }
    };
    

    // Rendu avec les champs de saisie et le bouton de création de produit
    return (
        <div>
            <input type="file" accept="image/*" onChange={gererChangementImage} />
            <br></br>
            <br></br>
            <input type="text" name="nom" placeholder="Nom" value={nouveauProduit.nom} onChange={gererChangementEntree} />
            <input type="text" name="prix" placeholder="Prix" value={nouveauProduit.prix} onChange={gererChangementEntree} />
            <input type="checkbox" name="estDispo" checked={nouveauProduit.estDispo} onChange={gererChangementCheckbox} />
            <input type="text" name="lien" placeholder="Lien" value={nouveauProduit.lien} onChange={gererChangementEntree} />
            <br></br>
            <br></br>
            <button onClick={creerProduit}>Créer le produit</button>

            {/* Affichage des erreurs */}
            {erreur && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez remplir tous les champs</p>
                </div>
            )}
        </div>
    );
};

export default CreerProduit;
