// src/components/MovieDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom'; // Permet de récupérer les paramètres d'URL
import { fetchMovieById, fetchMovieCredits } from '../api'; // Importe la fonction pour récupérer les détails d'un film et les acteurs
import { getReview, addReview, removeReview } from '../services/reviewService'; // Utilise addReview et removeReview pour gérer les avis
import './MovieDetails.css'; // Ton fichier CSS pour le style
import { AuthContext } from '../context/authContext'; // Importe le contexte

const MovieDetail = () => {
  const { id } = useParams(); // Récupère l'ID du film depuis l'URL
  const [movie, setMovie] = useState(null); // État pour stocker les informations du film
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [review, setReviewData] = useState(''); // État pour l'avis
  const [rating, setRating] = useState(0); // État pour la note
  const [existingReview, setExistingReview] = useState(null); // État pour l'avis existant
  const [cast, setCast] = useState([]); // État pour stocker les acteurs
  const { user } = useContext(AuthContext); // Utilise le contexte

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
      <h2>{movie.title}</h2>
      <p><strong>Aperçu :</strong> {movie.overview}</p>
      <p><strong>Note :</strong> {movie.vote_average || 'Aucune note disponible'}/10</p>
            {/* Affichage des acteurs */}
            <div className="cast-list">
        <h3>Acteurs principaux :</h3>
        <ul>
          {cast.map((actor) => (
            <li key={actor.id}>
              {actor.name} - <em>{actor.character}</em> {/* Affiche le nom de l'acteur et son rôle */}
            </li>
          ))}
        </ul>
      </div>

      {/* Affichage de l'avis existant */}
      {existingReview && (
        <div className="existing-review">
          <h3>Avis actuel :</h3>
          <p><strong>Note :</strong> {existingReview.rating}/10</p>
          <p><strong>Avis :</strong> {existingReview.review}</p>
          <p><em>Date : {existingReview.timestamp ? 
          new Date(existingReview.timestamp.seconds * 1000).toLocaleDateString() : 
          'Date invalide'}</em></p> {/* Affiche la date */}
          { user && <button onClick={handleRemoveReview}>Retirer l'avis</button>} {/* Bouton pour supprimer l'avis */}
        </div>
      )}

      {/* Formulaire d'avis */}
      { user && <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="review">Votre avis :</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReviewData(e.target.value)} // Met à jour l'état de l'avis
            required // Champ obligatoire
          />
        </div>
        <div>
          <label htmlFor="rating">Note (1 à 10) :</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))} // Met à jour l'état de la note
            min="1"
            max="10"
            required // Champ obligatoire
          />
        </div>
        <button type="submit" style={{marginBottom:'40px', marginTop:'20px'}}>{existingReview ? "Modifier l'avis" : "Ajouter un avis"}</button> {/* Bouton pour soumettre l'avis */}
      </form>
}

    </div>
  );
};

export default MovieDetail;
