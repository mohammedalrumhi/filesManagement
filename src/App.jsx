import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";
import { Children, useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequiredAuth = ({ Children }) => {
    return currentUser ? Children : <Navigate to="/login" />;
  };
  return (
    <BrowserRouter>
      <Routes>
        {/* this is routes  */}
        <Route path="/login" element={<Auth />}></Route>
        <Route
          path="/home"
          element={
            <RequiredAuth>
              <Home />
            </RequiredAuth>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
