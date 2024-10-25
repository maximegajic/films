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



// Fonction pour obtenir les 5 films les mieux notés
export const getTopRatedMovies = async () => {
  const reviewsSnapshot = await getDocs(collection(db, "reviews")); // Récupère tous les avis
  const movies = [];

  reviewsSnapshot.forEach((doc) => {
    const data = doc.data();
    
    movies.push({
      movieId: doc.id, // Utilisez l'ID du document comme ID de film
      rating: data.rating,
    });
  });

  // Trie les films par note de manière décroissante
  movies.sort((a, b) => b.rating - a.rating);

  // Limite aux 5 premiers films
  const topMovies = movies.slice(0, 5);

  // Récupération des titres depuis l'API TMDB
  const movieDetailsPromises = topMovies.map(async (movie) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.movieId}?api_key=ca1afb22f6a88b8a4cf40c42b2afac8b&language=en-US`);
    const movieDetails = await response.json();
    return {
      movieId: movie.movieId,
      title: movieDetails.title, // Ajoutez le titre du film
      rating: movie.rating,
    };
  });

  // Attendez que toutes les promesses soient résolues
  return Promise.all(movieDetailsPromises);
};