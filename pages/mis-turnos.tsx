import React, { useEffect } from 'react';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import MisTurnosView from '../src/components/MisTurnos/MisTurnosView';
import { useRouter } from 'next/router';

export default function MisTurnosPage() {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-blue-600 font-medium">Cargando tus turnos...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    if (!hasRole('usuario')) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <main className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm border border-slate-100">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                        <p className="text-slate-600">Esta sección es exclusiva para pacientes registrados.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Mis Turnos Médicos</h1>
                    <p className="text-sm text-slate-600">Aquí puedes revisar el estado de tus citas programadas.</p>
                </div>
                <MisTurnosView userView />
            </main>
        </div>
    );
}