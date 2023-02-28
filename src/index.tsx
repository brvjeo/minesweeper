import React from 'react';
import ReactDom from 'react-dom/client';
import App from '@components/App';
import './styles/styles.scss';

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<App />);
