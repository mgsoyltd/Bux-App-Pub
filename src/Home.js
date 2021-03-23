import { useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import HomeSection from './components/HomeSection';
import App from './App';
import { AppContextProvider } from './appContext';

function Home() {
  const [hidden, setHidden] = useState(false);

  const onToggle = () => {
    setHidden(!hidden);
  }

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
