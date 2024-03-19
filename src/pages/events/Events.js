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
        isAdmin: false, // Madiane j'attends le boolean
        showCreateEventForm: false,
    };

    componentDidMount() {
        this.checkLoginStatus(); // Vérifie immédiatement l'état de connexion au chargement du composant
        this.interval = setInterval(this.checkLoginStatus, 5000); // Vérifie l'état de connexion toutes les 5 secondes
    }
    
    componentWillUnmount() {
        clearInterval(this.interval); // Nettoie l'intervalle lors du démontage du composant pour éviter les fuites de mémoire
    }
    

    checkLoginStatus = async () => {
        try {
            const response = await fetch('/checkLoginStatus');
            const data = await response.json();
            this.setState({ adminConnected: data.adminConnected });
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'état de connexion :', error);
        }
    };

    toggleCreateEventForm = () => {
        this.setState((prevState) => ({
            showCreateEventForm: !prevState.showCreateEventForm,
        }));
    };

    render() {
        const {isAdmin} = this.state; // Récupération du boolean isAdmin
        console.log('isAdmin', isAdmin); // Marche stp
        return (
            <div class="page-event">
                <div style={{ backgroundImage: "url(" + EventsIllustration + ")" }} class="page-events-illustration">
                    <div class="page-events-illustration-infos">
                        <div class="page-events-illustration-infos-titre">Events</div>
                        <div class="page-events-illustration-infos-subtitle">Et pas qu'au 31 du mois d'août !</div>
                    </div>
                </div>
                <div class="page-events-contenu">

                    <Tuile
                        display="true"
                        type="event"
                        status="" // over = gris + button disparait
                        image={Moustache}
                        titre="Movember M-TECH X AMB"
                        lieu="Joya - Talence"
                        date="24 novembre 2022 21h00"
                        description="Il va falloir ramener sa plus belle moustache !"
                        lien="https://fb.me/e/30sQJAY0o" // A regrouper dans 1 des 4 tuiles
                    />

                    <div>
                        {/* Affiche le bouton "Créer un événement" quand mode admin actif*/}
                        {isAdmin && (
                            <button onClick={this.toggleCreateEventForm}>Créer un événement</button>
                        )}

                        {/* Affiche le formulaire de création d'événement si showCreateEventForm est true */}
                        {this.state.showCreateEventForm && <CreerEvenement />}
                    </div>

                    {/* Passe isAdmin comme prop à ListEvent */}
                    <ListEvent isAdmin={isAdmin} />

                    <div class="page-events-subtitle">Events passés</div> /* A gérer dans le backend */
                    <Tuile
                        display="true"
                        type="event"
                        status="over"
                        image={WEI}
                        typeEvent=""
                        titre="Week-end d'intégration - MIAGE WEI-LANTA"
                        lieu="Domaine de Peyreguilhot"
                        date="01 - 02 octobre 2022"
                        description="L'évènement de cette rentrée à ne surtout pas louper !"
                        typeBouton="externe"
                        button1Color="bleuAMB"
                        button1Label="En savoir plus"
                        button1Link=""
                        isLast="false"
                    />
                </div>
            </div>
        );
    }
}

export default Events