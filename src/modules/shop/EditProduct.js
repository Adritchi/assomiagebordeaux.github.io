import React, { useState } from 'react';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/design/commun/tuileShop.css';

const EditProduct = ({ product }) => {
    const [updatedProduct, setUpdatedProduct] = useState({
        ...product, // Utiliser les valeurs initiales du produit
    });
    const [error, setError] = useState(false);
    const [updatedSuccess, setUpdatedSuccess] = useState(false);

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
                // Définir un délai avant de recharger la page
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // Attente de 3 secondes
                
                setUpdatedSuccess(true); // Success
                setError(false);
            } else {
                setError(true);
                console.error('Erreur lors de la mise à jour du produit');
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    return (
        <div className="container my-4">
            <form>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label label-shop">Image</label>
                    <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="nomProduit" className="form-label label-shop">Nom</label>
                    <input className="form-control" type="text" name="nomProduit" value={updatedProduct.nomProduit} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="prix" className="form-label label-shop">Prix</label>
                    <input className="form-control" type="text" name="prix" value={updatedProduct.prix} onChange={handleInputChange} />
                </div>
                <div className="row g-3">
                    <div className="mb-3">
                        <label htmlFor="lien" className="form-label label-shop">Lien</label>
                        <input className="form-control" type="text" name="lien" value={updatedProduct.lien} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="col">
                    <label htmlFor="etatProduit" className="form-label label-shop">Disponible</label>
                    <input type="checkbox" name="etatProduit" checked={updatedProduct.etatProduit} onChange={handleCheckboxChange} />
                </div>
                <div className="d-grid gap-2">
                    <button className="module-tuileEvent-info-buttons-button2" type="button" onClick={handleEditSubmit}>Enregistrer les modifications</button>
                </div>
            </form>
            {updatedSuccess && (
                <div className="alert alert-success" role="alert">
                    Le produit a été modifié avec succès !
                </div>
            )}
            {/* Rendu conditionnel du label d'erreur */}
            {error && <div className="alert alert-danger">Veuillez remplir tous les champs.</div>}
        </div>
    );
};

export default EditProduct;
