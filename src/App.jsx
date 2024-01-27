import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Files from "./pages/files/Files";
import "./App.css";
function App() {
  const { currentUser } = useContext(AuthContext);

  const RequiredAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const IsLogged = ({ children }) => {
    return currentUser ? <Navigate to="/" /> : children;
  };
  return (
    <>
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
          <Route path="/login" element={<Auth />}></Route>
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
      <div className="blob w-60 h-60 md:w-[800px] md:h-[800px] rounded-[999px] absolute top-[100px] right-0 -z-10 blur-3xl bg-opacity-60 opacity-35 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200"></div>
      <div className="blob w-60 h-60 md:w-[1000px] md:h-[1000px] rounded-[999px] absolute  top-[100px] left-0 -z-10 blur-3xl bg-opacity-60 opacity-35 bg-gradient-to-r from-red-200 via-gray-200 to-blue-200"></div>
      <div className="blob  w-30 h-30 md:w-[600px] md:h-[600px] rounded-[999px] absolute  left-0 -z-10 blur-3xl bg-opacity-60 opacity-35 bg-gradient-to-r from-slate-100 via-teal-100 to-blue-200"></div>
      <div className="blob w-15 h-15 md:w-[300px] md:h-[300px] rounded-[999px] absolute top-[100px] left-0 -z-10 blur-3xl bg-opacity-60 opacity-35 bg-gradient-to-r from-green-200 via-cyan-200 to-Fuchsia-300"></div>
    </>
  );
}

export default App;
