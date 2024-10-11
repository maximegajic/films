import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieList.css';
import { fetchMovies, fetchPopularMovies } from '../api'; // Importe la fonction pour récupérer les films populaires

const MovieList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // Stocke la valeur de recherche
  const [filteredMovies, setFilteredMovies] = useState([]); // Stocke les films filtrés

  // Utiliser useEffect pour afficher les films populaires au début
  useEffect(() => {
    const getPopularMovies = async () => {
      const popularMovies = await fetchPopularMovies(); // Appel à l'API pour récupérer les films populaires
      setFilteredMovies(popularMovies); // Met à jour les films affichés par défaut
    };

    getPopularMovies(); // Appelle la fonction dès que le composant est monté
  }, []);

  const handleClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      const popularMovies = await fetchPopularMovies(); // Si la recherche est vide, afficher les films populaires
      setFilteredMovies(popularMovies);
      return;
    }

    const results = await fetchMovies(value); // Recherche des films en fonction de la saisie
    setFilteredMovies(results);
  };

  return (
    <div>
      <h2>Liste des films</h2>

      {/* Champ de recherche en temps réel */}
      <input
        type="text"
        placeholder="Rechercher un film"
        value={searchTerm}
        onChange={handleSearch}
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
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  height: '300px',
                }}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
