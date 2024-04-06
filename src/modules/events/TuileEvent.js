import React, { useState } from 'react';
import '../../assets/design/commun/tuileEvent.css';
import EditEvent from './EditerEvenement';
import DeleteEvent from './SupprimerEvenement';

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
        <div className="module-tuileEvent module-tuileEvent-margin">
            {/* Gestion de l'affichage de l'image */}
            {props.status === "over" ? (
                <div className="module-tuileEvent-illustration module-tuileEvent-illustration-over">
                    <img src={props.image} alt={props.titre} />
                </div>
            ) : (
                <div className="module-tuileEvent-illustration">
                    <img src={props.image} alt={props.titre} />
                </div>
            )}

            {estEnEdition ? (
                <>
                    {/* Affichage du formulaire de modification */}
                    <EditEvent event={props} />
                    <br></br>
                    <button onClick={gererCliqueAnnuler} alt="Annuler"><img src={CANCEL}></img></button>
                </>
            ) : (
                <div className="module-tuileEvent-infos">
                    <div className="module-tuileEvent-info-titre">
                        {props.titre}
                    </div>
                    <div className="module-tuileEvent-info-lieu">
                        {props.lieu}
                    </div>
                    <div className="module-tuileEvent-info-date">
                        {props.date}
                    </div>
                    <div className="module-tuileEvent-info-description">
                        {props.description}
                    </div>
                    <div className="module-tuileEvent-info-buttons">
                        {/* Affichage du bouton "En savoir plus" si l'event n'est pas terminé */}
                        {props.status === "over" ? (
                            <div></div>
                        ) : (
                            <div>
                                <a href={props.lien} className="module-tuileEvent-info-buttons-button2">
                                    En savoir plus
                                </a>
                            </div>
                        )}
                        <br></br>
                        {/* Affichage du bouton de modification et de suppression si l'utilisateur est admin */}
                        {props.estAdmin && (
                            <div>
                                <button onClick={gererCliqueEdition} alt="Modifier"><img src={EDIT}></img></button>
                                <DeleteEvent event={props} onDelete={gererSuppression} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TuileEvent;
