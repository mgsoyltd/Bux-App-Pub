import { createContext, useState, useEffect } from "react";

const AppContext = createContext([{}, () => { }]);
const languageStorage = "selectedLanguage";

const AppContextProvider = (props) => {
  const [state, setState] = useState({ language: '' });

  useEffect(() => {
    const init = () => {
      let langu = localStorage.getItem(languageStorage);
      if (!langu || langu === "") {
        langu = 'fi';
        localStorage.setItem(languageStorage, langu);
      }
      setState({ language: langu });
    }
    init();
  }, [])

  useEffect(() => {
    localStorage.setItem(languageStorage, state.language);
  }, [state])

  return (
    <AppContext.Provider value={[state, setState]}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };