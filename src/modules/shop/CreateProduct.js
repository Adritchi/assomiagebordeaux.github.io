import React, { useState } from 'react';

const CreateProduct = () => {
    // Etat local pour gérer les données du nouvel événement
    const [newProduct, setNewProduct] = useState({
        image: null,
        nom: '',
        prix: '',
        lien: '',
        estDispo: '',
    });

    // Etat local pour gérer les erreurs de formulaire
    const [error, setError] = useState(false);

    // Gestion de changement pour les champs de saisie
    const handleInputChange = (e) => {
        // Extraie le nom et la valeur de l'élément déclencheur de l'event
        const { name, value } = e.target;
        // Met à jour l'état newEvent en utilisant la fonction de mise à jour avec l'ancien état
        setNewProduct(prevState => ({
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
            setNewProduct(prevState => ({
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
            if (!newProduct.image || newProduct.nom.trim() === '' || newProduct.lien.trim() === '' || newEvent.prix.trim() === '' || newEvent.estDispo.trim() === '') {
                setError(true);
                return;
            }

            // Envoi d'une requête POST
            const response = await fetch('http://localhost:3000/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indique à la requête que c'est du JSON
                },
                body: JSON.stringify(newProduct), // Converti l'objet newEvent en JSON
            });

            // Vérification de la réponse de la requête
            if (response.ok) {
                // Réinitialisation des champs après la création réussie
                setNewProduct({
                    image: null,
                    nom: '',
                    prix: '',
                    estDispo: '',
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

    // Rendu avec les champs de saisie et le bouton de création d'événement
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <input type="text" name="nom" placeholder="Nom" value={newProduct.nom} onChange={handleInputChange} />
            <input type="date" name="prix" placeholder="Prix" value={newProduct.prix} onChange={handleInputChange} />
            <input type="checkbox" name="estDispo" checked={newProduct.estDispo} onChange={handleInputChange} />            
            <input type="text" name="lien" placeholder="Lien" value={newProduct.lien} onChange={handleInputChange} />
            <button onClick={handleCreateEvent}>Créer l'événement</button>

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
