// src/App.js
import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetails';
import Auth from './components/Auth'; // Adapte le chemin si nécessaire


function App() {
  return (
    <Router>
      <div className="App">
        <h1>Bibliothèque de films</h1>
        <Routes>
          {/* Route pour la liste de films */}
          <Route path="/" element={<MovieList />} />
          {/* Route dynamique pour afficher les détails d'un film */}
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/auth" element={<Auth />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
