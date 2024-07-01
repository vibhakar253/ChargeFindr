import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if user info is stored in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Assuming we have userId stored in localStorage after login
          const userId = localStorage.getItem('userId');
          if (userId) {
            const response = await axios.get(`http://localhost:7000/users/${userId}`);
            if (response.data) {
              setUser(response.data);
              // Save to localStorage
              localStorage.setItem('user', JSON.stringify(response.data));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally handle error state or inform the user
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
