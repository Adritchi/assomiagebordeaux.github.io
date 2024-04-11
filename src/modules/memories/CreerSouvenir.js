import React, { useState } from 'react';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/design/commun/tuileMemories.css';

const CreerSouvenir = () => {
    // Etat local pour gérer les données du nouveau souvenir
    const [nouveauSouvenir, setNouveauSouvenir] = useState({
        image: null,
        titre: '',
        date_debut: '',
        date_fin: '',
        description: '',
        lien: '',
    });

    // Etat de succès
    const [success, setSuccess] = useState(false);

    // Etat local pour gérer les erreurs de formulaire
    const [erreur, setErreur] = useState(false);
    const [erreurDate, setErreurDate] = useState(false);

    // Gestion de changement pour les champs de saisie
    const gererChangementEntree = (element) => {
        // Extraie le nom et la valeur de l'élément déclencheur du souvenir
        const { name, value } = element.target;
        // Met à jour l'état de nouveauSouvenir en utilisant la fonction de mise à jour avec l'ancien état
        setNouveauSouvenir(prevState => ({
            ...prevState, // Garde les valeurs précédentes des champs inchangées
            [name]: value // Met à jour la valeur du champ spécifié par son nom
        }));
    };

    // Gestion de changement pour le champ image (fichier)
    const gererChangementImage = (element) => {
        // Récupère le fichier sélectionné
        const fichier = element.target.files[0];
        const lecteur = new FileReader();

        // Configure le lecteur pour lire le fichier
        lecteur.onloadend = () => {
            // Met à jour l'état nouveauSouvenir pour inclure l'image sous forme de base64
            setNouveauSouvenir(prevState => ({
                ...prevState,
                image: lecteur.result // Stock l'image en base64
            }));
        };

        // Lit le contenu du fichier en tant que données URL
        lecteur.readAsDataURL(fichier);
    };


    // Gestion de la création d'un souvenir
    const gererCreationSouvenir = async () => {
        try {
            setErreur(false); // Réinitialisation des erreurs

            // Vérification de la saisie des champs obligatoires
            if (!nouveauSouvenir.image || nouveauSouvenir.titre.trim() === '' || nouveauSouvenir.date_debut.trim() === '' || nouveauSouvenir.description.trim() === '' || nouveauSouvenir.lien.trim() === '') {
                setErreur(true);
                return;
            }

            // Vérification de la validité des dates
            if (nouveauSouvenir.date_fin && nouveauSouvenir.date_fin < nouveauSouvenir.date_debut) {
                setErreurDate(true);
                console.error('La date de fin ne peut pas être antérieure à la date de début');
                return;
            }

            // Convertir la date de début en UTC avant de l'enregistrer
            const dateDebutUTC = new Date(nouveauSouvenir.date_debut).toISOString().slice(0, 19).replace('T', ' ');
            // Convertir la date de fin en UTC avant de l'enregistrer (si elle est présente)
            const dateFinUTC = nouveauSouvenir.date_fin ? new Date(nouveauSouvenir.date_fin).toISOString().slice(0, 19).replace('T', ' ') : null;
            // Envoi d'une requête POST
            const reponse = await fetch('http://localhost:3000/souvenir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indique à la requête que c'est du JSON
                },
                body: JSON.stringify({
                    ...nouveauSouvenir,
                    date_debut: dateDebutUTC,
                    date_fin: dateFinUTC,
                }), // Converti l'objet nouveauSouvenir en JSON
            });

            // Vérification de la réponse de la requête
            if (reponse.ok) {
                // Réinitialisation des champs après la création réussie
                setNouveauSouvenir({
                    image: '',
                    titre: '',
                    date_debut: '',
                    date_fin: '',
                    description: '',
                    lien: '',
                });

                setErreur(false); // Réinitialisation des erreurs
                setErreurDate(false); // Réinitialisation des erreurs de date
                window.location.reload(); // Recharge la page
                
                // Définir un délai avant de recharger la page
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // Attente de 3 secondes

                setSuccess(true); // Success
                setErreur(false); // Réinitialisation des erreurs
                setErreurDate(false); // Réinitialisation des erreurs de date                
            } else {
                console.error('Erreur lors de la création du souvenir ');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Rendu avec les champs de saisie et le bouton de création d'événement
    return (
        <div className="container my-3">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Ajouter un souvenir</h5>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input className="form-control" type="file" id="image" accept="image/*" onChange={gererChangementImage} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="titre" className="form-label">Titre</label>
                            <input className="form-control" type="text" id="titre" name="titre" placeholder="Titre" value={nouveauSouvenir.titre} onChange={gererChangementEntree} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date_debut" className="form-label">Date de début</label>
                            <input className="form-control" type="date" id="date_debut" name="date_debut" value={nouveauSouvenir.date_debut} onChange={gererChangementEntree} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date_fin" className="form-label">Date de fin</label>
                            <input className="form-control" type="date" id="date_fin" name="date_fin" value={nouveauSouvenir.date_fin} onChange={gererChangementEntree} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" id="description" name="description" rows="3" placeholder="Description" value={nouveauSouvenir.description} onChange={gererChangementEntree}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lien" className="form-label">Lien</label>
                            <input className="form-control" type="url" id="lien" name="lien" placeholder="Lien" value={nouveauSouvenir.lien} onChange={gererChangementEntree} />
                        </div>
                        <div className="d-grid gap-2">
                            <button className="module-tuileMemories-info-buttons-button2" type="button" onClick={gererCreationSouvenir}>Ajouter le souvenir</button>
                        </div>
                    </form>
                </div>
            </div><br></br>
            {success && (
                <div className="alert alert-success" role="alert">
                    Le souvenir a été créé avec succès !
                </div>
            )}
            {erreur && (
                <div className="alert alert-danger" role="alert">
                    Veuillez remplir tous les champs.
                </div>
            )}
            {erreurDate && (
                <div className="alert alert-danger" role="alert">
                    Veuillez entrer des dates valides.
                </div>
            )}
        </div>
    );
};

export default CreerSouvenir;
