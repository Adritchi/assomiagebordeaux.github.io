import React, { useState } from 'react';

const CreateProduct = () => {
    // Etat local pour gérer les données du nouvel événement
    const [newProduct, setNewProduct] = useState({
        imageProduit: null,
        nomProduit: '',
        prix: '',
        lien: '',
        etatProduit: false, // Initialisé comme un booléen
    });

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
                setError(false); // Réinitialisation des erreurs
                window.location.reload(); // Recharge la page
            } else {
                console.error('Erreur lors de la création de l\'événement');
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    // Rendu avec les champs de saisie et le bouton de création de produit
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <input type="text" name="nomProduit" placeholder="Nom" value={newProduct.nomProduit} onChange={handleInputChange} />
            <input type="text" name="prix" placeholder="Prix" value={newProduct.prix} onChange={handleInputChange} />
            <input type="checkbox" name="etatProduit" checked={newProduct.etatProduit} onChange={handleCheckboxChange} />
            <input type="text" name="lien" placeholder="Lien" value={newProduct.lien} onChange={handleInputChange} />
            <button onClick={handleCreateProduct}>Créer le produit</button>

            {/* Affichage des erreurs */}
            {error && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez remplir tous les champs</p>
                </div>
            )}
        </div>
    );
};

export default CreateProduct;
