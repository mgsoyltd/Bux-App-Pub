import { useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import HomeSection from './components/HomeSection';
import App from './App';
import { AppContextProvider } from './appContext';
import auth from "./services/authService";

function Home() {
  const [hidden, setHidden] = useState(auth.isLoggedIn());

  const onToggle = () => {
    setHidden(!hidden);
  }

  // If no user is logged in, then show the greetings page
  // otherwise show the application page
  return (
    <Router>
      <AppContextProvider>
        {!hidden && (<HomeSection onToggle={onToggle} />)}
        {hidden && (<App />)}
      </AppContextProvider>
    </Router>
  );
}

export default Home;
