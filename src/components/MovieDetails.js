// src/components/MovieDetail.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Permet de récupérer les paramètres d'URL
import { movies } from '../data/movies'; // Liste des films
import './MovieDetails.css'; // Ton fichier CSS pour le style

const MovieDetail = () => {
  const { id } = useParams(); // Récupère l'ID du film depuis l'URL
  const movie = movies.find((m) => m.id === parseInt(id)); // Trouve le film correspondant

  if (!movie) {
    return <p>Film non trouvé</p>;
  }

  return (
    <div>
      <h2>{movie.title}</h2>
      <p><strong>Genre :</strong> {movie.genre}</p>
      <p><strong>Aperçu :</strong> {movie.overview}</p>
      <p><strong>Avis personnel :</strong> {movie.personalReview.review}</p>
      <p><strong>Note :</strong> {movie.personalReview.rating}/10</p>
    </div>
  );
};

export default MovieDetail;
