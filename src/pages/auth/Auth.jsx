import React, { useContext, useReducer } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { auth, getUserById } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import authReducer from "../../reducers/authReducer";

const Auth = () => {
  const [state, dispatch] = useReducer(authReducer, {
    email: "",
    password: "",
    errorMessage: "",
  });

  const { dispatch: authDispatch } = useContext(AuthContext);

  const { email, password, errorMessage, loading } = state;
  const toPage = useNavigate();

  const handleLogin = async (e) => {
    dispatch({ type: "SET_LOADING", payload: true });
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        const userObject = await getUserById("users", userCredential.user.uid);
        authDispatch({
          type: "LOGIN",
          payload: { auth: userCredential.user, user: userObject },
        });
        toPage("/");
      }

      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_ERROR_MESSAGE", payload: "هناك خطا في المدخلات" });
    }
  };

  return (
    <div className="min-h-screen max-h-screen max-w-screen flex items-center justify-center overflow-hidden ">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col justify-center items-center">
          <img src="/logo.svg" width={90} alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-800">
            الدخول للنظام
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) =>
                  dispatch({ type: "SET_EMAIL", payload: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) =>
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                }
              />
            </div>
          </div>
          {loading && (
            <div className="flex justify-center">
              <div className="spinner-border text-indigo-500" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {errorMessage && (
            <div className="text-red-500 text-center">{errorMessage}</div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-black text-sm font-medium rounded-md text-black bg-white hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              disabled={loading}
            >
              دخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
