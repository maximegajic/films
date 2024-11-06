// src/components/MovieDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Permet de récupérer les paramètres d'URL
import { fetchMovieById, fetchMovieCredits } from '../api'; // Importe la fonction pour récupérer les détails d'un film et les acteurs
import { getReview, addReview, removeReview } from '../services/reviewService'; // Utilise addReview et removeReview pour gérer les avis
import './MovieDetails.css'; // Ton fichier CSS pour le style
import { AuthContext } from '../context/authContext'; // Importe le contexte

const MovieDetail = () => {
  const { id } = useParams(); // Récupère l'ID du film depuis l'URL
  const [movie, setMovie] = useState(null); // État pour stocker les informations du film
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [review, setReviewData] = useState(''); // État pour l'avis
  const [rating, setRating] = useState(""); // État pour la note
  const [existingReview, setExistingReview] = useState(null); // État pour l'avis existant
  const [cast, setCast] = useState([]); // État pour stocker les acteurs
  const { user } = useContext(AuthContext); // Utilise le contexte
  const navigate = useNavigate();

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        const movieData = await fetchMovieById(id); // Appelle l'API pour récupérer les détails du film
        const movieCredits = await fetchMovieCredits(id); // Récupère les acteurs du film
        setMovie(movieData); // Met à jour l'état avec les données du film
        setCast(movieCredits.slice(0, 5)); // Garde les 5 premiers acteurs (ou plus selon tes préférences)
        const movieReview = await getReview(id); // Récupère l'avis existant
        setReviewData(movieReview ? movieReview.review : ''); // Met à jour l'avis
        setRating(movieReview ? movieReview.rating : 0); // Met à jour la note
        setExistingReview(movieReview); // Met à jour l'avis existant
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
      } finally {
        setLoading(false); // Met à jour l'état de chargement
      }
    };

    getMovieDetails();
  }, [id]); // Appelle la fonction à chaque fois que l'ID change

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    await addReview(id, review, rating); // Ajoute l'avis et la note
    const movieReview = await getReview(id);
    setExistingReview(movieReview);
    setReviewData(''); // Réinitialise le champ d'avis
    setRating(0); // Réinitialise la note
  };

  const handleRemoveReview = async () => {
    await removeReview(id); // Supprime l'avis
    setExistingReview(null); // Supprime l'avis existant de l'état
  };

  if (loading) {
    return <p>Chargement...</p>; // Affiche un message de chargement
  }

  if (!movie) {
    return <p>Film non trouvé</p>;
  }

  

  return (
<div>
  <button onClick={() => navigate(-1)} className="back-button">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M18 6L6 18M6 6l12 12" stroke="red" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </button>
  <h2>{movie.title}</h2>
  <div className="flex-container">
    {/* Affiche du film */}
    <div className="poster">
      {movie.poster_path ? (
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // URL complète de l'affiche
          alt={`${movie.title} poster`} 
          className="movie-poster" 
        />
      ) : (
        <div className='empty-poster'>
        <p>Aucune affiche disponible</p>
        </div>
      )}
    </div>

    {/* Détails du film */}
    <div className="movie-details">
      
      <p><strong>Aperçu :</strong> {movie.overview}</p>

      {/* Affichage des acteurs */}
      <div className="cast-list">
        <h3>Acteurs principaux :</h3>
        <ul>
          {cast.map((actor) => (
            <li key={actor.id}>
              {actor.name} - <em>{actor.character}</em>
            </li>
          ))}
        </ul>
      </div>
      <p><strong>Note :</strong> {movie.vote_average || 'Aucune note disponible'}/10</p>
    </div>
  </div>



      {/* Affichage de l'avis existant */}
      {existingReview && (
        <div className="existing-review">
        <p className="review-rating"><strong>Note :</strong> {existingReview.rating}/10</p>
        <p className="review-text"><strong></strong> {existingReview.review}</p>
        <p className="review-date">
          <em>Date : {existingReview.timestamp ? 
            new Date(existingReview.timestamp.seconds * 1000).toLocaleDateString() : 
            'Date invalide'}
          </em>
        </p>
        { user && (
          <button onClick={handleRemoveReview} className="remove-button">
            Retirer l'avis
          </button>
        )}
      </div>
      )}

      {/* Formulaire d'avis */}
      { user && <form onSubmit={handleSubmit}>
        <div className='review-container'>
          <label htmlFor="review" className="review-label">{existingReview ? "Modifier l'avis :" : "Ajouter un avis :"}</label>
          <textarea
            id="review"
            className="review-textarea"
            value={review}
            onChange={(e) => setReviewData(e.target.value)} // Met à jour l'état de l'avis
            required // Champ obligatoire
          />
        </div>
        <div className="rating-container">
  <div className="rating-input-group">
    <label htmlFor="rating">Note (0 à 10) :</label>
    <input
      type="number"
      style={{marginTop:'7px'}}
      id="rating"
      value={rating}
      onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
      min="0"
      max="10"
      step="0.5"
      required
    />
  </div>
  <button type="submit" className="submit-button">
    {existingReview ? "Modifier l'avis" : "Ajouter un avis"}
  </button>
</div>


      </form>
}

    </div>
  );
};

export default MovieDetail;
