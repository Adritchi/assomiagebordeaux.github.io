import React, { useState, useEffect } from 'react';
import TuileMemories from './TuileMemories';
import moment from 'moment';
import '../../assets/design/pages/memories.css';

const ListeSouvenirs = ({ estAdmin }) => {
    const [souvenirs, setSouvenirs] = useState([]);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const reponse = await fetch('http://localhost:3000/souvenir');
                if (reponse.ok) {
                    const data = await reponse.json();
                    setSouvenirs(data);
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

        const startMoment = moment(startDate);
        const endMoment = moment(endDate);

        const formattedStartDay = startMoment.format('DD');
        const formattedEndDay = endMoment.format('DD');
        const formattedStartMonth = startMoment.format('MMM');
        const formattedEndMonth = endMoment.format('MMM');

        if (startMoment.isSame(endMoment, 'month')) {
            if (endDate == null) {
                return `${formattedStartDay} - en cours`;
            } else {
                return `${formattedStartDay} - ${formattedEndDay} ${formattedEndMonth}.`;
            }
        } else {
            if (endDate == null) {
                return `${formattedStartDay} ${formattedStartMonth} - en cours`;
            } else {
                return `${formattedStartDay} ${formattedStartMonth}. - ${formattedEndDay} ${formattedEndMonth}.`;
            }
        }
    };

    // Fonction pour obtenir les périodes scolaires uniques des souvenirs
    const getUniqueSchoolYears = () => {
        const schoolYears = new Set();
        souvenirs.forEach(memory => {
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
                            {souvenirs.map(souvenir => {
                                const startMoment = moment(souvenir.date_debut);
                                const schoolYearStart = startMoment.month() >= 8 ? startMoment.year() : startMoment.year() - 1;
                                const schoolYearEnd = startMoment.month() >= 8 ? startMoment.year() + 1 : startMoment.year();
                                const memorySchoolYear = `${schoolYearStart}/${schoolYearEnd}`;
                                if (memorySchoolYear === schoolYear) {
                                    const daysDifference = moment().diff(startMoment, 'days');
                                    const estNouveau = daysDifference <= 14;
                                    return (
                                        <TuileMemories
                                            ID={souvenir.ID}
                                            titre={souvenir.titre}
                                            date={formatDateRange(souvenir.date_debut, souvenir.date_fin)}
                                            description={souvenir.description}
                                            lien={souvenir.lien}
                                            image={souvenir.image}
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

export default ListeSouvenirs;
