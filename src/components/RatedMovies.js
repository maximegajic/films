import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './RatedMovies.css';
import { fetchGenres } from '../api';
import { AuthContext } from '../context/authContext';
import { FilterContextR } from '../context/FilterContextR';
import { getRatedMovies } from '../services/reviewService';

const RatedMovies = () => {
  const navigate = useNavigate();
  /* const [searchTerm, setSearchTerm] = useState(''); */
  const [filteredMovies, setFilteredMovies] = useState([]);
  const { user } = useContext(AuthContext);
  const { page, setPage, sortBy, setSortBy, selectedGenres, setSelectedGenres} = useContext(FilterContextR);
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
      const { movies, total_results } = await getRatedMovies(page, sortBy, selectedGenres.join(',')); // Envoie les genres sélectionnés
      setFilteredMovies(movies);
      setTotalPages(Math.min(500,total_results)); // Met à jour totalMovies
    };

    getMovies();
  }, [page, sortBy, selectedGenres]);



  const handleClick = (id) => {
    navigate(`/movie/${id}`);
  };

  const handleConnect = () => {
    navigate('/auth');
  };

/*   const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      const { movies, total_results } = await getRatedMovies(page, sortBy, selectedGenres.join(',')); 
      setFilteredMovies(movies);
      setTotalPages(Math.min(500,total_results)); 
    }

    const { movies, total_results } = await fetchMovies(value);
    console.log(movies);
    setFilteredMovies(movies);
    setTotalPages(Math.min(500,total_results)); 
  }; */



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


  return (
    <div>
      <button onClick={() => navigate(-1)} className="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M18 6L6 18M6 6l12 12" stroke="red" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>  
      {user && <p>Connecté en tant  que {user.email}</p>}
      <h2>Mes avis</h2>
{/*       <input
        type="text"
        placeholder="Rechercher un film"
        value={searchTerm}
        onChange={handleSearch}
      /> */}



  <select className='tri-button' onChange={handleSortChange}>
        <option value="popularity.desc">Plus populaire</option>
        <option value="popularity.asc">Moins populaire</option>
        <option value="release_date.desc">Plus récent</option>
        <option value="release_date.asc">Moins récent</option>
        <option value="vote_average.desc">Mieux noté</option>
        <option value="vote_average.asc">Moins bien noté</option>
  </select>





      


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

export default RatedMovies;