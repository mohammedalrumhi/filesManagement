// authReducer.js
const initialState = {
  email: "",
  password: "",
  errorMessage: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
      };
    case "SET_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: action.payload,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
