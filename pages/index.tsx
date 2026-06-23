import React, { useEffect } from 'react'
import { useAuth } from '../src/hooks/useAuth'
import Header from '../src/components/Layout/Header'
import LoginButton from '../src/components/Auth/LoginButton'
import { useRouter } from 'next/router'

export default function Home() {
    const { isAuthenticated, isLoading, hasRole } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            if (hasRole('admin')) {
                router.push('/admin')
            } else if (hasRole('recepcionista')) {
                router.push('/admin')
            } else if (hasRole('usuario')) {
                router.push('/turnos')
            }
        }
    }, [isAuthenticated, hasRole, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-blue-600 font-medium">Cargando sistema médico...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="container mx-auto px-4 py-16">
                {!isAuthenticated ? (
                    <div className="text-center max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
                            Sistema de Gestión de Turnos Médicos
                        </h1>
                        <p className="text-slate-600 mb-8 text-lg">
                            Bienvenido a nuestro portal de salud institucional. Para reservar una cita médica, revisar tus turnos vigentes o acceder al panel profesional, por favor inicia sesión de forma segura.
                        </p>
                        <div className="inline-block transform hover:scale-105 transition-transform duration-200">
                            <LoginButton />
                        </div>
                    </div>
                ) : (
                    
                    <div className="text-center mt-12">
                        <p className="text-slate-600 animate-pulse">Redirigiéndote a tu panel...</p>
                    </div>
                )}
            </main>
        </div>
    )
}