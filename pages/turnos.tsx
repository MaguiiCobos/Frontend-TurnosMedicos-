import React from 'react';
import { useAuth } from '../src/hooks/useAuth';
import Header from '../src/components/Layout/Header';
import TurnosView from '../src/components/Turnos/TurnosView';

export default function TurnosPage() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-blue-600 font-medium">Cargando turnos disponibles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Agenda de Turnos Médicos</h1>
                    <p className="text-sm text-slate-600">Seleccioná un espacio disponible para agendar tu consulta médica.</p>
                </div>
                <TurnosView />
            </main>
        </div>
    );
}