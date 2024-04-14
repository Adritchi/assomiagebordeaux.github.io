import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/design/commun/tuileShop.css';

const EditerProduit = ({ produit }) => {
    const [produitModifie, setProduitModifie] = useState({
        ...produit, // Utiliser les valeurs initiales du produit
    });
    const [erreur, setErreur] = useState(false);
    const [updatedSuccess, setUpdatedSuccess] = useState(false);

    const gererChangementCheckbox  = () => {
        setProduitModifie(prevState => ({
            ...prevState,
            estDispo: !prevState.estDispo // Inverse l'état actuel
        }));
    };         

    const gererChangementEntree = (element) => {
        const { name, value } = element.target;

        // Vérification si le champ est "prix" et si la valeur est numérique ou float
        if (name === 'prix' && (!isNaN(value) || (value === '' || /^\d*\.?\d*$/.test(value)))) {
            // Met à jour l'état produitModifie en utilisant la fonction de mise à jour avec l'ancien état
            setProduitModifie(prevState => ({
                ...prevState,
                [name]: value // Met à jour la valeur du champ spécifié par son nom
            }));
        } else if (name !== 'prix') {
            // Si le champ n'est pas "prix", met à jour l'état directement sans vérification
            setProduitModifie(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const gererChangementImage  = (element) => {
        const fichierImage = element.target.files[0];
        const lecteur = new FileReader();
        lecteur.onload = () => {
            setProduitModifie(prevState => ({
                ...prevState,
                image: lecteur.result // Mettre à jour l'image avec le contenu base64
            }));
        };
        lecteur.readAsDataURL(fichierImage);
    };

    const gererEnvoiEdition = async () => {
        try {
            setErreur(false);
            if (produitModifie.nom === '' || produitModifie.lien === '' || produitModifie.prix === '' ) {
                setErreur(true);
                return;
            }
            
            const reponse = await fetch(`http://localhost:3000/produit/${produit.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produitModifie), // Utilisation de la version modifiée de l'objet
            });
    
            if (reponse.ok) {
                setUpdatedSuccess(true); // Success
                setErreur(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // Attente de 3 secondes
            } else {
                console.error('Erreur lors de la mise à jour du produit');
                setErreur(true);
            }
        } catch (erreur) {
            console.error(erreur);
        }
    };
    

    return (
        <div className="container my-4">
            <form>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label label-shop">Image</label>
                    <input className="form-control" type="file" accept="image/*" onChange={gererChangementImage} />
                </div>
                <div className="mb-3">
                    <label htmlFor="nom" className="form-label label-shop">Nom</label>
                    <input className="form-control" type="text" name="nom" value={produitModifie.nom} onChange={gererChangementEntree} />
                </div>
                <div className="mb-3">
                    <label htmlFor="prix" className="form-label label-shop">Prix</label>
                    <input className="form-control" type="text" name="prix" value={produitModifie.prix} onChange={gererChangementEntree} />
                </div>
                <div className="row g-3">
                    <div className="mb-3">
                        <label htmlFor="lien" className="form-label label-shop">Lien</label>
                        <input className="form-control" type="text" name="lien" value={produitModifie.lien} onChange={gererChangementEntree} />
                    </div>
                </div>
                <div className="col">
                    <label htmlFor="etatProduit" className="form-label label-shop">Disponible</label>
                    <input type="checkbox" name="estDispo" checked={produitModifie.estDispo} onChange={gererChangementCheckbox} />
                </div>
                <div className="d-grid gap-2">
                    <button className="module-tuileEvent-info-buttons-button2" type="button" onClick={gererEnvoiEdition}>Enregistrer les modifications</button>
                </div>
            </form>
            {updatedSuccess && (
                <div className="alert alert-success" role="alert">
                    Le produit a été modifié avec succès !
                </div>
            )}
            {/* Rendu conditionnel du label d'erreur */}
            {erreur && <div className="alert alert-danger">Veuillez verifier tous les champs.</div>}
        </div>
    );
};

export default EditerProduit;
