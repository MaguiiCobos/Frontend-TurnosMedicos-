import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import AdminView from '../src/components/Admin/AdminView';
import RecepcionistaView from '../src/components/Admin/RecepcionistaView';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si terminó de cargar y no está autenticado se redirige al home
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Cargando panel médico...</p>
      </div>
    );
  }

  if (!user) return null;

  const userRoles = (user as any).roles || [];
  const esMedico = userRoles.includes('ADMIN');
  const esRecepcionista = userRoles.includes('RECEPCIONISTA');

  // Si no es ni médico ni recepcionista no puede acceder a esta página
  if (!esMedico && !esRecepcionista) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500 font-bold">Acceso Denegado. No tenés permisos médicos.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Centro Médico - Panel de Gestión</h1>
          <p className="text-gray-600">
            Conectado como: <span className="font-semibold">{user.email}</span> ({esMedico ? 'Médico Principal' : 'Recepción'})
          </p>
        </div>

        {/* muestra la vista según el rol */}
        {esMedico ? (
          <AdminView />
        ) : (
          <RecepcionistaView />
        )}
      </main>
    </div>
  );
}