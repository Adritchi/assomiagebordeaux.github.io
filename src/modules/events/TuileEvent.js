import React, { useState } from 'react';
import '../../assets/design/commun/tuileEvent.css';
import EditEvent from './EditEvent';
import DeleteEvent from './DeleteEvent';

// Import des icônes nécessaires
import EDIT from '../../assets/icons/edit.svg';
import CANCEL from '../../assets/icons/cancel.svg';
import DELETE from '../../assets/icons/delete.svg';

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
        <div className="module-tuileEvent module-tuileEvent-margin">
            <div className="module-tuileEvent-illustration">
                <img src={props.image} alt={props.titre} />
            </div>
            {isEditing ? (
                <>
                    <EditEvent event={props} />
                    <button onClick={handleCancelClick} className="btn btn-outline-secondary me-2" alt="Annuler">
                        <img src={CANCEL} alt='Annuler' />
                    </button>
                </>
            ) : (
                <div className="module-tuileEvent-infos d-flex justify-content-between align-items-start">
                    <div>
                        <div className="module-tuileEvent-info-titre">{props.titre}</div>
                        <div className="module-tuileEvent-info-lieu">{props.lieu}</div>
                        <div className="module-tuileEvent-info-date">{props.date}</div>
                        <div className="module-tuileEvent-info-description">{props.description}</div>
                    </div>
                    <div className="d-flex align-items-start">
                        <a href={props.lien} className="module-tuileEvent-info-buttons-button2">En savoir plus</a>
                        {props.estAdmin && (
                            <div className="module-tuileEvent-action-buttons">
                                <button onClick={handleEditClick} className="btn btn-outline-primary" alt="Modifier">
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