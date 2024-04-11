import React, { useState } from 'react';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/design/commun/tuileShop.css';

const CreerProduit = () => {
    // Etat local pour gérer les données du nouvel événement
    const [nouveauProduit, setNouveauProduit] = useState({
        image: null,
        nom: '',
        prix: '',
        lien: '',
        estDispo: false, // Initialisé comme un booléen
    });

    // Etat de succès
    const [success, setSuccess] = useState(false);

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

                // Définir un délai avant de recharger la page
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // Attente de 3 secondes
                
                setSuccess(true); // Success
                setErreur(false); // Réinitialisation des erreurs
            } else {
                console.error('Erreur lors de la création du produit');
            }
        } catch (erreur) {
            console.error(erreur);
        }
    };
    

    // Rendu avec les champs de saisie et le bouton de création de produit
    return (
        <div className="container my-3">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Ajouter un produit</h5>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input className="form-control" type="file" id="image" accept="image/*" onChange={gererChangementImage} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">Nom</label>
                            <input className="form-control" type="text" name="nom" placeholder="Nom" value={nouveauProduit.nom} onChange={gererChangementEntree} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="prix" className="form-label">Prix</label>
                            <input className="form-control" type="text" name="prix" placeholder="Prix" value={nouveauProduit.prix} onChange={gererChangementEntree} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="etatProduit" className="form-label">Disponible</label>
                            <input type="checkbox" name="estDispo" checked={nouveauProduit.estDispo} onChange={gererChangementCheckbox} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lien" className="form-label">Lien</label>
                            <input className="form-control" type="text" name="lien" placeholder="Lien" value={nouveauProduit.lien} onChange={gererChangementEntree} />
                        </div>
                        <div className="d-grid gap-2">
                            <button className="module-tuileEvent-info-buttons-button2" onClick={creerProduit}>Créer le produit</button>
                        </div>
                    </form>
                </div>
            </div><br></br>
            {success && (
                <div className="alert alert-success" role="alert">
                    Le produit a été créé avec succès !
                </div>
            )}
            {/* Affichage des erreurs */}
            {erreur && (
                <div className="alert alert-danger" role="alert">
                    Veuillez remplir tous les champs
                </div>
            )}
        </div>
    );
};

export default CreerProduit;
