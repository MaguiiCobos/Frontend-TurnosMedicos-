export const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'dev-2yrckbrmnb1o4m1v.us.auth0.com',
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '7A1QSBdEVoqg8mKMcrxD0szW3Ca2NVSa',
  redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  
  // Cambiado para que coincida con el Identifier de la API en tu Dashboard de Auth0
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://api.turnosmedicos.com',
  
  // Scopes adaptados para control de acceso basado en recursos médicos (RBAC)
  scope: 'openid profile email read:turnos write:turnos'
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';