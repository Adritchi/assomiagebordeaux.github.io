import React, { useState, useEffect } from 'react';
import TuileMemories from './TuileMemories';
import moment from 'moment';

const ListMemories = ({ estAdmin }) => {
    const [memories, setMemories] = useState([]);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const response = await fetch('http://localhost:3000/memory');
                if (response.ok) {
                    const data = await response.json();
                    setMemories(data);
                    console.log('Contenu de la base de données :', data);
                } else {
                    console.error('Erreur lors de la récupération des souvenirs');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchMemories();
    }, [estAdmin]); // Ecoute les changements de estAdmin

    const formatDateRange = (startDate, endDate) => {
        if (!startDate) {
            return null;
        }

        const startMoment = moment(startDate);
        const endMoment = moment(endDate);

        const formattedStartDay = startMoment.format('D');
        const formattedEndDay = endMoment.format('D');
        const formattedStartMonth = startMoment.format('MMM');
        const formattedEndMonth = endMoment.format('MMM');

        if (startMoment.isSame(endMoment, 'month')) {
            if(endDate==null){
                return `${formattedStartDay} - en cours`;
            }else{
                return `${formattedStartDay} - ${formattedEndDay} ${formattedEndMonth}`;
            }
        } else {
            if(endDate==null){
                return `${formattedStartDay} ${formattedStartMonth} - en cours`;
            }else{
                return `${formattedStartDay} ${formattedStartMonth} - ${formattedEndDay} ${formattedEndMonth}`;
            }
        }
    };

    return (
        <div>
            <div className="liste-tuiles">
                {memories.map(memory => {
                    return (
                        <TuileMemories
                            key={memory.ID}
                            titre={memory.titre}
                            date={formatDateRange(memory.date_debut, memory.date_fin)}
                            description={memory.description}
                            lien={memory.lien}
                            image={memory.image}
                            estAdmin={estAdmin} 
                        />
                    );
                })}
            </div>  
        </div>
    );
};

export default ListMemories;
