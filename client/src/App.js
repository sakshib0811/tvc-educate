import React from "react";
import "./styles/main.css";
import AppProviders from "./components/AppProviders/AppProviders";
import MainRouter from "./MainRouter";
import useMediaQuery from "./hooks/useMediaQuery";


export const UtilityContext = React.createContext({ isMobile: false });

const App = () => {

  const isMobile = useMediaQuery('(max-width: 580px)');

  // const isTablet=useMediaQuery('(max-width: 800px')

  return (
    <UtilityContext.Provider value={{ isMobile }}>
      <AppProviders>
        <MainRouter />
      </AppProviders>
    </UtilityContext.Provider>
  );
};

export default App;
