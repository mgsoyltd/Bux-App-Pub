import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import Home from './Home';
import "bootstrap/dist/css/bootstrap.css";
import logger from "./services/logService";

logger.init();

// console.log(`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`);

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);

