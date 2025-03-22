/**
 * Arrr! This be the main vessel of our application!
 * The mighty container that holds our ship's grocery list and any future treasures we might add!
 */

import React from 'react';
import GroceryList from './components/GroceryList';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <GroceryList />
    </div>
  );
};

export default App; 