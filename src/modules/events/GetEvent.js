import React, { useState, useEffect } from 'react';
import TuileEvent from './TuileEvent';

const ListEvent = ({ estAdmin, statut }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            if(statut==='passe'){
                try {
                    const response = await fetch('http://localhost:3000/eventsPasse');
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
            }else{
                try {
                    const response = await fetch('http://localhost:3000/events');
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
                        date_debut={event.date_debut}
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
