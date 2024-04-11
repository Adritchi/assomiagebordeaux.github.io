import React, { useState } from 'react';

import '../../assets/design/commun/tuileEvent.css';
import EditerEvenement from './EditerEvenement';
import SupprimerEvenement from './SupprimerEvenement';

// Import des icônes nécessaires
import EDIT from '../../assets/icons/edit.svg';
import CANCEL from '../../assets/icons/cancel.svg';

export function TuileEvent(props) {
    
    // Etat local pour suivre si l'utilisateur est en train d'éditer l'evenement
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
    const gererSuppression = (identifiantEvenement) => {
        props.gererSuppression(identifiantEvenement);
    };

    return (
        <div className="module-tuileEvent module-tuileEvent-margin d-flex justify-content-between">
            <div className="module-tuileEvent-illustration">
                <img src={props.image} alt={props.titre} />
            </div>
            {estEnEdition ? (
                <>
                    <EditerEvenement evenement={props} />
                    <div>
                        <button onClick={gererCliqueAnnuler} alt="Annuler"><img src={CANCEL}></img></button>
                    </div>
                </>
            ) : (
                <div className="d-flex flex-column justify-content-between flex-grow-1 ms-3">
                    <div>
                        <div className="module-tuileEvent-info-titre">{props.titre}</div>
                        <div className="module-tuileEvent-info-lieu">{props.lieu}</div>
                        <div className="module-tuileEvent-info-date">{props.date}</div>
                        <div className="module-tuileEvent-info-description">{props.description}</div>
                        <a href={props.lien} className="module-tuileEvent-info-buttons-button2">En savoir plus</a>
                    </div>
                    <div className="d-flex justify-content-end align-items-start">
                        {props.estAdmin && (
                            <div className="d-flex">
                                <button onClick={gererCliqueEdition} className="btn btn-outline-primary me-2" alt="Modifier">
                                    <img src={EDIT} alt="Edit icon" />
                                </button>
                                <SupprimerEvenement event={props} onDelete={gererSuppression} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TuileEvent;