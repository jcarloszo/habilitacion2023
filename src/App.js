import "./App.css";
import Mapa from "./componentes/Mapa/Mapa";
import ListaPuntos from "./componentes/ListaPuntos/ListaPuntos";
import Login from "./componentes/Login/Login.tsx";

import firebase,{FirebaseContext} from './firebase/index.js'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "animate.css";

import "animate.css";
import { SesionProvider } from "./models/Sesion/Sesion.tsx";

function App() {
  return (
    <FirebaseContext.Provider
    value={{firebase}}
    >
      <div className="bg-black flex items-center justify-center relative h-screen">
        <Router>
          <SesionProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/puntos" element={<ListaPuntos />} />
              <Route path="/mapa" element={<Mapa />} />
            </Routes>
          </SesionProvider>
        </Router>
      </div>
    </FirebaseContext.Provider>
  );
}
export default App;
