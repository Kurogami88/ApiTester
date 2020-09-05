import 'primeflex/primeflex.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const rootEl = document.getElementById('root');
ReactDOM.render(<App />, rootEl);

// comment in for PWA with service worker in production mode
// registerServiceWorker();
