// src/context/FilterContext.js
import React, { createContext, useState } from 'react';

// Crée le contexte
export const FilterContext = createContext();

// Fournisseur de contexte
export const FilterProvider = ({ children }) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc'); // Valeur par défaut pour le tri
  const [selectedGenres, setSelectedGenres] = useState([]); // Stocke les genres sélectionnés

  return (
    <FilterContext.Provider value={{ page, setPage, sortBy, setSortBy, selectedGenres, setSelectedGenres }}>
      {children}
    </FilterContext.Provider>
  );
};