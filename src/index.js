import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import Home from './Home';
import "bootstrap/dist/css/bootstrap.css";
import logger from "./services/logService";
import checkEnv from "./utils/config";

// Init logger
logger.init();

// Check mandatory configuration
checkEnv();

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);

