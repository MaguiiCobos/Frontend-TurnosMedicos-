import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { UserProfile } from "../types";
import { setAuthToken } from "../services/api";
import { API_BASE_URL } from "../config/auth0";

export const useAuth = () => {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const syncAndSetUser = async () => {
      if (isAuthenticated && auth0User && !synced) {
        setSynced(true);
        try {
          const token = await getAccessTokenSilently();
          setAuthToken(token);

          // Sincroniza el usuario con la bd al iniciar sesión (crea o actualiza el registro en la tabla personas)
          await fetch(`${API_BASE_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });

        } catch (e) {
          console.error("Error sincronizando usuario con el backend:", e);
        }

        const roles = auth0User["https://turnos-medicos.com/roles"] || ["usuario"];
        setUser({
          sub: auth0User.sub || "",
          email: auth0User.email || "",
          name: auth0User.name || "",
          roles: roles,
        });

      } else if (!isAuthenticated) {
        setUser(null);
        setSynced(false);
      }
    };
    syncAndSetUser();
  }, [isAuthenticated, auth0User, getAccessTokenSilently, synced]);

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles
      .map((r) => r.trim().toLowerCase())
      .includes(role.trim().toLowerCase());
  };

  const login = () => loginWithRedirect();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: typeof window !== "undefined" ? window.location.origin : "",
      },
    });
  };

  const getAccessToken = async (): Promise<string> => {
    return await getAccessTokenSilently();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    login,
    logout: handleLogout,
    getAccessToken,
  };
};