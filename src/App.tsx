/**
 * Arrr! This be the main vessel of our application!
 * The mighty container that holds our ship's grocery list and any future treasures we might add!
 */

import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import GroceryList from './components/GroceryList';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <GroceryList />
      </div>
    </AuthProvider>
  );
};

export default App; 