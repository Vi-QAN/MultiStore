
import React, { createContext, useContext, useState, useEffect} from 'react';

const AuthenticationContext = createContext();

const useAuthentication = () => {
    const [loggedIn, setLoggedIn] = useState(false); // Assuming user is initially not logged in
    const [username, setUsername] = useState(''); // Username of the logged-in user
    const [token, setToken] = useState(null);

    const isAuthenticated = () => {
        const credential = JSON.parse(localStorage.getItem('credential'))
        return credential !== null;
    }

    useEffect(() => {
        const credential = JSON.parse(localStorage.getItem('credential'))
        if (credential){
          setLoggedIn(true);
          setUsername(credential.username);
          setToken(credential.token);
        } else {
          setLoggedIn(false);
          setUsername('');
          setToken(null);
        }
    },[])
    return {
        loggedIn, 
        username,
        token,
        setLoggedIn,
        setUsername,
        isAuthenticated,
        setToken
    };
};

export const AuthenticationProvider = ({ children }) => {
    const auth = useAuthentication();
  
    return (
      <AuthenticationContext.Provider value={auth}>
        {children}
      </AuthenticationContext.Provider>
    );
};

export const AuthenticationConsumer = () => {
    return useContext(AuthenticationContext);
};


