const AppWithHeader = ({ children }) => {
    return (
      <>
        <Header /> {/* Your header component */}
        {children}
      </>
    );
  };

  export default AppWithHeader;