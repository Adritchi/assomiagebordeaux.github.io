import React, { useState } from 'react';

import '../../assets/design/commun/tuileShop.css';
import SuppressionProduit from './SuppressionProduit';
import EditionProduit from './EditionProduit';
import EDIT from '../../assets/icons/edit.svg';
import CANCEL from '../../assets/icons/cancel.svg';

export function TuileShop(props) {

    // Etat local pour suivre si l'utilisateur est en train d'éditer l'event
    const [estEnEdition, setEstEnEdition] = useState(false);

    // Gestion du clic sur le bouton "Modifier"
    const gererCliqueEdition = () => {
        setEstEnEdition(true);
    };

    // Gestion du clic sur le bouton "Annuler"
    const gererCliqueAnnuler = () => {
        setEstEnEdition(false);
    };

    // Gestion de la suppression de l'event
    const gererSuppression = (productId) => {
        props.gererSuppression(productId);
    };
        return (
            <div class="module-tuileShop">
                {props.estAdmin && (
                    <div className="module-tuileProduct-edit-button">
                        <button onClick={gererCliqueEdition} alt="Modifier"><img src={EDIT}></img></button>
                        <SuppressionProduit produit={props} onDelete={gererSuppression} />
                    </div>
                )}
                
                {estEnEdition && (
                    <>
                    {/* Affichage du formulaire de modification */}
                    <br></br>
                    <EditionProduit produit={props} />
                    <br></br>
                    <div>
                        <button onClick={gererCliqueAnnuler} alt="Annuler"><img src={CANCEL}></img></button>
                    </div>
                    </>
                )}

                {/* <Link to={props.lien} style={{ textDecoration: 'none' }}> */}
                <a href={props.lien} target="_blank" rel="noopener noreferrer nofollow"
                   style={{textDecoration: 'none'}}>
                    <div class="module-tuileShop-imageProduit">
                        <img src={props.imageProduit} alt={props.title}/>
                    </div>

                {!estEnEdition && (
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