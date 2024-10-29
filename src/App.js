// src/App.js
import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';

import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetails';
import Auth from './components/Auth'; // Adapte le chemin si nécessaire
import { FilterProvider } from './context/FilterContext'; // Importe le FilterProvider


function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <Link to="/">
            <h1>Bibliothèque de films</h1>
          </Link>
        </header>
        {/* Fournisseur de contexte pour les filtres */}
        <FilterProvider>
          <Routes>
            {/* Route pour la liste de films */}
            <Route path="/" element={<MovieList />} />
            {/* Route dynamique pour afficher les détails d'un film */}
            <Route path="/movie/:id" element={<MovieDetail />} />
            {/* Route pour l'authentification */}
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </FilterProvider>
      </div>
    </Router>
  );
}

export default App;
