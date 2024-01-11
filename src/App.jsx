import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";


import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Files from "./pages/files/Files";

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequiredAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const IsLogged = ({ children }) => {
    return currentUser ? <Navigate to="/" /> : children;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequiredAuth>
              <Home />
            </RequiredAuth>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <IsLogged>
              <Auth />
            </IsLogged>
          }
        ></Route>
        <Route
          path="/files/:groupId"
          element={
            <RequiredAuth>
              <Files />
            </RequiredAuth>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
