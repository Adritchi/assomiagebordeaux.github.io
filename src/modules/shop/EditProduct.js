import React, { useState } from 'react';

const EditProduct = ({ product }) => {
    const [updatedProduct, setUpdatedProduct] = useState(product);
    const [error, setError] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setUpdatedProduct(prevState => ({
                ...prevState,
                image: reader.result // Mettre à jour l'image avec le contenu base64
            }));
        };
        reader.readAsDataURL(imageFile);
    };

    const handleEditSubmit = async () => {
        try {
            setError(false);
            if (updatedProduct.nom === '' || updatedProduct.lien === '' || updatedProduct.prix === '' || updatedEvent.estDispo === '') {
                setError(true);
                return;
            }
            const response = await fetch(`http://localhost:3000/product/${product.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
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
            <input type="text" name="nom" value={updatedProduct.nom} onChange={handleInputChange} />
            <input type="text" name="prix" value={updatedProduct.prix} onChange={handleInputChange} />
            <input type="checkbox" name="estDispo" checked={updatedProduct.estDispo} onChange={handleInputChange} />            
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
