import React, { useState, useEffect } from 'react';
import TuileShop from './TuileShop';

const ListProduct = ({ estAdmin }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/product');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                    console.log('Contenu de la base de données :', data);
                } else {
                    console.error('Erreur lors de la récupération des produits');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, [estAdmin]); // Ecoute les changements de estAdmin

    return (
        <div>
            <div className="liste-tuiles">
                {products.map(product => {
                    return (
                        <TuileShop
                            ID={product.ID}
                            nom={product.nom}
                            prix={product.prix}
                            lien={product.lien}
                            image={product.image}
                            estDispo={product.estDispo}
                            estAdmin={estAdmin} 
                        />
                    );
                })}
            </div>  
        </div>
    );
};

export default ListProduct;
