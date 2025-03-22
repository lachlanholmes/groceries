/**
 * Shiver me timbers! This here be the entry point of our application!
 * The first mate that bootstraps our React ship and sets her sailing!
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 