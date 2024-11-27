import React from "react";
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

//https://github.com/docker/awesome-compose/tree/master/react-nginx/src

//initialize React root node
const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<App />);