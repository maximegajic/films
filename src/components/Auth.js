// src/components/Auth.js
import React, { useState, useContext } from 'react';
import './Auth.css'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Importe l'authentification Firebase
import { AuthContext } from '../context/authContext'; // Importe le contexte

const Auth = () => {
  const { user } = useContext(AuthContext); // Utilise le contexte
  //const [registerMode, setRegisterMode] = useState(false); // Mode d'inscription ou de connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

/*   const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  }; */

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='auth-container'>
      {user ? (
        <div>
          <p>Connecté en tant que {user.email}</p>
          <button 
          className='logout-button'
          onClick={handleLogout} 
          >Se déconnecter
          </button>
        </div>
      ) : (
        <div>
          <h2>Connexion</h2>

          <input
            type="email"
            className='input-mail'
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className='input-mdp'
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

            <button onClick={handleLogin}className='login-button'>Se connecter</button>
          
        <p className={`error-message ${error ? 'visible' : ''}`}>
          {error && error}
        </p>
        </div>
      )}
    </div>
  );
};

export default Auth;
