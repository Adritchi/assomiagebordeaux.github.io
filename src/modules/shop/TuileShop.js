import React, { useState } from 'react';

import '../../assets/design/commun/tuileShop.css';
import DeleteProduct from './DeleteProduct';
import EditProduct from './EditProduct';

export function TuileShop(props) {

    // Etat local pour suivre si l'utilisateur est en train d'éditer l'event
    const [isEditing, setIsEditing] = useState(false);

    // Gestion du clic sur le bouton "Modifier"
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Gestion du clic sur le bouton "Annuler"
    const handleCancelClick = () => {
        setIsEditing(false);
    };

    // Gestion de la suppression de l'event
    const handleDelete = (productId) => {
        props.handleDelete(productId);
    };
        return (
            <div class="module-tuileShop">
                {props.estAdmin && (
                    <div className="module-tuileProduct-edit-button">
                        <button onClick={handleEditClick}>Modifier</button>
                        <DeleteProduct product={props} onDelete={handleDelete} />
                    </div>
                )}
                {isEditing && (
                    <>
                    {/* Affichage du formulaire de modification */}
                    <EditProduct product={props} />
                    <div>
                        <button onClick={handleCancelClick}>Annuler</button>
                    </div>
                    </>
                )}
                {/* <Link to={props.lien} style={{ textDecoration: 'none' }}> */}
                <a href={props.lien} target="_blank" rel="noopener noreferrer nofollow"
                   style={{textDecoration: 'none'}}>
                    <div class="module-tuileShop-imageProduit">
                        <img src={props.imageProduit} alt={props.title}/>
                    </div>
                {!isEditing && (
                <div class="module-tuileShop-infosProduit">
                    <div class="module-tuileShop-infosProduit-nom">
                        {props.nomProduit}
                    </div>
                    <div className="module-tuileShop-infosProduit-prix">
                        {parseFloat(props.prix).toFixed(2)} €
                    </div>
                    {props.etatProduit === 1
                        ?
                        <div class="module-tuileShop-infosProduit-etatProduit disponible">
                            {"En stock"}
                        </div>
                        :
                        <div></div>
                    }
                    {props.etatProduit === "Indisponible"
                        ?
                        <div class="module-tuileShop-infosProduit-etatProduit indisponible">
                            {props.etatProduit}
                        </div>
                        :
                        <div></div>
                    }
                </div>
                )}
                </a>
            </div>

        );

}

export default TuileShop;