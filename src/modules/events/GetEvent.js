import React, { useState, useEffect } from 'react';
import TuileEvent from './TuileEvent';

// Fonction pour formater une date
function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
}

const ListEvent = ({ estAdmin, statut }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const url = statut === 'passe' ? 'http://localhost:3000/eventPasse' : 'http://localhost:3000/event';
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                    console.log('Contenu de la base de données :', data);
                } else {
                    console.error('Erreur lors de la récupération des événements');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvents();
    }, [estAdmin, statut]); // Ecoute les changements de estAdmin

    return (
        <div>
            <div className="liste-tuiles">
                {events.map(event => (
                    <TuileEvent
                        ID={event.ID}
                        titre={event.titre}
                        lieu={event.lieu}
                        date={`${formatDate(event.date_debut)} - ${formatDate(event.date_fin)}`} 
                        description={event.description}
                        lien={event.lien}
                        image={require(`../../assets/images/${event.image}`)}
                        estAdmin={estAdmin} 
                        status={new Date() > new Date(event.date_fin) ? 'over' : ''}
                    />
                ))}
            </div>  
        </div>
    );
};

export default ListEvent;
