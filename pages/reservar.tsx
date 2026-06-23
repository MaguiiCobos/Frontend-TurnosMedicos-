import React, { useEffect } from 'react';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import MisTurnosView from '../src/components/MisTurnos/MisTurnosView';
import { useRouter } from 'next/router';

export default function ReservarPage() {
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
                    <p className="mt-4 text-blue-600 font-medium">Cargando módulo de reservas...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    // solo pueden ingresar los pacientes (usuario)
    if (!hasRole('usuario')) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <main className="container mx-auto px-4 py-16">
                    <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm border border-slate-100">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
                        <p className="text-slate-600">Esta función está reservada exclusivamente para la solicitud de turnos por pacientes.</p>
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
                    <h1 className="text-2xl font-bold text-slate-800">Confirmación y Reserva de Citas</h1>
                    <p className="text-sm text-slate-600">Completá los pasos para asegurar tu espacio de atención.</p>
                </div>
                <MisTurnosView userView={true} />
            </main>
        </div>
    );
}