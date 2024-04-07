import React, { useState } from 'react';

import '../../assets/design/commun/tuileMemories.css';
import DeleteMemories from './DeleteMemories';
import EditMemories from './EditMemories';

// Import des icônes nécessaires
import EDIT from '../../assets/icons/edit.svg';
import CANCEL from '../../assets/icons/cancel.svg';

export function TuileMemories(props) {
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
    const handleDelete = (memoryId) => {
        props.handleDelete(memoryId);
    };
    
    return (
        <div className="module-tuileMemories" style={{ marginLeft: '0px', position: 'relative' }}>
            <a href={props.lien} target="_blank" rel="noopener noreferrer nofollow" style={{ textDecoration: 'none' }}>
                <div style={{ backgroundImage: `url(${props.image})`, position: 'relative' }} className="module-tuileMemories-image">
                    {props.estNouveau && <div className="module-tuileMemories-nouveau">Nouveau</div>}
                </div>
            </a>
            {isEditing ? (
                <>
                    {/* Affichage du formulaire de modification */}
                    <EditMemories memory={props} />
                    <div>
                        <button onClick={handleCancelClick} alt="Annuler"><img src={CANCEL}></img></button>
                    </div>
                </>
            ) : (
                <div className="d-flex flex-column justify-content-between flex-grow-1 ms-3">
                    <div>
                        <div className="module-tuileMemories-info-titre">{props.titre}</div>
                        <div className="module-tuileMemories-info-date">{props.date}</div>
                        <div className="module-tuileMemories-info-description">{props.description}</div>
                        <a href={props.lien} className="module-tuileMemories-info-buttons-button2">En savoir plus</a>
                    </div>
                    <div className="d-flex justify-content-end align-items-start">
                        {props.estAdmin && (
                            <div className="d-flex">
                                <button onClick={handleEditClick} className="btn btn-memories btn-outline-primary-memories me-2" alt="Modifier">
                                    <img src={EDIT} alt="Edit icon" />
                                </button>
                                <DeleteMemories memory={props} onDelete={handleDelete} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TuileMemories;
