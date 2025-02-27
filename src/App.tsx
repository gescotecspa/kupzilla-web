import { BrowserRouter, Routes } from "react-router-dom";
import { renderRoutes, routes } from "./router/index";
import apiClient from "./api/axiosConfig"; // <-- Nuevo import

const App = () => {

  const handleTest = async () => {
    try {
      const response = await apiClient.get("/users");
      console.log("Respuesta del backend:", response.data);
    } catch (error) {
      console.error("Error al hacer la petición:", error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
      {/* Botón para probar el backend */}
      <button onClick={handleTest}></button>
    </BrowserRouter>
  );
};

export default App;
