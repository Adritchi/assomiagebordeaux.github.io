import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/design/pages/login.css';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/images/LogoAMB.png';
import '../../assets/design/commun/tuileEvent.css';

function Login() {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [statutConnexion, setStatutConnexion] = useState('');
  const [messageErreur, setMessageErreur] = useState('');
  const [tentativesRestantes, setTentativesRestantes] = useState(5); // Nombre de tentatives restantes
  const [estBanni, setEstBanni] = useState(false); // Pour vérifier si l'utilisateur est banni
  const historique = useHistory();

  const verifierStatutConnexion = async () => {
    try {
      const reponse = await axios.get('/estAdminConnecte'); // Une route pour vérifier l'état de connexion
      if (reponse.data.adminConnecte === true) {
        historique.push('/');
      }
    } catch (erreur) {
      console.error('Erreur lors de la vérification du statut de connexion :', erreur);
    }
  };
  useEffect(() => {
    verifierStatutConnexion(); // Appel à chaque rendu de la page
  }, []);

  useEffect(() => {
    const verifierIPBannie = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/verifierBannissementIp`);
        setEstBanni(res.data.banned);
        console.log(estBanni);
      } catch (err) {
      }
    };
    verifierIPBannie ();
  }, []);

  const soumettreFormulaire = async (element) => {
    element.preventDefault();
    if (estBanni) {
      setMessageErreur('Vous êtes banni. Réessayez plus tard.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/connexion', { identifiant, motDePasse });
      setStatutConnexion(res.data.status);
      setMessageErreur('');
    } catch (err) {
      setStatutConnexion('Echec');
      setTentativesRestantes(prevTentatives  => prevTentatives  - 1); // Diminue le nombre de tentatives restantes
      setMessageErreur(`Identifiant ou mot de passe incorrect. Il vous reste ${tentativesRestantes - 1} tentatives.`);
      if (tentativesRestantes - 1 === 0) {
        const res = await axios.get('http://localhost:3000/bannissementIP');
        setEstBanni(true);
      }
    }
  }

  useEffect(() => {
    if (statutConnexion === "success") {
      const identifiantTempsEcoule = setTimeout(() => {
        historique.push('/');
      }, 5000);

      return () => {
        clearTimeout(identifiantTempsEcoule);
      };
    }
  }, [statutConnexion, historique]); 

  return (
    <>
      {statutConnexion === "success" ? (
        <section>
          <h1 className='Success'>Succès !</h1>
          <h2 className='Redirection'>Redirection en cours...</h2>
        </section>
      ) : (
        <div className={'login-page-mainContainer'}>
          <div className={'login-page-logoTitleContainer'}>
            <img src={logo} alt="Logo de l'association" className={'login-page-logo'} />
            <h2 className={'login-page-title'}>Administrateur</h2>
          </div>
          <div className={'login-page-inputContainer'}>
            <form onSubmit={soumettreFormulaire}>
              <div className={'login-page-inputContainer'}>
                <label htmlFor="id">Identifiant</label>
                <input className={'login-page-inputBox'} placeholder='Entrez votre identifiant' onChange={element => setIdentifiant(element.target.value)} />
              </div>
              <div className={'login-page-inputContainer'}>
                <label htmlFor="password">Mot de passe</label>
                <input type="password" className={'login-page-inputBox'} placeholder='Entrez votre mot de passe' onChange={element => setMotDePasse(element.target.value)} />
              </div>
              {messageErreur && <p className="error-message">{messageErreur}</p>}
              <div className={'module-login-info-buttons'}>
                <button className={'module-login-info-buttons-button2 '} disabled={tentativesRestantes === 0 || estBanni}>Connexion</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
