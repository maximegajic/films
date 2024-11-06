// src/services/reviewService.js
import { doc, setDoc, getDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Importer Firestore

// Fonction pour ajouter un avis
export const addReview = async (movieId, review, rating) => {
  try {
    const timestamp = new Date(); // Obtient l'heure actuelle
    await setDoc(doc(db, "reviews", movieId.toString()), {
      review: review,   // Le texte de l'avis
      rating: rating,   // La note donnée
      timestamp: timestamp, // Date et heure de l'ajout de l'avis
    });
    console.log('Avis ajouté avec succès');
    console.log(timestamp);
  } catch (e) {
    console.error("Erreur lors de l'ajout de l'avis :", e);
  }
};

// Fonction pour récupérer l'avis d'un film spécifique
export const getReview = async (movieId) => {
  const docRef = doc(db, "reviews", movieId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data(); // Retourne l'avis trouvé
  } else {
    return null; // Pas d'avis trouvé
  }
};

// Fonction pour supprimer un avis
export const removeReview = async (movieId) => {
  try {
    await deleteDoc(doc(db, "reviews", movieId.toString()));
    console.log('Avis supprimé avec succès');
  } catch (e) {
    console.error("Erreur lors de la suppression de l'avis :", e);
  }
};

// Exemple de fonction pour récupérer le nombre d'avis d'un utilisateur
export const getReviewCount = async () => {
  try {
    const q = collection(db, "reviews");
    const querySnapshot = await getDocs(q);
    return querySnapshot.size; // Retourne le nombre d'avis
  } catch (e) {
    console.error("Erreur lors de la récupération du nombre d'avis :", e);
    return 0; // Retourne 0 en cas d'erreur
  }
};

// Fonction pour calculer la note moyenne
export const calculateAverageRating = async () => {
  const reviewsSnapshot = await getDocs(collection(db, "reviews")); // Récupère tous les avis
  let totalRating = 0;
  let reviewCount = 0;

  reviewsSnapshot.forEach((doc) => {
    totalRating += doc.data().rating; // Additionne les notes
    reviewCount++; // Compte le nombre d'avis
  });

  return reviewCount > 0 ? (totalRating / reviewCount).toFixed(2) : 0; // Retourne la note moyenne
};



// Fonction pour obtenir les 5 films les mieux notés par genre
export const getTopRatedMovies = async (genreId) => {
  const reviewsSnapshot = await getDocs(collection(db, "reviews")); // Récupère tous les avis
  const movies = [];

  reviewsSnapshot.forEach((doc) => {
    const data = doc.data();

    movies.push({
      movieId: doc.id, // Utilisez l'ID du document comme ID de film
      rating: data.rating,
    });
  });

  const movieDetailsPromises = movies.map(async (movie) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.movieId}?api_key=ca1afb22f6a88b8a4cf40c42b2afac8b&language=en-US`);
    const movieDetails = await response.json();
    
    // Si genreId est une chaîne vide, retourne le film sans tester les genres
    if (!genreId) {
      return {
        movieId: movie.movieId,
        title: movieDetails.title,
        rating: movie.rating,
      };
    }
    
    // Vérifie si le film appartient au genre spécifié
    const isGenreMatch = movieDetails.genres.some(genre => genre.id === parseInt(genreId));
    console.log('Genre ID:', genreId, 'Movie Genres:', movieDetails.genres.map(genre => genre.id), 'Match:', isGenreMatch);
  
    return isGenreMatch ? {
      movieId: movie.movieId,
      title: movieDetails.title,
      rating: movie.rating,
    } : null;
  });
  

  // Attendre que toutes les promesses soient résolues
  const ratedMovies = await Promise.all(movieDetailsPromises);

  // Filtrer les films qui ne sont pas nuls
  const filteredRatedMovies = ratedMovies.filter(movie => movie !== null);

  // Trie les films par note de manière décroissante
  filteredRatedMovies.sort((a, b) => b.rating - a.rating);
  console.log(filteredRatedMovies.slice(0, 5));

  // Limite aux 5 premiers films
  return filteredRatedMovies.slice(0, 5);
};


export const getRatedMovies = async (page, sortBy, genreId) => {
  const reviewsSnapshot = await getDocs(collection(db, "reviews")); // Récupère tous les avis
  const movies = [];

  reviewsSnapshot.forEach((doc) => {
    movies.push({
      movieId: doc.id, // Utilisez l'ID du document comme ID de film
      personalRating: doc.data().rating, // Récupère la note personnelle de la base de données
    });
  });

  const movieDetailsPromises = movies.map(async (movie) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.movieId}?api_key=ca1afb22f6a88b8a4cf40c42b2afac8b&language=en-US`);
    const movieDetails = await response.json();

    // Si genreId est une chaîne vide, retourne le film sans tester les genres
    if (!genreId) {
      return {
        id: movieDetails.id,
        title: movieDetails.title,
        rating: movie.personalRating, // Utilise la note personnelle
        releaseDate: movieDetails.release_date,
        popularity: movieDetails.popularity,
        poster_path: movieDetails.poster_path, // URL de l'affiche
      };
    }
    
    // Vérifie si le film appartient au genre spécifié
    const isGenreMatch = movieDetails.genres.some(genre => genre.id === parseInt(genreId));
  
    return isGenreMatch ? {
      id: movieDetails.id,
      title: movieDetails.title,
      rating: movie.personalRating, // Utilise la note personnelle
      releaseDate: movieDetails.release_date,
      popularity: movieDetails.popularity,
      poster_path: movieDetails.poster_path, // URL de l'affiche
    } : null;
  });

  const ratedMovies = await Promise.all(movieDetailsPromises);
  const filteredMovies = ratedMovies.filter(movie => movie !== null);

  // Tri selon la note personnelle
  if (sortBy === 'vote_average.desc') {
    filteredMovies.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'vote_average.asc') {
    filteredMovies.sort((a, b) => a.rating - b.rating);
  } else if (sortBy === 'release_date.desc') {
    filteredMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  } else if (sortBy === 'release_date.asc') {
    filteredMovies.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  } else if (sortBy === 'popularity.asc') {
    filteredMovies.sort((a, b) => a.popularity - b.popularity);
  } else {
    filteredMovies.sort((a, b) => b.popularity - a.popularity);
  }

  const startIndex = (page - 1) * 20;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + 20);

  return {
    total_results: Math.ceil(filteredMovies.length / 20),
    movies: paginatedMovies
  };
};





