import React from "react";
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App/App';


//initialize React root node
const domNode = document.getElementById('root');
const root = createRoot(domNode);


root.render(<App />);