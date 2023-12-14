// Inside your Auth component
import React, { useContext, useReducer } from "react";
import style from "./auth.module.scss";
import authReducer from "../../reducers/authReducer";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";

const Auth = () => {
  const [state, dispatch] = useReducer(authReducer, {
    email: "",
    password: "",
    errorMessage: "",
  });

  const { dispatch: authDispatch } = useContext(AuthContext);

  const { email, password, errorMessage } = state;
  const toPage = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in with email and password using Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // If successful, you can access userCredential.user
      if (userCredential.user) {
        //console.log("this is user " + userCredential.user.email);
        authDispatch({ type: "LOGIN", payload: userCredential.user });
        toPage("/home");
      }

      // Reset the form after successful login
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      // Handle login errors and display error message
      dispatch({ type: "SET_ERROR_MESSAGE", payload: error.message });
    }
  };

  return (
    <div className={style.login}>
      <div className={style.wrapperLogin}>
        <div className="container">
          <h2>الدخول للنظام</h2>
          <form onSubmit={handleLogin} className={style.loginForm}>
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) =>
                  dispatch({ type: "SET_EMAIL", payload: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">كلمة المرور</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) =>
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                }
              />
            </div>

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              دخول
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
