import React, { Component } from 'react';

import { Tuile } from '../../modules/utilitaires/Tuile';
import CreerEvenement from '../../modules/events/CreateEvent';
import ListEvent from '../../modules/events/GetEvent';

import EventsIllustration from '../../assets/images/events.jpg';
import Moustache from '../../assets/images/moustache.png'
import WEI from '../../assets/images/wei20222023.png';

import '../../assets/design/pages/events.css'


class Events extends Component {

    state = {
        estAdmin: false,
        showCreateEventForm: false,
    };

    componentDidMount() {
        this.checkLoginStatus(); // Vérifie immédiatement l'état de connexion au chargement du composant
    }
    
    checkLoginStatus = async () => {
        try {
            const response = await fetch('/checkLoginStatus');
            const data = await response.json();
            this.setState({ estAdmin: data.adminConnected }); // Mettre à jour l'état avec setState
        } catch (error) {
            this.estAdmin=false;        
        }
    };

    toggleCreateEventForm = () => {
        this.setState((prevState) => ({
            showCreateEventForm: !prevState.showCreateEventForm,
        }));
    };

    render() {
        const {estAdmin} = this.state; // Récupération du boolean estAdmin
        return (
            <div class="page-event">
                <div style={{ backgroundImage: "url(" + EventsIllustration + ")" }} class="page-events-illustration">
                    <div class="page-events-illustration-infos">
                        <div class="page-events-illustration-infos-titre">Events</div>
                        <div class="page-events-illustration-infos-subtitle">Et pas qu'au 31 du mois d'août !</div>
                    </div>
                </div>
                <div class="page-events-contenu">
                    <div>
                        {/* Affiche le bouton "Créer un événement" quand mode admin actif*/}
                        {estAdmin && (
                            <button onClick={this.toggleCreateEventForm}>Créer un événement</button>
                        )}

                        {/* Affiche le formulaire de création d'événement si showCreateEventForm est true */}
                        {this.state.showCreateEventForm && <CreerEvenement />}
                    </div>

                    {/* Passe estAdmin comme prop à ListEvent */}
                    <ListEvent estAdmin={estAdmin} statut={'avant'}/>

                    <div class="page-events-subtitle">Events passés</div>
                    <ListEvent estAdmin={estAdmin} statut={'passe'}/>
                </div>
            </div>
        );
    }
}

export default Events