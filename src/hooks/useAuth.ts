import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { UserProfile } from "../types";
import { setAuthToken } from "../services/api";

// prueba para simular roles sin cambiar de cuenta
const TEST_MODE = false;
const TEST_ROLE = "USUARIO"; // 'ADMIN' / 'RECEPCIONISTA' / 'USUARIO'

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
          // Guardamos el token en Axios para que todas las llamadas privadas vayan firmadas
          setAuthToken(token); 
        } catch (e) {
          console.error("Error guardando el token de autenticación:", e);
        }

        // Simulación inteligente para el video
        if (TEST_MODE) {
          setUser({
            sub: auth0User.sub || "",
            email: auth0User.email || "",
            name: auth0User.name || "",
            roles: [TEST_ROLE],
          });
        } else {
          // Cambiamos el namespace de la cafetería al del centro médico
          const roles = auth0User["https://turnos-medicos.com/roles"] || ["USUARIO"];
          setUser({
            sub: auth0User.sub || "",
            email: auth0User.email || "",
            name: auth0User.name || "",
            roles: roles,
          });
        }
      } else if (!isAuthenticated) {
        setUser(null);
        setSynced(false);
      }
    };
    syncAndSetUser();
  }, [isAuthenticated, auth0User, getAccessTokenSilently, synced]);

  useEffect(() => {
    // Muestra el token en la consola de desarrollo
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        console.log("JWT de Auth0:", token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles
      .map((r) => r.trim().toLowerCase())
      .includes(role.trim().toLowerCase());
  };

  const login = () => {
    loginWithRedirect();
  };

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