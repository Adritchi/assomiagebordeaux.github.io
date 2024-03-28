import React, { useState } from 'react';

const EditProduct = ({ product }) => {
    const [updatedProduct, setUpdatedProduct] = useState({
        ...product, // Utiliser les valeurs initiales du produit
    });
    const [error, setError] = useState(false);

    const handleCheckboxChange = () => {
        setUpdatedProduct(prevState => ({
            ...prevState,
            etatProduit: !prevState.etatProduit // Inverse l'état actuel
        }));
    };         

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Vérification si le champ est "prix" et si la valeur est numérique ou float
        if (name === 'prix' && (!isNaN(value) || (value === '' || /^\d*\.?\d*$/.test(value)))) {
            // Met à jour l'état updatedProduct en utilisant la fonction de mise à jour avec l'ancien état
            setUpdatedProduct(prevState => ({
                ...prevState,
                [name]: value // Met à jour la valeur du champ spécifié par son nom
            }));
        } else if (name !== 'prix') {
            // Si le champ n'est pas "prix", met à jour l'état directement sans vérification
            setUpdatedProduct(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setUpdatedProduct(prevState => ({
                ...prevState,
                imageProduit: reader.result // Mettre à jour l'image avec le contenu base64
            }));
        };
        reader.readAsDataURL(imageFile);
    };

    const handleEditSubmit = async () => {
        try {
            setError(false);
            if (updatedProduct.nomProduit === '' || updatedProduct.lien === '' || updatedProduct.prix === '') {
                setError(true);
                return;
            }
            
            const response = await fetch(`http://localhost:3000/product/${product.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct), // Utilisation de la version modifiée de l'objet
            });
    
            if (response.ok) {
                console.log('Événement mis à jour avec succès');
                setError(false);
                window.location.reload();
            } else {
                console.error('Erreur lors de la mise à jour du produit');
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <input type="text" name="nomProduit" value={updatedProduct.nomProduit} onChange={handleInputChange} />
            <input type="text" name="prix" value={updatedProduct.prix} onChange={handleInputChange} />
            <input type="checkbox" name="etatProduit" checked={updatedProduct.etatProduit} onChange={handleCheckboxChange} />            
            <input type="text" name="lien" value={updatedProduct.lien} onChange={handleInputChange} />
            <button onClick={handleEditSubmit}>Enregistrer les modifications</button>
            
            {/* Rendu conditionnel du label d'erreur */}
            {error && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez remplir tous les champs</p>
                </div>
            )}
        </div>
    );
};

export default EditProduct;
