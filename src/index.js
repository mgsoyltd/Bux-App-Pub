import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './styles/index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.css";
import logger from "./services/logService";

logger.init();

// console.log(`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

