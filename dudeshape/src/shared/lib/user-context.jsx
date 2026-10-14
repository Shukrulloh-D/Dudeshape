import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);
const KEY = 'dudeshape_user';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
  }, []);

  const login = (token, data) => {
    localStorage.setItem('token', token);
    localStorage.setItem(KEY, JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
