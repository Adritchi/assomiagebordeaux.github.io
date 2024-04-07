import React, {Component} from 'react';

// Import de l'image pour l'illustration
import MemoriesIllustration from '../../assets/images/memories.jpg';

// Import des composants nécessaires
import ListMemories from '../../modules/memories/GetMemories';
import CreateMemories from '../../modules/memories/CreateMemories';

// Import du fichier de style CSS spécifique à la page memories
import '../../assets/design/pages/memories.css'
import '../../assets/design/commun/tuileMemories.css';

class Memories extends Component {

    // Initialisation de l'état local
    state = {
        estAdmin: false, 
        showCreateMemoryForm: false, 
    };

    componentDidMount() {
        this.checkLoginStatus(); // Vérifie immédiatement l'état de connexion
    }

    // Vérifie le statut de connexion
    checkLoginStatus = async () => {
        try {
            // Requête pour vérifier le statut de connexion côté serveur
            const response = await fetch('/checkLoginStatus');
            const data = await response.json();
            // Met à jour l'état estAdmin avec le résultat de la requête
            this.setState({ estAdmin: data.adminConnected });
        } catch (error) {
            // En cas d'erreur, laisse estAdmin sur false
            this.setState({ estAdmin: false });
        }
    };

    // Bascule l'affichage du formulaire de création d'événement
    toggleCreateMemoryForm = () => {
        this.setState((prevState) => ({
            showCreateEventForm: !prevState.showCreateMemoryForm,
        }));
    };

    render() {
        // Extraction de l'état estAdmin du state
        const { estAdmin } = this.state;
        return (
            <div class="page-memories">
                <div style={{backgroundImage: "url(" + MemoriesIllustration + ")"}} class="page-memories-illustration">
                    <div class="page-memories-illustration-infos">
                        <div class="page-memories-illustration-infos-titre">Memories</div>
                        <div class="page-memories-illustration-infos-subtitle">Les souvenirs miagistes d'une décennie
                        </div>
                    </div>
                </div>
                {/* Contenu principal de la page */}
                <div class="page-memories-content">
                    <div class="page-memories-content-margin">
                        <div>
                            {estAdmin && (
                                <button className="module-tuileMemories-info-buttons-button2" onClick={this.toggleCreateMemoryForm}>Ajouter un souvenir</button>
                            )}
                            <br></br>
                            <br></br>
                            {this.state.showCreateEventForm && <CreateMemories />}
                        </div>
                        <ListMemories estAdmin={estAdmin}/>
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