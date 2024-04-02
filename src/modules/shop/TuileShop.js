import React, { useState } from 'react';

import '../../assets/design/commun/tuileShop.css';
import DeleteProduct from './DeleteProduct';
import EditProduct from './EditProduct';
import EDIT from '../../assets/icons/edit.svg';
import CANCEL from '../../assets/icons/cancel.svg';

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
                        <button onClick={handleEditClick} alt="Modifier"><img src={EDIT}></img></button>
                        <DeleteProduct product={props} onDelete={handleDelete} />
                    </div>
                )}
                
                {isEditing && (
                    <>
                    {/* Affichage du formulaire de modification */}
                    <br></br>
                    <EditProduct product={props} />
                    <br></br>
                    <div>
                        <button onClick={handleCancelClick} alt="Annuler"><img src={CANCEL}></img></button>
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
                    {props.etatProduit === 0
                        ?
                        <div class="module-tuileShop-infosProduit-etatProduit indisponible">
                            {"Indisponible"}
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