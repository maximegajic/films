import React, { useState, useEffect, useContext, useCallback } from 'react';
import './Auth.css';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { getReviewCount, calculateAverageRating, getTopRatedMovies } from '../services/reviewService';

const Auth = () => {
  const { user } = useContext(AuthContext);
  const [reviewCount, setReviewCount] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

    // Utilisation de useCallback pour stabiliser la référence de handleLogin
    const handleLogin = useCallback(
      async (e) => {
        if (e) e.preventDefault();
        try {
          await signInWithEmailAndPassword(auth, email, password);
          navigate(`/`);
        } catch (error) {
          setError(error.message);
        }
      },
      [email, password, navigate]
    );

 // Gestion globale de la touche "Entrée"
 useEffect(() => {
  const handleEnterKey = (e) => {
    if (e.key === 'Enter' && !user) {
      handleLogin();
    }
  };
  document.addEventListener('keydown', handleEnterKey);
  return () => {
    document.removeEventListener('keydown', handleEnterKey);
  };
}, [user, handleLogin]);



  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate(`/`);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const count = await getReviewCount();
      setReviewCount(count);
      const avgRating = await calculateAverageRating();
      const topMovies = await getTopRatedMovies();
      setAverageRating(avgRating);
      setTopRatedMovies(topMovies);
    };
    fetchData();
  }, [user]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

    // Appeler handleLogin si "Enter" est pressé
    const handleKeyDown = (e) => {
      console.log("coucou");
      if (e.key === 'Enter') {
        e.preventDefault();
        handleLogin(e);
      }
    };
  

    

  return (
    <div className='auth-container'>
      <button onClick={() => navigate(-1)} className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M18 6L6 18M6 6l12 12" stroke="red" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {user ? (
        <div>
          <p>Connecté en tant que {user.email}</p>
          <div className='stat-container'>
            <p>Nombre d'avis : {reviewCount}</p>
            <p>Note moyenne : {averageRating}</p>
            <p>Top 5 films les mieux notés:</p>
            <ul>
              {topRatedMovies.map((movie) => (
                <li key={movie.movieId} onClick={() => handleMovieClick(movie.movieId)} style={{ cursor: 'pointer' }}>
                  {movie.title} - {movie.rating} ⭐
                </li>
              ))}
            </ul>
          </div>
          <button className='logout-button' onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} onKeyDown={handleKeyDown}>
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
          <button type="submit" className='login-button'>Se connecter</button>
          <p className={`error-message ${error ? 'visible' : ''}`}>
            {error && error}
          </p>
        </form>
      )}
    </div>
  );
};

export default Auth;
