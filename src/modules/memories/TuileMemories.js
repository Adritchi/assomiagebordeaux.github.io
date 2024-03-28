import React, { useState } from 'react';

import '../../assets/design/commun/tuileMemories.css';
import DeleteMemories from './DeleteMemories';
import EditMemories from './EditMemories';

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
            {props.estAdmin && (
            <div className="module-tuileMemory-edit-button">
                <button onClick={handleEditClick}>Modifier</button>
                <DeleteMemories memory={props} onDelete={handleDelete} />
            </div>
            )}
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
                        <button onClick={handleCancelClick}>Annuler</button>
                    </div>
                </>
            ) : (
                <div className="module-tuileMemories-infos">
                    <div className="module-tuileMemories-titres">
                        <div className="module-tuileMemories-title-and-date">
                            <div className="module-tuileMemories-titre">{props.titre}</div>
                            <div className="module-tuileMemories-date">{props.date}</div>
                        </div>
                    </div>
                    <div className="module-tuilesMemories-description">{props.description}</div>
                </div>
            )}
        </div>
    );
}

export default TuileMemories;
