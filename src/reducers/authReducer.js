// authReducer.js
const initialState = {
  email: "",
  password: "",
  errorMessage: "",
  loading: false,
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
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
