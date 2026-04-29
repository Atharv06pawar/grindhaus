import React, { createContext, startTransition, useContext, useEffect, useState } from "react";

import { bindUnauthorizedHandler, getCurrentSession, setAccessToken } from "../lib/api";

const STORAGE_KEY = "grindhaus-auth-session";
const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue);

    if (!parsedValue?.token || !parsedValue?.user) {
      return null;
    }

    return {
      token: parsedValue.token,
      user: parsedValue.user
    };
  } catch (_error) {
    return null;
  }
}

function persistSession(session) {
  if (!session?.token || !session?.user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const applySession = (nextSession) => {
      setAccessToken(nextSession?.token || "");
      persistSession(nextSession);
      startTransition(() => {
        setSession(nextSession);
      });
    };

    const unsubscribe = bindUnauthorizedHandler(() => {
      applySession(null);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const storedSession = readStoredSession();

    if (!storedSession) {
      setAccessToken("");
      setIsInitializing(false);
      return;
    }

    let isMounted = true;
    setAccessToken(storedSession.token);

    getCurrentSession()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const nextSession = {
          token: storedSession.token,
          user: response.user
        };

        persistSession(nextSession);
        startTransition(() => {
          setSession(nextSession);
        });
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setAccessToken("");
        persistSession(null);
        startTransition(() => {
          setSession(null);
        });
      })
      .finally(() => {
        if (isMounted) {
          setIsInitializing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (authPayload) => {
    const nextSession = {
      token: authPayload.token,
      user: authPayload.user
    };

    setAccessToken(nextSession.token);
    persistSession(nextSession);
    startTransition(() => {
      setSession(nextSession);
    });
  };

  const logout = () => {
    setAccessToken("");
    persistSession(null);
    startTransition(() => {
      setSession(null);
    });
  };

  const refreshSession = async () => {
    const response = await getCurrentSession();

    if (session?.token) {
      const nextSession = {
        token: session.token,
        user: response.user
      };

      setAccessToken(nextSession.token);
      persistSession(nextSession);
      startTransition(() => {
        setSession(nextSession);
      });
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: session?.user || null,
        isAuthenticated: Boolean(session?.token),
        isInitializing,
        login,
        logout,
        refreshSession,
        token: session?.token || ""
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
