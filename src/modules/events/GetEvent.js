import React, { useState, useEffect } from 'react';
import TuileEvent from './TuileEvent';

const ListEvent = ({ estAdmin }) => {
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
    }, [estAdmin]); // Ecoute les changements de estAdmin

    return (
        <div>
            <div className="liste-tuiles">
                {events.map(event => (
                    <TuileEvent
                        key={event.ID} // Ajoutez une clé unique à chaque élément de la liste
                        ID={event.ID}
                        titre={event.titre}
                        lieu={event.lieu}
                        date_debut={event.date_debut}
                        description={event.description}
                        lien={event.lien}
                        image={event.image}
                        estAdmin={estAdmin} 
                        status= ''
                    />
                ))}
            </div>  
        </div>
    );
};

export default ListEvent;
