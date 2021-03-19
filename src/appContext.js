import { createContext, useState } from "react";

const AppContext = createContext([{}, () => { }]);

const AppContextProvider = (props) => {
  const [state, setState] = useState({ language: 'fi' });

  return (
    <AppContext.Provider value={[state, setState]}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };