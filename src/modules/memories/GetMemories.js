import React, { useState, useEffect } from 'react';
import TuileMemories from './TuileMemories';
import moment from 'moment';
import '../../assets/design/pages/memories.css';

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
    }, [estAdmin]); // Écoute les changements de estAdmin

    const formatDateRange = (startDate, endDate) => {
        if (!startDate) {
            return null;
        }

        const startMoment = moment.utc(startDate);
        const endMoment = moment.utc(endDate);

        const formattedStartDay = startMoment.format('DD');
        const formattedEndDay = endMoment.format('DD');
        const formattedStartMonth = startMoment.format('MMM');
        const formattedEndMonth = endMoment.format('MMM');

        if (startMoment.isSame(endMoment, 'month')) {
            if (endDate == null) {
                return `${formattedStartDay} - en cours`;
            } else {
                return `${formattedStartDay} - ${formattedEndDay} ${formattedEndMonth}`;
            }
        } else {
            if (endDate == null) {
                return `${formattedStartDay} ${formattedStartMonth} - en cours`;
            } else {
                return `${formattedStartDay} ${formattedStartMonth} - ${formattedEndDay} ${formattedEndMonth}`;
            }
        }
    };

    // Fonction pour obtenir les périodes scolaires uniques des souvenirs
    const getUniqueSchoolYears = () => {
        const schoolYears = new Set();
        memories.forEach(memory => {
            const startMoment = moment(memory.date_debut);
            const schoolYearStart = startMoment.month() >= 8 ? startMoment.year() : startMoment.year() - 1;
            const schoolYearEnd = startMoment.month() >= 8 ? startMoment.year() + 1 : startMoment.year();
            const schoolYear = `${schoolYearStart}/${schoolYearEnd}`;
            schoolYears.add(schoolYear);
        });
        return Array.from(schoolYears);
    };

    return (
        <div>
            {getUniqueSchoolYears().map(schoolYear => {
                return (
                    <div key={schoolYear} className="year-container">
                        <div className="page-memories-content-one-title">{schoolYear}</div>
                        <div className="tuiles-container">
                            {memories.map(memory => {
                                const startMoment = moment(memory.date_debut);
                                const schoolYearStart = startMoment.month() >= 8 ? startMoment.year() : startMoment.year() - 1;
                                const schoolYearEnd = startMoment.month() >= 8 ? startMoment.year() + 1 : startMoment.year();
                                const memorySchoolYear = `${schoolYearStart}/${schoolYearEnd}`;
                                if (memorySchoolYear === schoolYear) {
                                    const daysDifference = moment().diff(startMoment, 'days');
                                    const estNouveau = daysDifference <= 30;
                                    return (
                                        <TuileMemories
                                            key={memory.ID}
                                            titre={memory.titre}
                                            date={formatDateRange(memory.date_debut, memory.date_fin)}
                                            description={memory.description}
                                            lien={memory.lien}
                                            image={memory.image}
                                            estAdmin={estAdmin}
                                            estNouveau={estNouveau}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ListMemories;
