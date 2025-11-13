import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- 1. Importa el router
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // --- INICIO DEL CAMBIO ---
  // 2. Envuelve tu App con el BrowserRouter y el basename
  <BrowserRouter basename="/mapa-lidia-2/">
    <App />
  </BrowserRouter>
  // --- FIN DEL CAMBIO ---
);
