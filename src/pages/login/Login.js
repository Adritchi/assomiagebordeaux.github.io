import React, { useState, useEffect } from 'react';
import '../../assets/design/pages/login.css';
import { useHistory } from 'react-router-dom';

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [attemptsLeft, setAttemptsLeft] = useState(5); // Nombre de tentatives restantes
    const [isBanned, setIsBanned] = useState(false); // Pour vérifier si l'utilisateur est banni
    const history = useHistory();

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/checkLoginStatus');
            const data = await response.json();
            if (data.adminConnected === true) {
                history.push('/');
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'état de connexion :', error);
        }
    };
    useEffect(() => {
        checkLoginStatus(); // Appel à chaque rendu de la page
    }, []);

    useEffect(() => {
        const checkIPBanned = async () => {
            try {
                const res = await fetch('/checkIPBanned');
                const data = await res.json();
                setIsBanned(data.banned);
            } catch (err) {
                console.error('Erreur lors de la vérification du statut d\'interdiction IP :', err);
            }
        };
        checkIPBanned();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isBanned) {
            setErrorMessage('Vous êtes banni. Réessayez plus tard.');
            return;
        }
        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, password })
            });
            const data = await res.json();
            setLoginStatus(data.status);
            setErrorMessage('');
        } catch (err) {
            setLoginStatus('Failed');
            setAttemptsLeft(prevAttempts => prevAttempts - 1); // Diminue le nombre de tentatives restantes
            setErrorMessage(`Identifiant ou mot de passe incorrect. Il vous reste ${attemptsLeft - 1} tentatives.`);
            if (attemptsLeft - 1 === 0) {
                await fetch('/banIP');
                setIsBanned(true);
            }
        }
    }

    useEffect(() => {
        if (loginStatus === "success") {
            const timeoutId = setTimeout(() => {
                history.push('/');
            }, 5000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [loginStatus, history]);

    return (
        <>
            {loginStatus === "success" ? (
                <section>
                    <h1 className='Success'>Success!</h1>
                    <h2 className='Redirection'>Redirecting..</h2>
                </section>
            ) : (
                <div className={'login-page-mainContainer'}>
                    <div className={'login-page-inputContainer'}>
                        <form onSubmit={handleSubmit}>
                            <div className={'login-page-inputContainer'}>
                                <label htmlFor="id">Identifiant</label>
                                <input className={'login-page-inputBox'} placeholder='Entrez votre identifiant' onChange={e => setId(e.target.value)} />
                            </div>
                            <div className={'login-page-inputContainer'}>
                                <label htmlFor="password">Mot de passe</label>
                                <input type="password" className={'login-page-inputBox'} placeholder='Entrez votre mot de passe' onChange={e => setPassword(e.target.value)} />
                            </div>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button className={'login-page-inputButton'} disabled={attemptsLeft === 0 || isBanned}>Login</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Login;
