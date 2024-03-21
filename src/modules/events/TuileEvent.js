import React, { useState } from 'react';
import '../../assets/design/commun/tuileEvent.css';
import EditEvent from './EditEvent';
import DeleteEvent from './DeleteEvent'; // Importer le composant DeleteEvent

export function TuileEvent(props) {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDelete = (eventId) => {
        props.handleDelete(eventId);
    };

    return (
        <div className="module-tuileEvent module-tuileEvent-margin">
            {props.estAdmin && (
                <div className="module-tuileEvent-edit-button">
                    <button onClick={handleEditClick}>Modifier</button>
                    {/* Ajouter le bouton de suppression si l'utilisateur est un admin */}
                    <DeleteEvent event={props} onDelete={handleDelete} />
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
                <EditEvent event={props} />
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
