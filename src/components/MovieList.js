import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieList.css';
import { fetchMovies, fetchAllMovies, fetchGenres, fetchActorSuggestions, fetchMoviesByActor } from '../api';
import { AuthContext } from '../context/authContext';
import { FilterContext } from '../context/FilterContext';

const MovieList = () => {
  const navigate = useNavigate();
  const [actorSuggestions, setActorSuggestions] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const { user } = useContext(AuthContext);
  const { page, setPage, sortBy, setSortBy, selectedGenres, setSelectedGenres, selectedActorId, setSelectedActorId, searchTerm, setSearchTerm, searchActorTerm, setSearchActorTerm } = useContext(FilterContext);
  const [genresList, setGenresList] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // Nombre total de pages

  useEffect(() => {
    const getGenres = async () => {
      const genres = await fetchGenres();
      setGenresList(genres);
    };

    getGenres();
  }, []);

  useEffect(() => {
    const getMovies = async () => {
      if (searchTerm.trim() !== '') {
        // Appelle `fetchMovies` si `searchTerm` a une valeur
        const { movies, total_results } = await fetchMovies(searchTerm);
        setFilteredMovies(movies);
        setTotalPages(Math.min(500, total_results));
      } else {
        // Sinon, utilise `fetchAllMovies`
        const { movies, total_results } = await fetchAllMovies(page, sortBy, selectedGenres.join(','), selectedActorId);
        setFilteredMovies(movies);
        setTotalPages(Math.min(500, total_results));
      }
    };
  
    getMovies();
  }, [page, sortBy, selectedGenres, selectedActorId, searchTerm]); // Ajoute `searchTerm` dans les dépendances
  



  const handleClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleConnect = () => {
    navigate('/auth');
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      const { movies, total_results } = await fetchAllMovies(page, sortBy, selectedGenres.join(',')); // Utilise les genres sélectionnés
      setFilteredMovies(movies);
      setTotalPages(Math.min(500,total_results)); // Met à jour totalMovies
      return;
    }

    const { movies, total_results } = await fetchMovies(value);
    setFilteredMovies(movies);
    setTotalPages(Math.min(500,total_results)); // Met à jour totalMovies
  };


  const handleActor = async (e) => {
    const value = e.target.value;
    setSearchActorTerm(value);
    setSelectedActorId(null);  // Réinitialise l'ID de l'acteur sélectionné
    
    // Si le champ est vide, efface les suggestions et récupère tous les films
    if (value === '') {
      setActorSuggestions([]); // Efface les suggestions d'acteurs
      const { movies, total_results } = await fetchAllMovies(page, sortBy, selectedGenres.join(','));
      setFilteredMovies(movies);
      setTotalPages(Math.min(500, total_results)); // Met à jour le total des pages
    } else {
      // Si le champ contient un nom, récupère les suggestions d'acteurs
      const suggestions = await fetchActorSuggestions(value);
      setActorSuggestions(suggestions);
    }
  };
  

  const handleActorSelect = async (actor) => {
    setSelectedActorId(actor.id);
    setSearchActorTerm(actor.name);
    setActorSuggestions([]);
    
    const { movies, total_results } = await fetchMoviesByActor(
      actor.id,  // Utilise l'ID de l'acteur directement ici
      false,
      1,
      selectedGenres.join(','),
      sortBy
    );
    
    setFilteredMovies(movies);
    setTotalPages(Math.min(500, total_results)); 
    setPage(1);
  };
  

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // Réinitialise à la première page
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prevSelected) => {
      if (prevSelected.includes(genreId)) {
        return prevSelected.filter((id) => id !== genreId); // Retire le genre si déjà sélectionné
      } else {
        return [...prevSelected, genreId]; // Ajoute le genre si non sélectionné
      }
    });
    setPage(1); // Réinitialise la page à 1 lors du changement de genre
  };

  const handleChangePage = (e, bottom) => {
    setPage(e);
    if (bottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRatedMovies = () => {
    navigate('/rated');
  };

  return (
    <div>   
      {user && <p>Connecté en tant  que {user.email}</p>}
      <input
        type="text"
        placeholder="Rechercher un film"
        value={searchTerm}
        onChange={handleSearch}
      />

<input
        type="text"
        placeholder="Rechercher un acteur"
        value={searchActorTerm}
        onChange={handleActor}
        style={{marginRight:'100px'}}
      />

      <select onChange={handleSortChange}>
  <option value="popularity.desc">Plus populaire</option>
        <option value="popularity.asc">Moins populaire</option>
        <option value="release_date.desc">Plus récent</option>
        <option value="release_date.asc">Moins récent</option>
        <option value="vote_average.desc">Mieux noté</option>
        <option value="vote_average.asc">Moins bien noté</option>
  </select>

  <button type='button' className='button-rated' onClick={handleRatedMovies}>
Voir uniquement les films évalués
          </button>

{/* Affichage des suggestions d’acteurs */}

{actorSuggestions.length > 0 && (
    <ul className="actor-suggestions">
        {actorSuggestions.map((actor) => (
          actor.profile_path &&
          <li key={actor.id} onClick={() => handleActorSelect(actor)}>
          <img 
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}` : '../images/tete.jpg'} 
              alt={actor.name} 
              className="actor-image" 
              onError={(e) => {
                  e.target.onerror = null; // Évite une boucle infinie
                  e.target.src = '../images/tete.jpg'; // Charge l'image par défaut si une erreur se produit
              }}
              style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }}
          />
          <span>{actor.name}</span>
      </li>
  ))}
</ul>
)}


      


      {/* Section pour les genres en ligne */}
      <div className="genres-container">
        {genresList.map((g) => (
          <div key={g.id} className="genre-item">
            <label>
              <input
                type="checkbox"
                value={g.id}
                checked={selectedGenres.includes(g.id)}
                onChange={() => handleGenreChange(g.id)}
              />
              {g.name}
            </label>
          </div>
        ))}
      </div>

      <div className="pagination-buttons">
        {page > 1 && <button onClick={() => handleChangePage(1, false)}>1</button>}
        {page > 11 && <button onClick={() => handleChangePage(page - 10, false)}>{page - 10}</button>}
        {page > 2 && <button onClick={() => handleChangePage(page - 1, false)}>{page - 1}</button>}
        <h6>{page}</h6>
        {page < totalPages - 1 && <button onClick={() => handleChangePage(page + 1, false)}>{page + 1}</button>}
        {page < totalPages - 10 && <button onClick={() => handleChangePage(page + 10, false)}>{page + 10}</button>}
        {page < totalPages && <button onClick={() => handleChangePage(totalPages, false)}>{totalPages}</button>}
      </div>

      {!user ? (
        <button type='button' className='connect-button' onClick={handleConnect}>
          <img 
            src={require('../images/user.webp')}
            alt="Utilisateur"
            className="button-image"
          />
        </button>
      ) : (
        <>
          <button type='button' className='connect-button' onClick={handleConnect}>
            <img 
              src={require('../images/user.webp')}
              alt="Utilisateur"
              className="button-image"
            />
          </button>
        </>
      )}

{page > 500 && (
  <p>La pagination ne peut pas dépasser 500. Veuillez réduire votre page.</p>
)}
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

<div className="pagination-buttons">
        {page > 1 && <button onClick={() => handleChangePage(1, true)}>1</button>}
        {page > 11 && <button onClick={() => handleChangePage(page - 10, true)}>{page - 10}</button>}
        {page > 2 && <button onClick={() => handleChangePage(page - 1, true)}>{page - 1}</button>}
        <h6>{page}</h6>
        {page < totalPages - 1 && <button onClick={() => handleChangePage(page + 1, true)}>{page + 1}</button>}
        {page < totalPages - 10 && <button onClick={() => handleChangePage(page + 10, true)}>{page + 10}</button>}
        {page < totalPages && <button onClick={() => handleChangePage(totalPages, true)}>{totalPages}</button>}
      </div>
    </div>

    
  );
};

export default MovieList;