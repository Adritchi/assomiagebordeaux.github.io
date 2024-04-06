import React, { useState, useEffect } from 'react';
import TuileShop from './TuileShop';

const ListProduct = ({ estAdmin }) => {
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const reponse = await fetch('http://localhost:3000/produit');
                if (reponse.ok) {
                    const data = await reponse.json();
                    setProduits(data);
                    console.log('Contenu de la base de données :', data);
                } else {
                    console.error('Erreur lors de la récupération des produits');
                }
            } catch (erreur) {
                console.error(erreur);
            }
        };

        fetchProducts();
    }, [estAdmin]); // Ecoute les changements de estAdmin

    return (
        <div>
            <div className="liste-tuiles">
                {produits.map(produit => {
                    return (
                        <TuileShop
                            ID={produit.ID}
                            imageProduit={produit.image}
                            nomProduit={produit.nom}
                            prix={produit.prix}
                            etatProduit={produit.estDispo}
                            lien={produit.lien}
                            estAdmin={estAdmin}
                        />
                    );
                })}
            </div>  
        </div>
    );
};

export default ListProduct;
