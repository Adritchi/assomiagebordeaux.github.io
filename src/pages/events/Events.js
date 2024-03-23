import React, { Component } from 'react';

// Import des composants nécessaires
import CreateEvent from '../../modules/events/CreateEvent';
import ListEvent from '../../modules/events/GetEvent';

// Import de l'image pour l'illustration
import EventsIllustration from '../../assets/images/events.jpg';

// Import du fichier de style CSS spécifique à la page events
import '../../assets/design/pages/events.css';

// Définition de la classe du composant Events
class Events extends Component {

    // Initialisation de l'état local
    state = {
        estAdmin: false, 
        showCreateEventForm: false, 
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
    toggleCreateEventForm = () => {
        this.setState((prevState) => ({
            showCreateEventForm: !prevState.showCreateEventForm,
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
                            <button onClick={this.toggleCreateEventForm}>Créer un événement</button>
                        )}
                        {/* Affiche le formulaire si showCreateEventForm est true */}
                        {this.state.showCreateEventForm && <CreateEvent />}
                    </div>
                    {/* Liste des events à venir */}
                    <ListEvent estAdmin={estAdmin} statut={'avant'}/>
                    <div class="page-events-subtitle">Events passés</div>
                    {/* Liste des events passés */}
                    <ListEvent estAdmin={estAdmin} statut={'passe'}/>
                </div>
            </div>
        );
    }
}

export default Events;
