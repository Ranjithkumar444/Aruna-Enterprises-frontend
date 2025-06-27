const AppWithHeader = ({ children }) => {
    return (
      <>
        <Header /> 
        {children}
      </>
    );
  };

  export default AppWithHeader;