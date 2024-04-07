import React, { useState } from 'react';

const EditionProduit = ({ produit }) => {
    const [produitModifie, setProduitModifie] = useState({
        ...produit, // Utiliser les valeurs initiales du produit
    });
    const [erreur, setErreur] = useState(false);

    const gererChangementCheckbox  = () => {
        setProduitModifie(prevState => ({
            ...prevState,
            etatProduit: !prevState.etatProduit // Inverse l'état actuel
        }));
    };         

    const gererChangementEntree = (element) => {
        const { name, valeur: value } = element.target;

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
            if (produitModifie.nom === '' || produitModifie.lien === '' || produitModifie.prix === '') {
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
                console.log('Événement mis à jour avec succès');
                setErreur(false);
                window.location.reload();
            } else {
                console.error('Erreur lors de la mise à jour du produit');
            }
        } catch (erreur) {
            console.error(erreur);
        }
    };
    

    return (
        <div>
            <input type="file" accept="image/*" onChange={gererChangementImage } />
            <br></br>
            <br></br>
            <input type="text" name="nom" value={produitModifie.nom} onChange={gererChangementEntree} />
            <input type="text" name="prix" value={produitModifie.prix} onChange={gererChangementEntree} />
            <input type="checkbox" name="etatProduit" checked={produitModifie.etatProduit} onChange={gererChangementCheckbox } />            
            <input type="text" name="lien" value={produitModifie.lien} onChange={gererChangementEntree} />
            <br></br>
            <br></br>
            <button onClick={gererEnvoiEdition}>Enregistrer les modifications</button>
            
            {/* Rendu conditionnel du label d'erreur */}
            {erreur && (
                <div style={{ color: 'red' }}>
                    <p>Veuillez remplir tous les champs</p>
                </div>
            )}
        </div>
    );
};

export default EditionProduit;
