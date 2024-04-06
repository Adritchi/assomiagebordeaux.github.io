import React, {Component} from 'react';

import IllustrationSouvenirs from '../../assets/images/memories.jpg';

import ListeSouvenirs from '../../modules/memories/GetMemories';
import CreerSouvenirs from '../../modules/memories/CreateMemories';

import '../../assets/design/pages/memories.css'

class Memories extends Component {

    // Initialisation de l'état local
    state = {
        estAdmin: false, 
        afficherFormulaireCreerSouvenir: false, 
    };

    componentDidMount() {
        this.verifierStatutConnexion(); // Vérifie immédiatement l'état de connexion
    }

    // Vérifie le statut de connexion
    verifierStatutConnexion = async () => {
        try {
            // Requête pour vérifier le statut de connexion côté serveur
            const reponse = await fetch('/estAdminConnecte');
            const data = await reponse.json();
            // Met à jour l'état estAdmin avec le résultat de la requête
            this.setState({ estAdmin: data.adminConnecte });
        } catch (erreur) {
            // En cas d'erreur, laisse estAdmin sur false
            this.setState({ estAdmin: false });
        }
    };

    // Bascule l'affichage du formulaire de création d'événement
    basculerAffichageFormulaireCreerSouvenir  = () => {
        this.setState((prevState) => ({
            afficherFormulaireCreerSouvenir: !prevState.afficherFormulaireCreerSouvenir,
        }));
    };

    render() {
        // Extraction de l'état estAdmin du state
        const { estAdmin } = this.state;
        return (
            <div class="page-memories">
                <div style={{backgroundImage: "url(" + IllustrationSouvenirs + ")"}} class="page-memories-illustration">
                    <div class="page-memories-illustration-infos">
                        <div class="page-memories-illustration-infos-titre">Memories</div>
                        <div class="page-memories-illustration-infos-subtitle">Les souvenirs miagistes d'une décennie
                        </div>
                    </div>
                </div>
                <div class="page-memories-content">
                    <div class="page-memories-content-margin">
                        <div>
                            {estAdmin && (
                                <button className="" onClick={this.basculerAffichageFormulaireCreerSouvenir }>Ajouter un souvenir</button>
                            )}
                            <br></br>
                            <br></br>
                            {this.state.afficherFormulaireCreerSouvenir && <CreerSouvenirs />}
                        </div>
                        <ListeSouvenirs estAdmin={estAdmin}/>
                    </div>
                    <div id="page-memories-conditions" class="page-memories-conditions">
                        Toutes les photos sont stockées sur Google Photos de manière sécurisée.
                        Vous pouvez télécharger l'application Google Photos pour <a
                        href="https://apps.apple.com/fr/app/google-photos/id962194608" target="_blank"
                        rel="noopener noreferrer nofollow">iOS</a> et <a
                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.photos&hl=fr"
                        target="_blank" rel="noopener noreferrer nofollow">Android</a>.
                        Si vous souhaitez signaler une ou plusieurs photos pour qu'elle(s) soi(en)t retirée(s), veuillez
                        nous communiquer votre nom, prénom, la capture d'écran de la ou des dite(s) photo(s),
                        ainsi qu'un paragraphe explicatif. Envoyez le tout à cette adresse mail : asso@miagebordeaux.fr
                        ou en cliquant <a href="mailto:asso@miagebordeaux.fr">ici</a>.
                    </div>
                </div>
            </div>
        );
    }
}

export default Memories