// src/context/FilterContextR.js
import React, { createContext, useState } from 'react';

// Crée le contexte
export const FilterContextR = createContext();

// Fournisseur de contexte
export const FilterRProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc'); // Valeur par défaut pour le tri
  const [selectedGenres, setSelectedGenres] = useState([]); // Stocke les genres sélectionnés
  const [selectedActorId, setSelectedActorId] = useState(null);

  return (
    <FilterContextR.Provider value={{ page, setPage, sortBy, setSortBy, selectedGenres, setSelectedGenres, selectedActorId, setSelectedActorId }}>
      {children}
    </FilterContextR.Provider>
  );
};