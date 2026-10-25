/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const CREDENCIALES_ADMIN = {
  email: 'admin@vetsanmarcos.cl',
  password: 'Admin123*',
  nombre: 'Administrador San Marcos',
  rol: 'admin',
  telefono: '+56912345678',
  rut: '11.111.111-1',
  tieneMascotas: 'Sí',
  cantidadMascotas: 3
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuarioAutenticado');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuarioAutenticado');
    }
  }, [usuario]);

  const login = (email, password) => {
    // 1. Verificación de credenciales de administrador por defecto
    if (email === CREDENCIALES_ADMIN.email && password === CREDENCIALES_ADMIN.password) {
      const usuarioAdmin = {
        nombre: CREDENCIALES_ADMIN.nombre,
        email: CREDENCIALES_ADMIN.email,
        rol: CREDENCIALES_ADMIN.rol,
        telefono: CREDENCIALES_ADMIN.telefono,
        rut: CREDENCIALES_ADMIN.rut,
        tieneMascotas: CREDENCIALES_ADMIN.tieneMascotas,
        cantidadMascotas: CREDENCIALES_ADMIN.cantidadMascotas
      };
      setUsuario(usuarioAdmin);
      localStorage.setItem('usuarioAutenticado', JSON.stringify(usuarioAdmin));
      return { exito: true, usuario: usuarioAdmin };
    }

    // 2. Verificación de usuario registrado en localStorage
    const correoGuardado = localStorage.getItem('correoGuardado');
    const contrasenaGuardada = localStorage.getItem('contrasenaGuardada');
    const perfilGuardado = localStorage.getItem('perfilGuardado');

    if (correoGuardado && contrasenaGuardada && email === correoGuardado && password === contrasenaGuardada) {
      const datosExtra = perfilGuardado ? JSON.parse(perfilGuardado) : {};
      const usuarioNormal = {
        nombre: datosExtra.nombre || 'Usuario Cliente',
        email: correoGuardado,
        rol: 'cliente',
        telefono: datosExtra.telefono || '+56912345678',
        rut: datosExtra.rut || '12.345.678-9',
        tieneMascotas: datosExtra.tieneMascotas || 'Sí',
        cantidadMascotas: datosExtra.cantidadMascotas || 1
      };
      setUsuario(usuarioNormal);
      localStorage.setItem('usuarioAutenticado', JSON.stringify(usuarioNormal));
      return { exito: true, usuario: usuarioNormal };
    }

    return { exito: false, mensaje: 'El correo o la contraseña son incorrectos.' };
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioAutenticado');
  };

  const registrarUsuario = (datos) => {
    localStorage.setItem('correoGuardado', datos.email);
    localStorage.setItem('contrasenaGuardada', datos.password);
    localStorage.setItem('perfilGuardado', JSON.stringify(datos));
    return { exito: true };
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado: Boolean(usuario),
        login,
        logout,
        registrarUsuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
