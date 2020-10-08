import React from 'react';
import { Link } from 'react-router-dom';

import '../design/commun/tuileShop.css';

import {Button} from './Button'

export function TuileShop(props) {

    const prixNonExact = "A partir de "+props.prix;
    const prixExact = props.prix;

    if(props.lien === ""){
        return(
            <div class="module-tuileShop">
                <div class="module-tuileShop-imageProduit">
                    <img src={props.imageProduit} alt={props.title} />
                </div>
                <div class="module-tuileShop-infosProduit">
                    { props.siNouveauProduit === "true" 
                    ? 
                    <div class="module-tuileShop-infosProduit-siNouveauté">
                        Nouveau
                    </div>
                    :  
                    <div></div>
                    }
                    <div class="module-tuileShop-infosProduit-nom">
                        {props.nomProduit}
                    </div>
                    <div class="module-tuileShop-infosProduit-prix">
                    {props.siPrixExact === "true" 
                    ? 
                    prixExact
                    :  
                    prixNonExact
                    }
                    </div>
                    { props.etatProduit === "Disponible" || props.etatProduit === "En stock" 
                    ? 
                    <div class="module-tuileShop-infosProduit-etatProduit disponible">
                        {props.etatProduit}
                    </div>
                    :  
                    <div></div>
                    }
                    { props.etatProduit === "Indisponible" 
                    ? 
                    <div class="module-tuileShop-infosProduit-etatProduit indisponible">
                        {props.etatProduit}
                    </div>
                    :  
                    <div></div>
                    }
                </div>
            </div>
        );
    } else {
        return(
            <div class="module-tuileShop">
                <Link to={props.lien} style={{ textDecoration: 'none' }}>
                <div class="module-tuileShop-imageProduit">
                    <img src={props.imageProduit} alt={props.title} />
                </div>
                <div class="module-tuileShop-infosProduit">
                    { props.siNouveauProduit === "true" 
                    ? 
                    <div class="module-tuileShop-infosProduit-siNouveauté">
                        Nouveau
                    </div>
                    :  
                    <div></div>
                    }
                    <div class="module-tuileShop-infosProduit-nom">
                        {props.nomProduit}
                    </div>
                    <div class="module-tuileShop-infosProduit-prix">
                    {props.siPrixExact === "true" 
                    ? 
                    prixExact
                    :  
                    prixNonExact
                    }
                    </div>
                    { props.etatProduit === "Disponible" || props.etatProduit === "En stock" 
                    ? 
                    <div class="module-tuileShop-infosProduit-etatProduit disponible">
                        {props.etatProduit}
                    </div>
                    :  
                    <div></div>
                    }
                    { props.etatProduit === "Indisponible" 
                    ? 
                    <div class="module-tuileShop-infosProduit-etatProduit indisponible">
                        {props.etatProduit}
                    </div>
                    :  
                    <div></div>
                    }
                </div>
                </Link>
            </div>
            
        );
    }

}

export default TuileShop;