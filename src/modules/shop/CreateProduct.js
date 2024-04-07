import React, { useState } from 'react';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import CANCEL from '../../assets/icons/cancel.svg';
import '../../assets/design/commun/tuileShop.css';

const CreateProduct = () => {
    // Etat local pour gérer les données du nouvel événement
    const [newProduct, setNewProduct] = useState({
        imageProduit: null,
        nomProduit: '',
        prix: '',
        lien: '',
        etatProduit: false, // Initialisé comme un booléen
    });

    // Etat de succès
    const [success, setSuccess] = useState(false);

    // Etat local pour gérer les erreurs de formulaire
    const [error, setError] = useState(false);

    // Gestion de changement pour la case à cocher
    const handleCheckboxChange = () => {
        setNewProduct(prevState => ({
            ...prevState,
            etatProduit: !prevState.etatProduit // Inverse l'état actuel
        }));
    };

    // Gestion de changement pour les champs de saisie
    const handleInputChange = (e) => {
        // Extraie le nom et la valeur de l'élément déclencheur de l'event
        const { name, value } = e.target;

        // Vérification si le champ est "prix" et si la valeur est numérique ou float
        if (name === 'prix' && (!isNaN(value) || (value === '' || /^\d*\.?\d*$/.test(value)))) {
            // Met à jour l'état newProduct en utilisant la fonction de mise à jour avec l'ancien état
            setNewProduct(prevState => ({
                ...prevState, // Garde les valeurs précédentes des champs inchangées
                [name]: value // Met à jour la valeur du champ spécifié par son nom
            }));
        } else if (name !== 'prix') {
            // Si le champ n'est pas "prix", met à jour l'état directement sans vérification
            setNewProduct(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Gestion de changement pour le champ image (fichier)
    const handleImageChange = (e) => {
        // Récupère le fichier sélectionné
        const file = e.target.files[0];
        const reader = new FileReader();

        // Configure le lecteur pour lire le fichier
        reader.onloadend = () => {
            // Met à jour l'état newEvent pour inclure l'image sous forme de base64
            setNewProduct(prevState => ({
                ...prevState,
                imageProduit: reader.result // Stock l'image en base64
            }));
        };

        // Lit le contenu du fichier en tant que données URL
        reader.readAsDataURL(file);
    };

    // Gestion du clic sur le bouton "Annuler"
    const handleCancelClick = () => {
        setNewProduct(false);
    };

    // Gestion de la création de produit
    const handleCreateProduct = async () => {
        try {
            setError(false);
            // Vérification de la saisie des champs obligatoires
            if (!newProduct.imageProduit || newProduct.nomProduit.trim() === '' || newProduct.lien.trim() === '' || newProduct.prix.trim() === '') {
                setError(true);
                return;
            }
            
            // Envoi d'une requête POST avec la version modifiée de l'objet newProduct
            const response = await fetch('http://localhost:3000/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indique à la requête que c'est du JSON
                },
                body: JSON.stringify(newProduct), // Converti l'objet newProduct en JSON
            });
            // Vérification de la réponse de la requête
            if (response.ok) {
                // Réinitialisation des champs après la création réussie
                setNewProduct({
                    imageProduit: null,
                    nomProduit: '',
                    prix: '',
                    etatProduit: '',
                    lien: '',
                });

                // Définir un délai avant de recharger la page
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // Attente de 3 secondes
                
                setSuccess(true); // Success
                setError(false); // Réinitialisation des erreurs
            } else {
                console.error('Erreur lors de la création de l\'événement');
            }
        } catch (error) {
            console.error(error);
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
                            <input className="form-control" type="file" id="image" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">Nom</label>
                            <input className="form-control" type="text" name="nomProduit" placeholder="Nom" value={newProduct.nomProduit} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="prix" className="form-label">Prix</label>
                            <input className="form-control" type="text" name="prix" placeholder="Prix" value={newProduct.prix} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="etatProduit" className="form-label">Disponible</label>
                            <input type="checkbox" name="etatProduit" checked={newProduct.etatProduit} onChange={handleCheckboxChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lien" className="form-label">Lien</label>
                            <input className="form-control" type="text" name="lien" placeholder="Lien" value={newProduct.lien} onChange={handleInputChange} />
                        </div>
                        <div className="d-grid gap-2">
                            <button className="module-tuileEvent-info-buttons-button2" onClick={handleCreateProduct}>Créer le produit</button>
                            <button type="button" onClick={handleCancelClick}>
                                <img src={CANCEL} alt="Annuler" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {success && (
                <div className="alert alert-success" role="alert">
                    Le produit a été créé avec succès !
                </div>
            )}
            {/* Affichage des erreurs */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    Veuillez remplir tous les champs
                </div>
            )}
        </div>
    );
};

export default CreateProduct;
