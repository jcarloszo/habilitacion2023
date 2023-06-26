import React, { createContext, useState } from "react";
import Usuario from "../User/User";

interface ISesion {
  user: Usuario | null;
  iniciarSesion: (usuario: Usuario) => void;
  cerrarSesion: () => void;
}

const SesionContext = createContext<ISesion | undefined>(undefined);

const SesionProvider: React.FC = ({ children }) => {
  const [user, setUsuario] = useState<Usuario | null>(null);

  const iniciarSesion = (user: Usuario) => {
    user.date = new Date();
    setUsuario(user);
  };

  const cerrarSesion = () => {
    setUsuario(null);
  };

  const valoresContexto: ISesion = {
    user,
    iniciarSesion,
    cerrarSesion,
  };

  return (
    <SesionContext.Provider value={valoresContexto}>
      {children}
    </SesionContext.Provider>
  );
};

export { SesionContext, SesionProvider };
