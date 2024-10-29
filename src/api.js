// src/api.js
import axios from 'axios';

const API_KEY = 'ca1afb22f6a88b8a4cf40c42b2afac8b'; // Remplacez par votre clé API
const BASE_URL = 'https://api.themoviedb.org/3'; // URL de base de l'API

export const fetchMovies = async (searchTerm) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: searchTerm,
          //include_adult: true,
        },
      });
      const movies = response.data.results; // Récupère les films
        const totalResults = response.data.total_pages; // Récupère le nombre total de films
        

        return { movies, total_results: totalResults }; // Retourne un objet avec les films et le nombre total
    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
      return { movies: [], total_results: 0 }; // Retourne un objet avec un tableau vide et 0 en cas d'erreur
    }
  };
  
  export const fetchAllMovies = async (page, sortBy, genre, actorId) => {
    try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            params: {
                api_key: API_KEY,
                page: page,
                sort_by: sortBy,
                with_genres: genre,
                with_cast: actorId,
                //include_adult: true,
            },
        });


        const movies = response.data.results; // Récupère les films
        const totalResults = response.data.total_pages; // Récupère le nombre total de films
        

        return { movies, total_results: totalResults }; // Retourne un objet avec les films et le nombre total
    } catch (error) {
        console.error('Erreur lors de la récupération des films', error);
        return { movies: [], total_results: 0 }; // Retourne un objet avec un tableau vide et 0 en cas d'erreur
    }
};

  
  

// Récupération des détails d'un film par son ID
export const fetchMovieById = async (id) => {
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data; // Retourne les détails du film
  };


  // Récupérer les acteurs d'un film par son ID
export const fetchMovieCredits = async (id) => {
    const response = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.cast; // Retourne la liste des acteurs
  };

// récupère tous les genres disponibles
  export const fetchGenres = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
        params: {
          api_key: API_KEY,
        },
      });
      return response.data.genres || []; // Retourne la liste des genres
    } catch (error) {
      console.error('Erreur lors de la récupération des genres', error);
      return []; // Retourne un tableau vide en cas d'erreur
    }
  };

  export const fetchActorSuggestions = async (query) => {
    if (!query) return []; // Si le champ est vide, n’effectue pas la requête
    
    const response = await axios.get(`${BASE_URL}/search/person`, {
      params: {
        api_key: API_KEY,
        query, // Requête partielle
      }
    });
  
    return response.data.results; // Retourne la liste des suggestions
  };
  

 export const fetchMoviesByActor = async (actorId, includeAdult = false,page,  genre, sortBy) => {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_cast: actorId, // Utilise l’ID pour filtrer
        include_adult: includeAdult,
        page: page,
        sort_by: sortBy,
        with_genres: genre,
      },
    });
  
    const movies = response.data.results; // Récupère les films
    const totalResults = response.data.total_pages; // Récupère le nombre total de films
    

    return { movies, total_results: totalResults }; // Retourne un objet avec les films et le nombre total
  };
  
  
  