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
        },
      });
      return response.data.results; // Retourne les résultats des films
    } catch (error) {
      console.error("Erreur lors de la récupération des films :", error);
      return []; // Retourne un tableau vide en cas d'erreur
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


// Récupérer les films populaires
export const fetchPopularMovies = async () => {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  };