import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Function to render the app
const renderApp = () => {
  // Get the root element
  const container = document.getElementById('root');

  // Check if the root element exists
  if (!container) {
    console.error('Root element not found. Retrying in 100ms...');
    setTimeout(renderApp, 100);
    return;
  }

  // Render the app
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    container
  );
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
