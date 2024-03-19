import React, { useState } from 'react';
import '../../assets/design/commun/tuileEvent.css';
import EditEvent from './EditEvent';

export function TuileEvent(props) {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdate = (updatedEvent) => {
        setIsEditing(false);
        // Mettre à jour les données de l'événement dans le composant parent si nécessaire
        // Appeler la fonction handleUpdate du composant parent et passer updatedEvent comme argument
        props.handleUpdate(updatedEvent);
    };

    return (
        <div className="module-tuileEvent module-tuileEvent-margin">
            {props.isAdmin && (
                <div className="module-tuileEvent-edit-button">
                    <button onClick={handleEditClick}>Modifier</button>
                </div>
            )}

            {/* Gestion des images */}
            {props.status === "over" ? (
                <div className="module-tuileEvent-illustration module-tuileEvent-illustration-over">
                    <img src={props.image} alt={props.titre} />
                </div>
            ) : (
                <div className="module-tuileEvent-illustration">
                    <img src={props.image} alt={props.titre} />
                </div>
            )}

            {isEditing ? (
                <EditEvent event={props} onUpdate={handleUpdate} />
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
                        {props.status === "over" ? (
                            <div></div>
                        ) : (
                            <div className="module-tuileEvent-info-buttons-button1">
                                <a href={props.lien} className="module-tuileEvent-info-buttons-button2">
                                    En savoir plus
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TuileEvent;
