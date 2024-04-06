import React, { useState } from 'react';

import '../../assets/design/commun/tuileMemories.css';
import DeleteMemories from './SupprimerSouvenir';
import EditionSouvenir from './EditionSouvenir';
import EDIT from '../../assets/icons/edit.svg';
import CANCEL from '../../assets/icons/cancel.svg';

export function TuileMemories(props) {
    // Etat local pour suivre si l'utilisateur est en train d'éditer le souvenir
    const [estEnEdition, setEstEnEdition] = useState(false);

    // Gestion du clic sur le bouton "Modifier"
    const gererCliqueEdition = () => {
        setEstEnEdition(true);
    };

    // Gestion du clic sur le bouton "Annuler"
    const gererCliqueAnnuler = () => {
        setEstEnEdition(false);
    };

    // Gestion de la suppression du souvenir
    const gererSuppression = (identifiantSouvenir) => {
        props.gererSuppression(identifiantSouvenir);
    };
    return (
        <div className="module-tuileMemories" style={{ marginLeft: '0px', position: 'relative' }}>
            <a href={props.lien} target="_blank" rel="noopener noreferrer nofollow" style={{ textDecoration: 'none' }}>
                <div style={{ backgroundImage: `url(${props.image})`, position: 'relative' }} className="module-tuileMemories-image">
                    {props.estNouveau && <div className="module-tuileMemories-nouveau">Nouveau</div>}
                </div>
            </a>
            {estEnEdition ? (
                <>
                    {/* Affichage du formulaire de modification */}
                    <br></br>
                    <EditionSouvenir memory={props} />
                    <br></br>
                    <div>
                        <button onClick={gererCliqueAnnuler} alt="Annuler"><img src={CANCEL}></img></button>
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
                    <br></br>
                    {props.estAdmin && (
                        <div>
                            <button onClick={gererCliqueEdition} alt="Modifier"><img src={EDIT}></img></button>
                            <DeleteMemories memory={props} onDelete={gererSuppression} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TuileMemories;
