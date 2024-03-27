import React from 'react';

import '../../assets/design/commun/tuileMemories.css';
// import {Link} from 'react-router-dom';

// import {Button} from './Button'

export function TuileMemories(props) {

        return (
            <div class="module-tuileMemories" style={{marginLeft: '0px'}}>
                <a href={props.lien} target="_blank" rel="noopener noreferrer nofollow"
                   style={{textDecoration: 'none'}}>
                    <img src={props.image} class="module-tuileMemories-image">
                        {/* {props.siNouveau === "true"
                            ?
                            <div class="module-tuileMemories-nouveau">Nouveau</div>
                            :
                            <div></div>
                        } */}
                    </img>
                </a>
                <div class="module-tuileMemories-titre">
                {/* <div class="module-tuileMemories-titreGauche"> */}
                    {props.titre}
                </div>

                <div class="module-tuileMemories-dateMemories">
                    {props.date}
                </div>
                {/* </div> */}
        
                <div class="module-tuilesMemories-description">
                    {props.description}
                </div>
            </div>
        );
}

export default TuileMemories;