import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import LogoutButton from "../Auth/LogoutButton";
import LoginButton from "../Auth/LoginButton";

const Header: React.FC = () => {
  const { isAuthenticated, user, hasRole } = useAuth();
  const router = useRouter();

  // Cambiado a la paleta médica (azul profesional) para indicar la pestaña activa
  const isActive = (path: string) => {
    return router.pathname === path
      ? "bg-blue-600 text-white"
      : "text-slate-600 hover:bg-slate-100";
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Médico */}
          <Link href="/" className="text-xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">
            🏥 <span className="text-blue-600">Portal</span>Salud
          </Link>

          {isAuthenticated ? (
            <nav className="flex items-center space-x-2">
              {/* Ruta pública / compartida para ver la cartilla */}
              <Link
                href="/turnos"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(
                  "/turnos"
                )}`}
              >
                Cartilla de Turnos
              </Link>

              {/* Enlace exclusivo para Pacientes (usuario) */}
              {hasRole("usuario") && (
                <Link
                  href="/mis-turnos"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(
                    "/mis-turnos"
                  )}`}
                >
                  Mis Citas
                </Link>
              )}

              {/* Panel compartido de gestión para Recepcionistas o Médicos (admin) */}
              {(hasRole("recepcionista") || hasRole("admin")) && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(
                    "/admin"
                  )}`}
                >
                  Panel Profesional
                </Link>
              )}

              {/* Información de Usuario y Logout */}
              <div className="flex items-center space-x-3 ml-4 border-l border-slate-200 pl-4">
                <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                  {user?.name}
                </span>
                <LogoutButton />
              </div>
            </nav>
          ) : (
            <div className="flex items-center">
              <LoginButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;