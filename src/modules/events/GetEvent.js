// EventsList.js

import React, { useState, useEffect } from 'react';
import TuileEvent from './TuileEvent'; // chemin tuileEvent

const ListEvent = ({ isAdmin }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
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
        };

        fetchEvents();
    }, []);

    return (
        <div>
            <div className="liste-tuiles">
                {events.map(event => (
                    <TuileEvent
                        ID={event.ID}
                        titre={event.titre}
                        lieu={event.lieu}
                        date={event.date}
                        description={event.description}
                        lien={event.lien}
                        image={event.image}
                        isAdmin={isAdmin} 
                        status= ''
                    />
                ))}
            </div>  
        </div>
    );
};

export default ListEvent;

