import React, { Component } from 'react';

// Import des composants nécessaires
import CreerEvenement from '../../modules/events/CreerEvenement';
import ListeEvenement from '../../modules/events/ListeEvenements';

// Import de l'image pour l'illustration
import EventsIllustration from '../../assets/images/events.jpg';

// Import du fichier de style CSS spécifique à la page events
import '../../assets/design/pages/events.css';
import '../../assets/design/commun/tuileEvent.css';

// Définition de la classe du composant Events
class Events extends Component {

    // Initialisation de l'état local
    state = {
        estAdmin: false, 
        afficherFormulaireCreerEvenement: false, 
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
    basculerAffichageFormulaireCreerEvenement = () => {
        this.setState((prevState) => ({
            afficherFormulaireCreerEvenement: !prevState.afficherFormulaireCreerEvenement,
        }));
    };

    render() {
        // Extraction de l'état estAdmin du state
        const { estAdmin } = this.state;
        return (
            <div class="page-event">
                <div style={{ backgroundImage: "url(" + EventsIllustration + ")" }} class="page-events-illustration">
                    <div class="page-events-illustration-infos">
                        <div class="page-events-illustration-infos-titre">Events</div>
                        <div class="page-events-illustration-infos-subtitle">Et pas qu'au 31 du mois d'août !</div>
                    </div>
                </div>
                {/* Contenu principal de la page */}
                <div class="page-events-contenu">
                    <div>
                        {/* Affiche le bouton "Créer un événement" si l'utilisateur est admin */}
                        {estAdmin && (
                            <button className="module-tuileEvent-info-buttons-button2" onClick={this.basculerAffichageFormulaireCreerEvenement }>Ajouter un événement</button>
                        )}
                    </div>
                    <br></br>
                    <div>
                        {/* Affiche le formulaire si afficherFormulaireCreerEvenement est true */}
                        {this.state.afficherFormulaireCreerEvenement && <CreerEvenement />}
                    </div>
                    <br></br>
                    {/* Liste des events à venir */}
                    <ListeEvenement estAdmin={estAdmin} statut={'avant'}/>
                    <div class="page-events-subtitle">Events passés</div>
                    {/* Liste des events passés */}
                    <ListeEvenement estAdmin={estAdmin} statut={'passe'}/>
                </div>
            </div>
        );
    }
}

export default Events;
