// src/services/reviewService.js
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
