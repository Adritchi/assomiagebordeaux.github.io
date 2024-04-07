import React, { useState } from 'react';

import '../../assets/design/commun/tuileEvent.css';
import EditEvent from './EditEvent';
import DeleteEvent from './DeleteEvent';

// Import des icônes nécessaires
import EDIT from '../../assets/icons/edit.svg';
import CANCEL from '../../assets/icons/cancel.svg';

export function TuileEvent(props) {
    
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
    const handleDelete = (eventId) => {
        props.handleDelete(eventId);
    };

    return (
        <div className="module-tuileEvent module-tuileEvent-margin d-flex justify-content-between">
            <div className="module-tuileEvent-illustration">
                <img src={props.image} alt={props.titre} />
            </div>
            {isEditing ? (
                <>
                    <EditEvent event={props} />
                    <div>
                        <button onClick={handleCancelClick} alt="Annuler"><img src={CANCEL}></img></button>
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
                                <button onClick={handleEditClick} className="btn btn-outline-primary me-2" alt="Modifier">
                                    <img src={EDIT} alt="Edit icon" />
                                </button>
                                <DeleteEvent event={props} onDelete={handleDelete} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TuileEvent;