import React from 'react';
import '../../assets/design/commun/tuileMemories.css';

export function TuileMemories(props) {
    return (
        <div className="module-tuileMemories" style={{ marginLeft: '0px', position: 'relative' }}>
            <a href={props.lien} target="_blank" rel="noopener noreferrer nofollow" style={{ textDecoration: 'none' }}>
                <div style={{ backgroundImage: `url(${props.image})`, position: 'relative' }} className="module-tuileMemories-image">
                    {props.estNouveau && <div className="module-tuileMemories-nouveau">Nouveau</div>}
                </div>
            </a>
            <div className="module-tuileMemories-titres">
                <div className="module-tuileMemories-title-and-date">
                    <div className="module-tuileMemories-titre">{props.titre}</div>
                    <div className="module-tuileMemories-date">{props.date}</div>
                </div>
            </div>
            <div className="module-tuilesMemories-description">{props.description}</div>
        </div>
    );
}

export default TuileMemories;
