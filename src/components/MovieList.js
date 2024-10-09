// src/components/MovieList.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movies } from '../data/movies'; // Liste des films
import './MovieList.css'; // Ton fichier CSS pour le style

const MovieList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // Stocke la valeur de recherche
  const [filteredMovies, setFilteredMovies] = useState(movies); // Stocke les films filtrés

  const handleClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div>
      <h2>Liste des films</h2>

      {/* Champ de recherche en temps réel */}
      <input
        type="text"
        placeholder="Rechercher un film"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          console.log("Valeur de recherche :", e.target.value); // Affiche la valeur de recherche
          
          // Filtre les films en fonction de la saisie
          const results = movies.filter(movie =>
            movie.title.toLowerCase().includes(e.target.value.toLowerCase())
          );
          console.log("Résultats filtrés :", results); // Affiche les résultats filtrés
          setFilteredMovies(results); // Met à jour la liste des films filtrés
        }}
      />

      {/* Afficher un message si aucun film n'est trouvé */}
      {filteredMovies.length === 0 ? (
        <p>Aucun film trouvé</p>
      ) : (
        <div className="movie-list">
          {filteredMovies.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
              onClick={() => handleClick(movie.id)}
            >
              <div
                className="movie-image"
                style={{
                  backgroundImage: `url(${movie.poster})`, // Utiliser l'URL de l'affiche depuis l'objet movie
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  height: '300px', // Hauteur de l'image
                }}
              />
              <h3>{movie.title}</h3> {/* Titre en dessous de l'image */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
